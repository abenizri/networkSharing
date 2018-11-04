let path = require('path')
let bunyan = require('bunyan')
global.log = bunyan.createLogger({
  name: 'networkSharing',
  level: 'info',
  serializers: bunyan.stdSerializers,
  streams: [
    { path: path.join(__dirname, '/../logs/app.log') },
    { stream: process.stdout }
  ]
})

var config = {
  "production": {
    //"database": "mongodb://<user>:<pwd>@apollo.modulusmongo.net:27017/db",
    "database": "mongodb://18.223.162.72:27017/networkSharing"
  },
  "default": {
    "database": "mongodb://127.0.0.1:27017/networkSharing"
  }
}



exports.get = function get(env) {
  return config[env] || config.default;
}
