const path = require('path');

function resolve(dir) {
  return path.join(__dirname, dir);
}
module.exports = {
  publicPath: './',
  assetsDir: './',
  productionSourceMap: false,
  lintOnSave: false,
  chainWebpack: (config) => {
    config.resolve.alias.set('@', resolve('src')).set('tim', resolve('src/tim.js'));
    // 删除预加载
    config.plugins.delete('preload');
    config.plugins.delete('prefetch');
    // 压缩代码
    config.optimization.minimize(true);
    // 分割代码
    config.optimization.splitChunks({
      chunks: 'all',
    });
    config.plugin('html').tap((params) => {
      const args = params;
      args[0].title = '阳光课堂';
      return args;
    });
  },
};
