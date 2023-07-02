const { createConfig } = require('@edx/frontend-build');

const config = createConfig('webpack-pilet');

delete config.entry;
delete config.output;

console.log(config);

module.exports = config;
