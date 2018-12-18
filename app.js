const config = require('./config/config').get(process.env.NODE_ENV);
global.config = config

const Koa = require("koa");
const app = new Koa();
const bodyParser = require('koa-bodyparser');
const router = require('./routes/feedbacks')
const koaCors = require('koa-cors')

const koaOptions = {
      origin: true,
      credentials: true,
      methods: ['GET', 'PUT', 'POST']
    };

app.use(bodyParser({
  json: {limit: '50mb', extended: true},
urlencoded: {limit: '50mb', extended: true},
formLimit: "5mb"
}));
app.use(router.routes());
app.use(koaCors(koaOptions))

log.info('listing to port 3000')
app.listen(3000);
