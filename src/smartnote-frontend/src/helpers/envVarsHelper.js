const envVarsHelper = {
  getEnvVar: (key) => {
    return process.env[key];
  },

  getApiUrl: () => {
    return window.config?.VUE_APP_API_URL || process.env.VUE_APP_API_URL;
  },
};

export default envVarsHelper;
