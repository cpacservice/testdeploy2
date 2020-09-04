const express = require("express");
const router = express.Router();
module.exports = router;

router.get("/", async (req, res) => {
  // ใช้ async function
  try {
    let db = req.db;
    let rows;
    rows = await db("q_personal");
    res.send({
      ok: true, // ส่ง status
      personal: rows, // ส่งค่ากลับ
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
  await db("q_personal").where({ qPersonalId: req.body.qPersonalId }).update({
    qPersonalName: req.body.qPersonalName,
    qPersonalLast: req.body.qPersonalLast,
    qPersonalPhone: req.body.qPersonalPhone,
    qPersonalEmail: req.body.qPersonalEmail,
    qPersonalIdcard: req.body.qPersonalIdcard,
    qPersonalIdcard: req.body.qPersonalIdcard,
    qPersonalAddressDelivery: req.body.qPersonalAddressDelivery,
    qPersonalAddress: req.body.qPersonalAddress,
    qPersonalProductname: req.body.qPersonalProductname,
    qPersonalProductid: req.body.qPersonalProductid,
    qPersonalQuantity: req.body.qPersonalQuantity,
    qPersonalSquaremetre: req.body.qPersonalSquaremetre,
    qPersonalDate: req.body.qPersonalDate,
    qPersonalTime: req.body.qPersonalTime,
    qPersonalStatus: req.body.qPersonalStatus,
  });
  res.send({ ok: true });
});

// /api/product/delete
// router.post("/delete", async (req, res) => {
//   let db = req.db;
//   await db("products")
//     .where({ productid: req.body.productid })
//     .delete()
//     .then(() => {
//       res.send({ ok: true });
//     })
//     .catch((e) => res.send({ ok: false, error: e.message }));
// });

router.post("/insert", async (req, res) => {
  let db = req.db;
  let active = "กำลังดำเนินการ";
  let ids = await db("q_personal").insert({
    qPersonalName: req.body.qPersonalName,
    qPersonalLast: req.body.qPersonalLast,
    qPersonalPhone: req.body.qPersonalPhone,
    qPersonalEmail: req.body.qPersonalEmail,
    qPersonalIdcard: req.body.qPersonalIdcard,
    qPersonalIdcard: req.body.qPersonalIdcard,
    qPersonalAddressDelivery: req.body.qPersonalAddressDelivery,
    qPersonalAddress: req.body.qPersonalAddress,
    qPersonalProductname: req.body.qPersonalProductname,
    qPersonalProductid: req.body.qPersonalProductid,
    qPersonalQuantity: req.body.qPersonalQuantity,
    qPersonalSquaremetre: req.body.qPersonalSquaremetre,
    qPersonalDate: req.body.qPersonalDate,
    qPersonalTime: req.body.qPersonalTime,
    qPersonalStatus: active,
  });
  res.send({
    ok: true,
    personal: ids,
  });
}),
  router.get("/search", async (req, res) => {
    // ใช้ async function
    try {
      let db = req.db;
      let rows;
      if (req.query.productname) {
        // rows = await db("products")
        //   .where("productname", "like", '%' + req.query.productname + '%',"productid","like",'%' + req.query.productname + '%')
        rows = await db("products as p")
          .join("categories as c", "c.categoryid", "p.categoryid")
          .where("productname", "like", "%" + req.query.productname + "%")
          .orWhere("categoryname", "like", "%" + req.query.productname + "%");
      } else {
        rows = await db("products");
      }
      res.send({
        ok: true, // ส่ง status
        products: rows, // ส่งค่ากลับ
      });
    } catch (e) {
      res.send({ ok: false, error: e.message });
    }
  });
