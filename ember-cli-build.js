var EmberApp = require('ember-cli/lib/broccoli/ember-app');

module.exports = function(defaults) {
  var app = new EmberApp(defaults, {
    // 允许注入的环境变量名称
    dotEnv: {
      clientAllowedKeys: [
        'API_ENDPOINT', 'DASHBOARD_API_ENDPOINT', 'UPLOAD_IMAGE_API', 'CDN_PREFIX',
        'REDIRECT_HOST', 'WEIBO_CLIENT_ID', 'WECHAT_APP_ID', 'QQ_CLIENT_ID', 'EDITOR_HOST',
        'HELP_HOST'
      ],
      path: {
        development: './.env',
        production: './.env.production'
      }
    },

    // 重新定义最终构建文件名称
    outputPaths: {
      app: {
        css: {'app': '/assets/bundle.css'},
        js: '/assets/bundle.js',
      },
    },

    // 数字指纹
    fingerprint: {
      extensions: ['css', 'js', 'map']
    },

    app: {
      intl: 'assets/i18n'
    },

    // CSS Modules & PostCSS 配置
    cssModules: {
      plugins: [
        require('postcss-sassy-mixins'),
        require('postcss-import')({path: './app/styles'}),
        require('postcss-cssnext')({warnForDuplicates: false}),
        require('rucksack-css')({fallbacks: true}),
        require('cssnano')({safe: true}),
        require('postcss-browser-reporter'),
      ],
      virtualModules: {
        'choice-ui/colors': {
          'color-blue': '#1894f2',
          'color-gray': '#919ba2',
          'color-green': '#2ecc71',
          'color-slate': '#4e5b68',
          'color-golden': '#f1c40f',
          'color-purple': '#5940aa',
          'color-silver': '#bdc3c7',
          'color-tomato': '#e74c3c'
        }
      }
    },

    nodeAssets: {
      quill: {
        srcDir: 'dist',
        import: ['quill.js', 'quill.snow.css']
      }
    }
  });

  // Chartist.js
  app.import({
    development: 'bower_components/chartist/dist/chartist.css',
    production: 'bower_components/chartist/dist/chartist.min.css'
  });
  app.import({
    development: 'bower_components/chartist/dist/chartist.js',
    production: 'bower_components/chartist/dist/chartist.min.js'
  });
  app.import('vendor/shims/chartist.js');

  // Flatpickr.js
  app.import({
    development: 'bower_components/flatpickr/dist/flatpickr.js',
    production: 'bower_components/flatpickr/dist/flatpickr.min.js'
  });
  app.import('vendor/shims/flatpickr.js');

  app.import('vendor/image_upload/stream-v1.js');
  app.import('vendor/image_upload/uploader.js');

  // Quill
  app.import('vendor/shims/quill.js');

  return app.toTree();
};
