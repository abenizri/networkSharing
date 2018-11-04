const Router = require("koa-router");
const router = new Router();
const ctrl = require('./../controllers/user')

router.get("/user/:ip", ctrl.show)
router.allowedMethods()
module.exports = router;
