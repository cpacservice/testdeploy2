const express = require("express");
const router = express.Router();
var sendmail;
module.exports = router;

const nodemailer = require("nodemailer");
// async..await is not allowed in global scope, must use a wrapper

router.get("/", async (req, res) => {
  // ใช้ async function
  try {
    let db = req.db;
    let rows;
    rows = await db("q_normal");
    res.send({
      ok: true, // ส่ง status
      Normal: rows, // ส่งค่ากลับ
    });
  } catch (e) {
    res.send({ ok: false, error: e.message });
  }
});

router.post("/update", async (req, res) => {
  let db = req.db;
  await db("q_normal").where({ qNormalId: req.body.qNormalId }).update({
    qNormalName: req.body.qNormalName,
    qNormalUserid: req.body.qNormalUserid,
    qNormalLast: req.body.qNormalLast,
    qNormalPhone: req.body.qNormalPhone,
    qNormalEmail: req.body.qNormalEmail,
    qNormalNormalname: req.body.qNormalNormalname,
    qNormalNormalid: req.body.qNormalNormalid,
    qNormalAddressDelivery: req.body.qNormalAddressDelivery,
    qNormalProductname: req.body.qNormalProductname,
    qNormalProductid: req.body.qNormalProductid,
    qNormalQuantity: req.body.qNormalQuantity,
    qNormalUnittype: req.body.qNormalUnittype,
    qNormalSquaremetre: req.body.qNormalSquaremetre,
    qNormalDate: req.body.qNormalDate,
    qNormalTime: req.body.qNormalTime,
    qNormalStatus: req.body.qNormalStatus,
    qNormalInfo: req.body.qNormalInfo,
  });
  res.send({ ok: true });
});

router.post("/delete", async (req, res) => {
  let db = req.db;
  try {
    await db("q_normal")
      .where({ qNormalId: req.body.qNormalId })
      .delete()
      .then(() => {
        res.send({ ok: true });
      })
      .catch((e) => res.send({ ok: false, error: e.message }));
  } catch (e) {
    res.send({ ok: false, error: e.message });
  }
});

router.post("/insert", async (req, res) => {
  try {
    let db = req.db;
    let quanum;
    let active = "กำลังดำเนินการ";
    let rows = await db("q_normal")
      .insert({
        qNormalName: req.body.qNormalName,
        qNormalUserid: req.body.qNormalUserid,
        qNormalLast: req.body.qNormalLast,
        qNormalPhone: req.body.qNormalPhone,
        qNormalEmail: req.body.qNormalEmail,
        qNormalInfo: req.body.qNormalNormalid,
        qNormalAddressDelivery: req.body.qNormalAddressDelivery,
        qNormalProductname: req.body.qNormalProductname,
        qNormalProductid: req.body.qNormalProductid,
        qNormalQuantity: req.body.qNormalQuantity,
        qNormalUnittype: req.body.qNormalUnittype,
        qNormalSquaremetre: req.body.qNormalSquaremetre,
        qNormalDate: req.body.qNormalDate,
        qNormalTime: req.body.qNormalTime,
        qNormalStatus: active,
      })
      .returning("qNormalId")
      .then(function (qNormalId) {
        quanum = qNormalId;
      });

    res.send({
      ok: true,
      Normal: rows,
      lastid: quanum,
    });
  } catch (e) {
    res.send({ ok: false, error: e.message });
  }
});

//
