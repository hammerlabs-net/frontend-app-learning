let platformApi = {
  getAuthenticatedUser: null,
  getAuthenticatedHttpClient: null,
  getConfig: null,
  logInfo: null,
  logError: null,
};

// eslint-disable-next-line import/prefer-default-export
export function configure(_platformApi) {
  platformApi = _platformApi;
}

export const getAuthenticatedUser = () => (platformApi.getAuthenticatedUser());
export const getAuthenticatedHttpClient = () => (platformApi.getAuthenticatedHttpClient());
export const getConfig = () => (platformApi.getConfig());
export const logInfo = (e) => (platformApi.logInfo(e));
export const logError = (e) => (platformApi.logError(e));
