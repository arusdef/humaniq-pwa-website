const path = require('path');
require('app-module-path').addPath(path.join(process.cwd(), 'src'));
require('./globals')

require('babel-core/register');
['.css', '.less', '.sass', '.ttf', '.woff', '.woff2', '.scss'].forEach((ext) => require.extensions[ext] = () => {
});

const port = process.env.PORT || 8080;

const express = require('express')
const application = express()

application.use(express.static('static'));

application.set('views', __dirname)
application.set('view engine', 'ejs')

if (__DEVELOPMENT__) {
  const webpack = require('webpack');
  const config = require('../../webpack.config.js').default;
  const webpackDev = require('webpack-dev-middleware')
  const webpackHot = require('webpack-hot-middleware')
  const compiler = webpack(config)

  application.use(
    webpackDev(
      compiler,
      {
        hot: true,
        publicPath: config.output.publicPath,
        stats: {colors: true}
      }
    )
  )

  application.use(webpackHot(compiler))
}

application.get('*', require('./render').default)

application.listen(port, (err) => {
  if (err) console.log(err);
})