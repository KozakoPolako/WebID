module.exports = {
  transpileDependencies: ["vuetify"],
  devServer: {
    proxy: {
      "^/api": {
        target: "https://192.168.0.246:3000",
        pathRewrite: { "^/api/": "/api/" },
        changeOrigin: true,
      },
    },
  },
};
