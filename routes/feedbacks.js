const Router = require("koa-router");
const router = new Router();
const ctrl = require('./../controllers/clicks')

// var ctrl = new UserController()

router.get("/get/:domain", ctrl.show)
router.get("/getFeedbackElement/:domain", ctrl.getFeedback)
router.put("/update", ctrl.update)
router.post("/save", ctrl.save)
router.allowedMethods()
module.exports = router;
