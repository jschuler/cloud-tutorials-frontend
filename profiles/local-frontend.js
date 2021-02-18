const SECTION = 'application-services';
// const SECTION = 'mosaic';
const APP_ID = 'cloud-tutorials';
const FRONTEND_PORT = 8002;
const routes = {};

routes[`/beta/${SECTION}/${APP_ID}`] = {
  host: `https://localhost:${FRONTEND_PORT}`,
};
routes[`/${SECTION}/${APP_ID}`] = {
  host: `https://localhost:${FRONTEND_PORT}`,
};
routes[`/beta/apps/${APP_ID}`] = { host: `https://localhost:${FRONTEND_PORT}` };
routes[`/apps/${APP_ID}`] = { host: `https://localhost:${FRONTEND_PORT}` };

module.exports = { routes };


// const SECTION = 'application-services';
// const FRONTEND_PORT = 8003;
// const routes = {};

// routes[`/beta/${SECTION}/${APP_ID}`] = { host: `https://localhost:${FRONTEND_PORT}` };
// routes[`/${SECTION}/${APP_ID}`]      = { host: `https://localhost:${FRONTEND_PORT}` };
// routes[`/beta/apps/${SECTION}/${APP_ID}`]       = { host: `https://localhost:${FRONTEND_PORT}` };
// routes[`/apps/${SECTION}/${APP_ID}`]            = { host: `https://localhost:${FRONTEND_PORT}` };

// module.exports = { routes };