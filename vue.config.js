module.exports = {
  transpileDependencies: [
    'vuetify'
  ],
  devServer: {
    proxy: "http://localhost:5000"
  },
  configureWebpack: {
    devServer: {
      watchOptions: {
        ignored: ["app.js", /node_modules/],
      }
    }
  }
}
