const path = require('path');
const load = require('./load-node');
const core = require('../core');


const loaders = {
  native: require('./native'),
  json: require('./json'),

  module: function(path, searchPaths, config) {
    load(path, searchPaths, (mod, modPath) => {
      if (mod && mod.platform) {
        if (mod.platform.config) {
          loadNodesFromConf(mod.platform.config, [modPath], config);

          if (mod.platform.config.aliases) {
            for (let [alias, path] of Object.entries(mod.platform.config.aliases)) {
              core.registry.alias(alias, path);
            }
          }
        }
      }
    });
  },
};

const loadNodesFromConf = function(config, searchPaths, globalConf) {
  if (config.nodes) {
    for (let [type, list] of Object.entries(config.nodes)) {
      if (type in loaders) {
        let loader = loaders[type];
        for (let node of list)
          loader(node, searchPaths, globalConf);
      }
    }
  }
}

module.exports = loaders.module;
module.exports.loadNodesFromConf = loadNodesFromConf;
