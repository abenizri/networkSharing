const Koa = require("koa");
const logger = require('koa-logger');
const app = new Koa();
const router = require('./routes/users')

app.use(logger());
app.use(router.routes());

app.listen(3000);
