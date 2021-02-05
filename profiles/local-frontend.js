// const { routes: packageRoutes } = require('../package.json');
const SECTION = 'mosaic'; //packageRoutes.prefix;
const APP_ID = 'cloud-tutorials'; //packageRoutes.appname;
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
