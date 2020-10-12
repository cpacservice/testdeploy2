const express = require("express");
const router = express.Router();
module.exports = router;

router.get("/", async (req, res) => {
  // ใช้ async function
  try {
    let db = req.db;
    let rows;
    try {
      if (req.query.class) {
        rows = await db("carts");
      } else {
        rows = await db("carts");
      }
      res.send({
        ok: true, // ส่ง status
        carts: rows, // ส่งค่ากลับ
      });
    } catch (e) {
      res.send({ ok: false, error: e.message });
    }
  } catch (e) {
    res.send({ ok: false, error: e.message });
  }
});

router.post("/", async (req, res) => {
  try {
    let db = req.db;
    let carts;
    let rows = await db("carts").insert({
      productid: req.body.productid,
      userid: req.body.userid,
      quantity: req.body.quantity,
    });
    if (req.body.userid) {
      carts = await db("carts as c")
        .join("users as u", "c.userid", "u.userid")
        .join("products as p", "c.productid", "p.productid")
        .where("c.userid", "=", req.body.userid)

        .select([
          "u.firstname",
          "p.productid",
          "p.productname",
          "c.quantity",
          "p.unitprice",
        ]);
    } else {
      carts = await db("carts");
    }
    res.send({
      ok: true,
      rows: rows,
      carts: carts,
    });
  } catch (e) {
    res.send({ ok: false, error: e.message });
  }
});

router.get("/detail", async (req, res) => {
  try {
    let db = req.db;
    let rows;
    if (req.query.userid) {
      rows = await db("carts as c")
        .join("users as u", "c.userid", "u.userid")
        .join("products as p", "c.productid", "p.productid")
        .where("c.userid", "=", req.query.userid)

        .select([
          "p.productimage",
          "u.firstname",
          "p.productid",
          "p.productname",
          "c.quantity",
          "p.unitprice",
        ]);
    } else {
      rows = await db("carts");
    }

    res.send({
      ok: true, // ส่ง status
      carts: rows, // ส่งค่ากลับ
    });
  } catch (e) {
    res.send({ ok: false, error: e.message });
  }
});

router.post("/update", async (req, res) => {
  //put
  let db = req.db;
  let carts;

  await db("carts")
    .where({ productid: req.body.productid, userid: req.body.userid })
    .update({
      quantity: req.body.quantity,
    });
  if (req.body.userid) {
    carts = await db("carts as c")
      .join("users as u", "c.userid", "u.userid")
      .join("products as p", "c.productid", "p.productid")
      .where("c.userid", "=", req.body.userid)

      .select([
        "u.firstname",
        "p.productid",
        "p.productname",
        "c.quantity",
        "p.unitprice",
      ]);
  } else {
    carts = await db("carts");
  }
  res.send({
    ok: true,
    carts: carts,
  });
});

router.get("/cartlength", async (req, res) => {
  try {
    let db = req.db;
    let rows = await db("carts")
      .where("userid", "=", req.query.userid)
      .count("productid as length");

    res.send({
      ok: true, // ส่ง status
      carts: rows, // ส่งค่ากลับ
    });
  } catch (e) {
    res.send({ ok: false, error: e.message });
  }
});

router.post("/delete", async (req, res) => {
  let db = req.db;
  await db("carts")
    .where({ productid: req.body.productid, userid: req.body.userid })
    .delete()
    .then(() => {
      res.send({ ok: true });
    })
    .catch((e) => res.send({ ok: false, error: e.message }));
});

router.post("/updatequantity", async (req, res) => {
  //put
  let db = req.db;
  let carts;
  // await db("products").where({ productid: req.body.productid }).update({
  await db("carts")
    .where({ productid: req.body.productid, userid: req.body.userid })
    .update({
      quantity: req.body.quantity,
    });
  res.send({
    ok: true,
    carts: carts,
  });
});

router.post("/clearcart", async (req, res) => {
  //put
  let db = req.db;
  let rows;
  rows =await db("carts")
  .where({userid: req.body.userid })
  .delete()
  .then(() => {
    res.send({ ok: true });
  })
  .catch((e) => res.send({ ok: false, error: e.message }));


  
});
