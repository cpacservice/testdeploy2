const express = require("express");
const router = express.Router();

module.exports = router;

router.use("/users", require("./users/users"));
router.use("/product", require("./product/product"));
router.use("/categories", require("./categories/categories"));
router.use("/carts", require("./carts/carts"));
router.use("/ship_medthod", require("./ship_medthod/ship_medthod"));
router.use("/orders", require("./orders/orders"));
router.use("/bank_account", require("./bank_account/bank_account"));
router.use("/payments", require("./payments/payments"));
router.use("/q_personal", require("./q_personal/q_personal"));
router.use("/q_company", require("./q_company/q_company"));
router.use("/q_normal", require("./q_normal/q_normal"));
router.use("/q_show", require("./q_show/q_show"));
