module.exports = config => {
    config.target = "electron-renderer";
    config.node.__dirname = true;
   //config.output.publicPath: 'dist/';
    //console.log(config);
    
    return config;
  };