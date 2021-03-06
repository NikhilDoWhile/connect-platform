const express = require('express');
const path = require('path');

const platform = require('../../');
const config = require('./config');


platform.subscribe(platform.events.bind, (_, platform) => {
  if (config.expose) {
    let staticFiles = path.join(__dirname, '../../../panel/dist/');
    platform.app.use(config.path, express.static(staticFiles));
    platform.app.use(path.join(config.path, '*'), (req, res) => {
      res.sendFile(path.join(staticFiles, 'index.html'));
    });
  }
});

module.exports.platform = {
  config : {
    nodes: {
      native: [
        "registry-service",
        "save-node",
        "load-node",
        "delete-node",
        "panel-nodes",
      ],
    },
  },
}
