/* eslint-disable no-shadow */
const express = require('express');
const path = require('path');
const fs = require('fs');
const asciidoctor = require('asciidoctor');
const Mustache = require('mustache');
const bodyParser = require('body-parser');
const flattenDeep = require('lodash.flattendeep');
const { sync, closeConnection, getUserWalkthroughs, setUserWalkthroughs, validUrl } = require('./model');

const app = express();

const adoc = asciidoctor();
const LOCAL_DEV_INSTALLED_SERVICES = {
  '3scale': {
    Host: 'https://3scale-admin.apps.demo.com',
    Version: '2.7'
  },
  amqonline: {
    Host: 'http://localhost:3003',
    Version: '1.3.1'
  },
  apicurito: {
    Host: 'http://localhost:4200',
    Version: '1.0.1'
  },
  codeready: {
    Host: 'https://codeready-redhat-rhmi-codeready-workspaces.apps.demo.com',
    Version: '2.0.0'
  },
  'fuse-managed': {
    Host: 'http://localhost:3000',
    Version: '7.5'
  },
  ups: {
    Host: 'https://ups-unifiedpush-proxy-redhat-rhmi-ups.apps.demo.com',
  },
  'user-rhsso': {
    Host: 'https://keycloak-edge-redhat-rhmi-user-sso.apps.demo.com',
    Version: '8.0.1'
  }
};
const CROSS_CONSOLE_ENABLED = false;

app.use(bodyParser.json());
const port = process.env.PORT || 5001;
const configPath = process.env.SERVER_EXTRA_CONFIG_FILE || '/etc/webapp/customServerConfig.json';

const DEFAULT_CUSTOM_CONFIG_DATA = {
  services: []
};

const walkthroughLocations =
  process.env.WALKTHROUGH_LOCATIONS || path.join(__dirname, 'walkthroughs');

const CONTEXT_PREAMBLE = 'preamble';
const CONTEXT_PARAGRAPH = 'paragraph';
const LOCATION_SEPARATOR = ',';

// Types of walkthrough location that can be provided.
const WALKTHROUGH_LOCATION_TYPE_GIT = 'git';
const WALKTHROUGH_LOCATION_TYPE_PATH = 'path';
const WALKTHROUGH_LOCATION_DEFAULT = {
  type: WALKTHROUGH_LOCATION_TYPE_GIT,
  commitHash: null,
  commitDate: null,
  remote: null,
  directory: null,
  header: null
};

const backendRequiredRoles = [
  'system:cluster-admins',
  'system:dedicated-admins',
  'dedicated-admins'
];

const walkthroughs = [];
let server;

app.get('/services', (req, res) => {
  res.setHeader('Content-Type', 'application/json');
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept');
  if ((isOpenShift4() || process.env.CROSS_CONSOLE_LOCAL_DEV_MODE === 'true') && CROSS_CONSOLE_ENABLED) {
    if (process.env.INSTALLED_SERVICES) {
      res.send(process.env.INSTALLED_SERVICES);
    } else {
      res.send(JSON.stringify(LOCAL_DEV_INSTALLED_SERVICES));
    }
  } else {
    res.send(JSON.stringify({}));
  }
});

app.get('/customWalkthroughs', (req, res) => {
  res.status(200).json(walkthroughs);
});

// Get all user defined walkthrough repositories
app.get('/user_walkthroughs', (req, res) =>
  getUserWalkthroughs()
    .then(data => {
      if (data) {
        const { value } = data;
        return res.json(value);
      }
      return res.end();
    })
    .catch(err => {
      console.error(err);
      return res.sendStatus(500);
    })
);

// Insert new user defined walkthrough repositories
// This requires cluster- or dedicated admin permissions
app.post('/user_walkthroughs', (req, res) => {
  const { data } = req.body;
  return setUserWalkthroughs(data)
    .then(({ value }) => res.json(value))
    .catch(err => {
      console.error(err);
      return res.sendStatus(500);
    });
});

app.get('/customConfig', (req, res) => {
  getCustomConfigData(configPath).then(config => {
    const compiledConfig = Mustache.render(JSON.stringify(config), req.query);
    res.json(JSON.parse(compiledConfig));
  });
});

app.get('/about', (_, res) => {
  const packageJson = require('./package.json');
  res.json({
    version: packageJson.version || 'Not Available',
    walkthroughLocations: getUniqueWalkthroughLocationInfos(walkthroughs)
  });
});

app.get('/upgrade_data', (_, res) => {
  res.json({
    upgradeData: JSON.parse(process.env.UPGRADE_DATA)
  });
});

app.get('/about/walkthrough/:walkthroughId', (req, res) => {
  const { walkthroughId } = req.params;
  const walkthrough = walkthroughs.find(w => w.id === walkthroughId);
  if (!walkthrough) {
    console.error('Could not find walkthrough with ID', walkthroughId);
    res.sendStatus(404);
    return;
  }
  res.json({
    walkthroughId,
    walkthroughLocation: walkthrough.walkthroughLocationInfo
  });
});

function getUniqueWalkthroughLocationInfos(walkthroughs) {
  const infos = {};
  walkthroughs.forEach(walkthrough => {
    const { walkthroughLocationInfo } = walkthrough;
    const walkthroughLocationId = `${walkthroughLocationInfo.remote}-${walkthroughLocationInfo.directory}`;

    if (!infos[walkthroughLocationId]) {
      infos[walkthroughLocationId] = Object.assign({ walkthroughs: [] }, walkthroughLocationInfo);
    }
    infos[walkthroughLocationId].walkthroughs.push({
      id: walkthrough.id,
      title: walkthrough.title
    });
  });
  return Object.values(infos);
}

// Dynamic static path for walkthrough assets. Based on the walkthrough ID
// provided it'll look in different paths.
app.get('/walkthroughs/:walkthroughId/files/*', (req, res) => {
  const {
    params: { walkthroughId }
  } = req;
  const file = req.param(0);
  const walkthrough = walkthroughs.find(wt => wt.id === walkthroughId);
  if (!walkthrough) {
    return res.status(404).json({ error: `Walkthrough with ID ${walkthroughId} is not found` });
  }
  // Dotpaths are not allowed by default, meaning an end-user shouldn't be able
  // to abuse the file system using the wildcard file param.
  return res.sendFile(path.resolve(__dirname, `${walkthrough.basePath}`, file));
});

// Reload each walkthrough. This will clone any repo walkthroughs.
app.post('/sync-walkthroughs', (_, res) => {
  loadAllWalkthroughs(walkthroughLocations)
    .then(() => {
      res.json(walkthroughs);
    })
    .catch(err => {
      console.error('An error occurred when syncing walkthroughs', err);
      res.json(500, { error: 'Failed to sync walkthroughs' });
    });
});

/**
 * Load walkthroughs from the passed locations.
 * @param location (string) A string that can contains one or more walkthrough locations.
 * Locations can either be paths in the filesystem or URLs pointing to git repositories. IF
 * multiple locations are provided they must be separated by LOCATION_SEPARATOR
 */
function loadAllWalkthroughs(location) {
  let locations = [];
  if (location.indexOf(LOCATION_SEPARATOR) >= 0) {
    locations = location.split(LOCATION_SEPARATOR);
  } else {
    locations.push(location);
  }

  walkthroughs.length = 0;
  return injectUserWalkthroughRepos(locations)
    .then(l => resolveWalkthroughLocations(l))
    .then(l => Promise.all(l.map(lookupWalkthroughResources)))
    .then(l => l.reduce((a, b) => a.concat(b)), []) // flatten walkthrough arrays of all locations
    .then(l => l.map(importWalkthroughAdoc))
    .then(l => Promise.all(l));
}

function injectUserWalkthroughRepos(locations) {
  return new Promise((resolve, reject) =>
    getUserWalkthroughs()
      .then(val => {
        if (!val) {
          return resolve(locations);
        }

        const { value } = val;
        if (!value || value === '') {
          return resolve(locations);
        }

        const urls = value.trim().split('\n');
        urls.filter(validUrl).forEach(url => {
          if (locations.indexOf(url) >= 0) {
            console.warn(`duplicate walkthrough repository ${url}`);
            return;
          }
          locations.push(url);
        });
        return resolve(locations);
      })
      .catch(reject)
  );
}

/**
 * Parses the locations provided in the env var `WALKTHROUGH_LOCATIONS` and resolves them:
 * If the location is a git repository it will be cloned and the path to the cloned repository
 * will be returned.
 * If the location is a path in the filesystem it will be returned directly.
 * @param locations An array of paths or URLs
 * @returns {Promise<any[]>}
 */
function resolveWalkthroughLocations(locations) {
  function isPath(p) {
    return p && fs.existsSync(p);
  }

  const mappedLocations = locations.map(location =>
    new Promise((resolve, reject) => {
      const locationResultTemplate = { origin: location };
      if (!location) {
        return reject(new Error(`Invalid location ${location}`));
      } else if (isPath(location)) {
        console.log(`Importing walkthrough from path ${location}`);
        const locationResult = Object.assign(
          {
            parentId: path.basename(location),
            walkthroughLocationInfo: Object.assign({}, WALKTHROUGH_LOCATION_DEFAULT, {
              type: WALKTHROUGH_LOCATION_TYPE_PATH,
              directory: path.basename(location)
            })
          },
          locationResultTemplate,
          { local: location }
        );
        return resolve(locationResult);
      }

      return reject(new Error(`${location} is not a path`));
    }).catch(err => {
      console.error(err);
      return undefined;
    })
  );

  return Promise.all(mappedLocations).then(promises =>
    // Ignore all locations that could not be resolved
    flattenDeep(promises.filter(p => !!p))
  );
}

/**
 * Check if a walkthrough location is valid and contains `walkthrough.adoc`
 * @param location Path to the walkthrough directory
 * @returns {Promise<any>}
 */
function lookupWalkthroughResources(location) {
  return new Promise((resolve, reject) => {
    if (!fs.existsSync(location.local)) {
      reject(new Error(`Could not find walkthroughs directory in provided location: ${location.origin}`));
    }
    fs.readdir(location.local, (err, files) => {
      if (err) {
        return reject(err);
      }

      const adocInfo = files.reduce((acc, dirName) => {
        const basePath = path.join(location.local, dirName);
        const adocPath = path.join(basePath, 'walkthrough.adoc');
        const jsonPath = path.join(basePath, 'walkthrough.json');

        if (!fs.existsSync(adocPath) || !fs.existsSync(jsonPath)) {
          console.log(
            `walkthrough.json and walkthrough.adoc must be included in walkthrough directory, skipping importing ${basePath}`
          );
          return acc;
        }

        acc.push({
          parentId: location.parentId,
          walkthroughLocationInfo: location.walkthroughLocationInfo,
          dirName,
          basePath,
          adocPath
        });

        return acc;
      }, []);
      return resolve(adocInfo);
    });
  });
}

/**
 * Load and process the Asciidoc of a walkthrough. Also checks if any of the walkthrough
 * IDs are duplicate and rejects them in that case.
 * @param adocContext (Object) Contains filesystem info about the walkthrough location
 * @returns {Promise<any>}
 */
function importWalkthroughAdoc(adocContext) {
  const { parentId, adocPath, dirName, basePath, walkthroughLocationInfo } = adocContext;

  return new Promise((resolve, reject) => {
    fs.readFile(adocPath, (err, rawAdoc) => {
      if (err) {
        return reject(err);
      }
      const loadedAdoc = adoc.load(rawAdoc);
      const walkthroughInfo = getWalkthroughInfoFromAdoc(parentId, dirName, basePath, loadedAdoc);
      walkthroughInfo.walkthroughLocationInfo = walkthroughLocationInfo;
      // Don't allow duplicate walkthroughs
      if (walkthroughs.find(wt => wt.id === walkthroughInfo.id)) {
        return reject(
          new Error(`Duplicate walkthrough with id ${walkthroughInfo.id} (${walkthroughInfo.shortDescription})`)
        );
      }
      walkthroughs.push(walkthroughInfo);
      return resolve();
    });
  });
}

function getCustomConfigData(configPath) {
  return new Promise(resolve => {
    if (!configPath) {
      return resolve(DEFAULT_CUSTOM_CONFIG_DATA);
    }
    fs.readFile(configPath, (err, data) => {
      if (err) {
        return resolve(DEFAULT_CUSTOM_CONFIG_DATA);
      }
      return resolve(JSON.parse(data));
    });
  });
}

function getWalkthroughInfoFromAdoc(parentId, id, dirName, doc) {
  // Retrieve the short description. There must be a gap between the document title and the short description.
  // Otherwise it's counted as the author field. For example, see this adoc file:
  // ````
  // = This is a title
  // This is an author field
  // This would be the revision field or something
  // This is the short description.
  // ````
  // So it's better to just tell the user to put a blank line between the title and short description
  let shortDescription = '';
  if (
    doc.blocks[0] &&
    doc.blocks[0].context === 'preamble' &&
    doc.blocks[0].blocks.length > 0 &&
    doc.blocks[0].blocks[0].lines &&
    doc.blocks[0].blocks[0].lines.length > 0
  ) {
    shortDescription = doc.blocks[0].blocks[0].lines[0];
  }

  return {
    // Using the repo name plus folder name should be sufficiently unique
    id: `${parentId}-${id}`,
    title: doc.getDocumentTitle(),
    shortDescription,
    time: getTotalWalkthroughTime(doc),
    adoc: path.join(dirName, 'walkthrough.adoc'),
    json: path.join(dirName, 'walkthrough.json'),
    basePath: dirName
  };
}

const getTotalWalkthroughTime = doc => {
  let time = 0;
  doc.blocks.forEach(b => {
    if (b.context === CONTEXT_PREAMBLE || b.context === CONTEXT_PARAGRAPH) {
      return;
    }
    time += parseInt(b.getAttribute('time'), 10) || 0;
  });
  return time;
};

if (process.env.NODE_ENV === 'production') {
  // Serve any static files
  app.use(express.static(path.join(__dirname, 'build')));
  // Handle React routing, return all requests to React app
  app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, 'build', 'index.html'));
  });
}

function run() {
  sync().then(() => {
    loadAllWalkthroughs(walkthroughLocations)
      .then(() => {
        server = app.listen(port, () => console.log(`Listening on port ${port}`));
      })
      .catch(err => {
        console.error(err);
        process.exit(1);
      });
  });
}

// Close all connections before shutting down
function stop() {
  console.log('Webapp shutting down');
  closeConnection().then(() => {
    server && server.close();
    console.log('Webapp shutdown complete');
  });
}

process.on('SIGTERM', stop);
process.on('SIGABRT', stop);
process.on('SIGQUIT', stop);
process.on('SIGINT', stop);

run();
