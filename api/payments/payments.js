const express = require("express");
const router = express.Router();
module.exports = router;
let ordernum;
let cart;
router.get("/", async (req, res) => {
  // ใช้ async function
  try {
    let db = req.db;
    let rows;
    try {
      if (req.query.orderid) {
        rows = await db("payments as p")
          .join("orders as o", "o.orderid", "p.orderid")
          .where("p.orderid", "=", req.query.orderid);
      } else {
        rows = await db("payments");
      }
      res.send({
        ok: true, // ส่ง status
        payments: rows, // ส่งค่ากลับ
      });
    } catch (e) {
      res.send({ ok: false, error: e.message });
    }
  } catch (e) {
    res.send({ ok: false, error: e.message });
  }
});

router.get("/showpayment", async (req, res) => {
  // ใช้ async function
  try {
    let db = req.db;
    let rows;
    try {
      rows = await db("payments as p")
        .join("orders as o", "o.orderid", "p.orderid")
        .join("bank_account as b", "b.bankNum", "p.banknum");

      res.send({
        ok: true, // ส่ง status
        payments: rows, // ส่งค่ากลับ
      });
    } catch (e) {
      res.send({ ok: false, error: e.message });
    }
  } catch (e) {
    res.send({ ok: false, error: e.message });
  }
});

//เมื่อกดยืนยันก็ค่อย insert ลง db
router.post("/", async (req, res) => {
  let rows;
  let status = "กำลังดำเนินการ";
  try {
    let db = req.db;
    rows = await db("payments").insert({
      orderid: req.body.orderid,
      transferName: req.body.transferName,
      banknum: req.body.banknum,
      totalprice: req.body.totalprice,
      paymentDate: req.body.paymentDate,
      paymentTime: req.body.paymentTime,
      paymentImage: req.body.paymentImage,
      paymentstatus: status,
    });
    res.send({
      ok: true,
      payments: rows,
    });
  } catch (e) {
    res.send({ ok: false, error: e.message });
  }
});

router.post("/update", async (req, res) => {
  //put
  let db = req.db;
  let p;

  await db("payments").where({ paymentid: req.body.paymentid }).update({
    paymentstatus: req.body.paymentstatus,
  });

  res.send({
    ok: true,
    payments: p,
  });
});

router.post("/delete", async (req, res) => {
  let db = req.db;
  await db("payments")
    .where({ paymentid: req.body.paymentid })
    .delete()
    .then(() => {
      res.send({ ok: true });
    })
    .catch((e) => res.send({ ok: false, error: e.message }));
});
