let path = require('path')
let bunyan = require('bunyan')
global.log = bunyan.createLogger({
  name: 'letUsKnow',
  level: 'info',
  serializers: bunyan.stdSerializers,
  streams: [
    { path: path.join(__dirname, '/../logs/app.log') },
    { stream: process.stdout , color: 'blue'}
  ]
})

var config = {
  "production": {
    //"database": "mongodb://<user>:<pwd>@apollo.modulusmongo.net:27017/db",
    "database": "mongodb://18.223.162.72:27017/let_us_now"
  },
  "default": {
    "database": "mongodb://127.0.0.1:27017/let_us_now"
  }
}



exports.get = function get(env) {
  return config[env] || config.default;
}
