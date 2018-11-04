const config = require('./config/config').get(process.env.NODE_ENV);
global.config = config

const Koa = require("koa");
const app = new Koa();
const bodyParser = require('koa-bodyparser');
const router = require('./routes/users')

app.use(bodyParser());
app.use(router.routes());

log.info('listing to port 3000')
app.listen(3000);
