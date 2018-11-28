const Router = require("koa-router");
const router = new Router();
const ctrl = require('./../controllers/user')

// var ctrl = new UserController()

router.get("/get/:domain", ctrl.show)
router.put("/update", ctrl.update)
router.allowedMethods()
module.exports = router;
