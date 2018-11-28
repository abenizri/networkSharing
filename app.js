const config = require('./config/config').get(process.env.NODE_ENV);
global.config = config

const Koa = require("koa");
const app = new Koa();
const bodyParser = require('koa-bodyparser');
const router = require('./routes/users')
const koaCors = require('koa-cors')

const koaOptions = {
      origin: true,
      credentials: true,
      methods: ['GET', 'PUT', 'POST']
      // headers: ['Content-Type', 'Authorization']
    };

app.use(bodyParser());
app.use(router.routes());
app.use(koaCors(koaOptions))

log.info('listing to port 3000')
app.listen(3000);
