const express = require("express");
const router = express.Router();
module.exports = router;

router.get("/", async (req, res) => {
  // ใช้ async function
  try {
    let db = req.db;
    let rows;
    rows = await db("q_company");
    res.send({
      ok: true, // ส่ง status
      company: rows, // ส่งค่ากลับ
    });
  } catch (e) {
    res.send({ ok: false, error: e.message });
  }
});

// router.get("/showbank", async (req, res) => {
//   // ใช้ async function
//   try {
//     let db = req.db;
//     let rows;
//     rows = await db("bank_account").where("bankstatus", "=", "active");
//     res.send({
//       ok: true, // ส่ง status
//       bankAccount: rows, // ส่งค่ากลับ
//     });
//   } catch (e) {
//     res.send({ ok: false, error: e.message });
//   }
// });

router.post("/update", async (req, res) => {
  let db = req.db;
  await db("q_company").where({ qCompanyId: req.body.qCompanyId }).update({
    qCompanyName: req.body.qCompanyName,
    qCompanyUserid: req.body.qCompanyUserid,
    qCompanyLast: req.body.qCompanyLast,
    qCompanyPhone: req.body.qCompanyPhone,
    qCompanyEmail: req.body.qCompanyEmail,
    qCompanyCompanyname: req.body.qCompanyCompanyname,
    qCompanyCompanyid: req.body.qCompanyCompanyid,
    qCompanyAddressDelivery: req.body.qCompanyAddressDelivery,
    qCompanyAddress: req.body.qCompanyAddress,
    qCompanyProductname: req.body.qCompanyProductname,
    qCompanyProductid: req.body.qCompanyProductid,
    qCompanyQuantity: req.body.qCompanyQuantity,
    qCompanyUnittype: req.body.qCompanyUnittype,
    qCompanySquaremetre: req.body.qCompanySquaremetre,
    qCompanyDate: req.body.qCompanyDate,
    qCompanyTime: req.body.qCompanyTime,
    qCompanyStatus: req.body.qCompanyStatus,
  });
  res.send({ ok: true });
});

router.post("/delete", async (req, res) => {
  let db = req.db;
  await db("q_company")
    .where({ qCompanyId: req.body.qCompanyId })
    .delete()
    .then(() => {
      res.send({ ok: true });
    })
    .catch((e) => res.send({ ok: false, error: e.message }));
});

router.post("/insert", async (req, res) => {
  let db = req.db;
  let quanum;
  let active = "กำลังดำเนินการ";
  let ids = await db("q_company")
    .insert({
      qCompanyName: req.body.qCompanyName,
      qCompanyUserid: req.body.qCompanyUserid,
      qCompanyLast: req.body.qCompanyLast,
      qCompanyPhone: req.body.qCompanyPhone,
      qCompanyEmail: req.body.qCompanyEmail,
      qCompanyCompanyname: req.body.qCompanyCompanyname,
      qCompanyCompanyid: req.body.qCompanyCompanyid,
      qCompanyAddressDelivery: req.body.qCompanyAddressDelivery,
      qCompanyAddress: req.body.qCompanyAddress,
      qCompanyProductname: req.body.qCompanyProductname,
      qCompanyProductid: req.body.qCompanyProductid,
      qCompanyQuantity: req.body.qCompanyQuantity,
      qCompanyUnittype: req.body.qCompanyUnittype,
      qCompanySquaremetre: req.body.qCompanySquaremetre,
      qCompanyDate: req.body.qCompanyDate,
      qCompanyTime: req.body.qCompanyTime,
      qCompanyStatus: active,
    })
    .returning("qNormalId")
    .then(function (qNormalId) {
      quanum = qNormalId;
    });
  res.send({
    ok: true,
    Company: ids,
    lastid: quanum,
  });
});
