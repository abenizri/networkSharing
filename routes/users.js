const Router = require("koa-router");
const router = new Router();
const ctrl = require('./../controllers/user')

// var ctrl = new UserController()

router.get("/user/:ip", ctrl.show)
router.put("/update", ctrl.update)
router.allowedMethods()
module.exports = router;
