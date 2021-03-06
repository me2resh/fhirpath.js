const CopyPlugin = require('copy-webpack-plugin');

/**
 *  Returns a base webpack configuration object with settings used by more than
 *  one output file.
 */
function makeBaseConfig() {
  return {
    node: {
      fs: "empty"
    },
    mode: 'production',
    devtool: 'source-map',
    output: {
      path: __dirname
    },
    module: {
      rules: [
        {
          test: /\.m?js$/,
          exclude: /(node_modules|bower_components)/,
          use: {
            loader: 'babel-loader',
            options: {
              presets: ['@babel/preset-env']
            }
          }
        }
      ]
    }
  };
}

module.exports = [];

// Main FHIRPath file
let config = makeBaseConfig();
config.entry = '../src/fhirpath';
config.output.filename = './fhirpath.min.js';
config.output.library = 'fhirpath'; // global variable for the library
config.plugins = [
  new CopyPlugin([
    { from: '../LICENSE.md', to: '.' }
  ]),
];
module.exports.push(config);

// FHIR model files
for (let fhirVers of ['stu3', 'r4']) {
  config = makeBaseConfig();
  config.entry = '../fhir-context/'+fhirVers+'/index';
  config.output.filename = './fhirpath.'+fhirVers+'.min.js';
  config.output.library = 'fhirpath_'+fhirVers+'_model';
  module.exports.push(config);
}
