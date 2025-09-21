const router = require("express").Router();
const ctrl = require("../controllers/analyticsController");
router.get("/generate", ctrl.generate);
router.get("/reports", ctrl.listReports);
module.exports = router;
