import Keycloak, {KeycloakConfig, KeycloakInitOptions, KeycloakInstance} from 'keycloak-js';

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
  return keycloak;
}

/**
 * Initiate keycloak instance.
 *
 * Set keycloak to undefined if
 * keycloak isn't configured
 *
 */
/*
bad
https://keycloak-edge-redhat-rhoam-user-sso.apps.mas-sso-stage.1gzl.s1.devshift.org/auth/realms/mas-sso-staging/protocol/openid-connect/3p-cookies/step1.html
https://keycloak-edge-redhat-rhoam-user-sso.apps.mas-sso-stage.1gzl.s1.devshift.org/auth/realms/mas-sso-staging/protocol/openid-connect/auth?client_id=strimzi-ui&redirect_uri=https%3A%2F%2Fgoogle.com&state=cd1b6a04-595e-43f3-8189-a2a4b9cbfe12&response_mode=query&response_type=code&scope=openid&nonce=9355748f-7727-405b-81d3-3b181ff75cfe

good
https://keycloak-edge-redhat-rhoam-user-sso.apps.mas-sso-stage.1gzl.s1.devshift.org/auth/realms/mas-sso-staging/protocol/openid-connect/auth?client_id=strimzi-ui&redirect_uri=https%3A%2F%2Fprod.foo.redhat.com%3A1337%2Fbeta%2Fapplication-services%2Fopenshift-streams%2F&state=80989cfb-304b-4122-9381-4a32ded97f18&response_mode=query&response_type=code&scope=openid&nonce=2747b289-a1ef-4e0a-b518-ebcd0c6f02c4
*/

export const init = async (config) => {
  try {
    keycloak = new Keycloak(config);
    if (keycloak) {
      const initOptions = {
        onLoad: 'login-required',
        responseMode: "query",
        redirectUri: "https://prod.foo.redhat.com:1337/beta/application-services/cloud-tutorials/tutorial/"
      };
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
  debugger;
  if (keycloak?.token) {
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