module.exports = [{
      plugin: require('../node_modules/gatsby-plugin-twitter/gatsby-browser.js'),
      options: {"plugins":[]},
    },{
      plugin: require('../node_modules/gatsby-remark-images/gatsby-browser.js'),
      options: {"plugins":[],"maxWidth":960,"withWebp":true,"ignoreFileExtensions":[]},
    },{
      plugin: require('../node_modules/gatsby-remark-autolink-headers/gatsby-browser.js'),
      options: {"plugins":[]},
    },{
      plugin: require('../node_modules/gatsby-plugin-netlify-cms/gatsby-browser.js'),
      options: {"plugins":[],"modulePath":"/home/webonise/Desktop/workspace/murtaza-bagwala.github.io/src/cms/index.js"},
    },{
      plugin: require('../node_modules/gatsby-plugin-google-gtag/gatsby-browser.js'),
      options: {"plugins":[],"trackingIds":["UA-73379983-2"],"pluginConfig":{"head":true}},
    },{
      plugin: require('../node_modules/gatsby-plugin-manifest/gatsby-browser.js'),
      options: {"plugins":[],"name":"Blog by Murtaza Bagwala","short_name":"Blog by Murtaza Bagwala","start_url":"/","background_color":"#FFF","theme_color":"#F7A046","display":"standalone","icon":"static/murtaza.jpeg","cache_busting_mode":"query","include_favicon":true,"legacy":true,"theme_color_in_head":true,"cacheDigest":"f587e5c9996b3040991de7890e315798"},
    },{
      plugin: require('../node_modules/gatsby-plugin-offline/gatsby-browser.js'),
      options: {"plugins":[]},
    },{
      plugin: require('../node_modules/gatsby-plugin-catch-links/gatsby-browser.js'),
      options: {"plugins":[]},
    },{
      plugin: require('../gatsby-browser.js'),
      options: {"plugins":[]},
    }]
