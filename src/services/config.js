import cookies from 'js-cookie';

const authHeader = () => {
  const authToken = cookies.get(process.env.REACT_APP_AUTH_TOKEN) || '';

  if (authToken === '') {
    return {};
  }

  return {
    Authorization: `Token ${authToken}`
  };
};

const serviceConfig = (passedConfig = {}, auth = true) => {
  passedConfig.url = '/api/application-services/cloud-tutorials' + passedConfig.url;
  return Object.assign(
    {
      headers: auth ? authHeader() : {},
      timeout: process.env.REACT_APP_AJAX_TIMEOUT,
    },
    passedConfig
  );
}

export { serviceConfig as default };
