const express = require("express");
const router = express.Router();
module.exports = router;

router.get("/", async (req, res) => {
  // ใช้ async function
  try {
    let db = req.db;
    let rows;
    rows = await db("bank_account");
    res.send({
      ok: true, // ส่ง status
      bankAccount: rows, // ส่งค่ากลับ
    });
  } catch (e) {
    res.send({ ok: false, error: e.message });
  }
});

router.get("/showbank", async (req, res) => {
  // ใช้ async function
  try {
    let db = req.db;
    let rows;
    rows = await db("bank_account").where("bankstatus", "=", "active");
    res.send({
      ok: true, // ส่ง status
      bankAccount: rows, // ส่งค่ากลับ
    });
  } catch (e) {
    res.send({ ok: false, error: e.message });
  }
});

router.post("/update", async (req, res) => {
  //put
  let db = req.db;
  // UPDATE products SET fname=?, lname=? WHERE id = 1
  await db("bank_account").where({ bankNum: req.body.bankNum }).update({
    bankName: req.body.bankName,
    bankAcc: req.body.bankAcc,
    owner: req.body.owner,
    bankstatus: req.body.bankstatus,
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
  let active = "active";
  let ids = await db("bank_account").insert({
    bankName: req.body.bankName,
    bankAcc: req.body.bankAcc,
    bankAcc: req.body.bankAcc,
    owner: req.body.owner,
    bankstatus: active,
  });
  res.send({
    ok: true,
    bankAccount: ids,
  });
}),
  // router.get("/about", function (req, res) {
  //   res.send("About birds");
  // });

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

router.get("/getitem", async (req, res) => {
  // ใช้ async function
  try {
    let db = req.db;
    let rows;
    rows = await db("bank_items");
    res.send({
      ok: true, // ส่ง status
      bankItems: rows, // ส่งค่ากลับ
    });
  } catch (e) {
    res.send({ ok: false, error: e.message });
  }
});

router.get("/getforinsert", async (req, res) => {
  // ใช้ async function
  try {
    let db = req.db;
    let rows;
    rows = await db("bank_items").where("itemid", "=", req.body.itemid);
    res.send({
      ok: true, // ส่ง status
      bankItems: rows, // ส่งค่ากลับ
    });
  } catch (e) {
    res.send({ ok: false, error: e.message });
  }
});
