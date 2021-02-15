import Keycloak, {KeycloakConfig, KeycloakInitOptions, KeycloakInstance} from 'keycloak-js';
import Cookies from 'js-cookie';

export let keycloak;

const TOKEN_COOKIE_NAME = "masSSOToken";
const REFRESH_TOKEN_COOKIE_NAME = "masSSORefreshToken";


/**
 * Get keycloak instance
 *
 * @return an initiated keycloak instance or `undefined`
 * if keycloak isn't configured
 *
 */
export const getKeycloakInstance = async (config) => {
  if (!keycloak) await init(config);
  storeTokensInCookies();
  return keycloak;
}

const storeTokensInCookies = () => {
  // Only do this in prod, in dev it breaks the proxy setup :-(
  if (process.env.NODE_ENV === "production" && keycloak?.token && keycloak.refreshToken) {
    Cookies.set(TOKEN_COOKIE_NAME, keycloak?.token);
    Cookies.set(REFRESH_TOKEN_COOKIE_NAME, keycloak?.refreshToken);
  }
}

/**
 * Initiate keycloak instance.
 *
 * Set keycloak to undefined if
 * keycloak isn't configured
 *
 */
export const init = async (config) => {
  try {
    keycloak = new (Keycloak)(config);
    if (keycloak) {
      const initOptions = {
        onLoad: 'login-required',
        responseMode: "query",
      };
      const storedRefreshToken = Cookies.get(REFRESH_TOKEN_COOKIE_NAME);
      const storedToken = Cookies.get(TOKEN_COOKIE_NAME);
      if (storedRefreshToken && storedToken) {
        initOptions.refreshToken = storedRefreshToken;
        initOptions.token = storedToken;
      }
      await keycloak.init(initOptions);
    }
  } catch {
    keycloak = undefined;
    console.warn('Auth: Unable to initialize keycloak. Client side will not be configured to use authentication');
  }
}


/**
 * Use keycloak update token function to retrieve
 * keycloak token
 *
 * @return keycloak token or empty string if keycloak
 * isn't configured
 *
 */
export const getKeyCloakToken = async () => {
  await keycloak?.updateToken(50);
  if (keycloak?.token) {
    storeTokensInCookies();
    return keycloak.token;
  }
  console.error('No keycloak token available');
  return 'foo';
}
3
/**
 * logout of keycloak, clear cache and offline store then redirect to
 * keycloak login page
 *
 * @param keycloak the keycloak instance
 * @param client offix client
 *
 */
export const logout = async (keycloak) => {
  if (keycloak) {
    await keycloak.logout();
  }
}
