const { defineConfig } = require("@vue/cli-service");

module.exports = defineConfig({
  transpileDependencies: true,
  devServer: {
    port: process.env.VUE_APP_PORT || 8080,
    proxy: {
      "/api": {
        target: "http://localhost:8081",
        changeOrigin: true,
        pathRewrite: { "^/api": "/api" }, // Ensure the pathRewrite is correctly set
      },
    },
  },
});
