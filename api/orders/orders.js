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
        rows = await db("orders as o")
          .join("users as u", "u.userid", "o.userid")
          .where("o.orderid", "=", req.query.orderid);
      } else {
        rows = await db("orders");
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

router.get("/me", async (req, res) => {
  // ใช้ async function
  try {
    let db = req.db;
    let rows;
    try {
      if (req.query.userid) {
        rows = await db("orders as o").where("o.userid", "=", req.query.userid);
      } else {
        rows = await db("orders");
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

router.get("/showorder", async (req, res) => {
  // ใช้ async function
  try {
    let db = req.db;
    let rows;
    try {
      rows = await db("orders as o").join("users as u", "u.userid", "o.userid");

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

//เมื่อกดยืนยันก็ค่อย insert ลง db
router.post("/", async (req, res) => {
  let rows;
  let show;
  let de;
  let orderstatus = "รอการชำระเงิน";
  try {
    let db = req.db;

    rows = await db("orders")
      .insert({
        userid: req.body.userid,
        orderdate: req.body.orderdate,
        ordertime: req.body.ordertime,
        tracking: req.body.tracking,
        netprice: req.body.netprice,
        shipMedthod: req.body.shipMedthod,
        orderAddress: req.body.orderAddress,
        orderStatus: orderstatus,
      })

      .returning("orderid")
      .then(function (orderid) {
        ordernum = orderid;
        // test();
      });

    de = await db("order_detail").insert(function () {
      this.select([ordernum, "c.productid", "c.quantity"])
        .from("carts as c")
        .where("c.userid", "=", req.body.userid);
    });
    show = await db("order_detail");

    res.send({
      ok: true,
      orderdetail: show,
      lastesordernum: ordernum,
    });
  } catch (e) {
    res.send({ ok: false, error: e.message });
  }
});

//orderdetail
router.get("/detail", async (req, res) => {
  try {
    let db = req.db;
    let rows;
    if (req.query.orderid) {
      rows = await db("order_detail as od ")
        .join("orders as o", "o.orderid", "od.orderid")
        .join("products as p", "p.productid", "od.productid")
        .join("users as u", "u.userid", "o.userid")
        .join("ship_medthod as s", "s.shm_id", "o.ship_medthod")
        .where("od.orderid", "=", req.query.orderid);
    } else {
      rows = await db("order_detail");
    }

    res.send({
      ok: true, // ส่ง status
      orderid: req.query.orderid,
      carts: rows, // ส่งค่ากลับ
    });
  } catch (e) {
    res.send({ ok: false, error: e.message });
  }
});

router.post("/update", async (req, res) => {
  //put
  let db = req.db;
  let orders;

  await db("orders").where({ orderid: req.body.orderid }).update({
    tracking: req.body.tracking,
    orderStatus: req.body.orderStatus,
  });

  res.send({
    ok: true,
    orders: orders,
  });
});

router.post("/delete", async (req, res) => {
  let db = req.db;
  await db("orders")
    .where({ orderid: req.body.orderid })
    .delete()
    .then(() => {
      res.send({ ok: true });
    })
    .catch((e) => res.send({ ok: false, error: e.message }));
});

router.post("/check", async (req, res) => {
  //put
  let db = req.db;
  let rows;

  rows = await db("orders as o ")
    .where("o.orderid", "=", req.query.orderid)
    .select("o.netprice");

  if (rows == 0) {
    res.send({
      ok: false,
      test: "ไม่มีออเดอร์นี้",
    });
  } else {
    let t = rows[0].netprice;
    res.send({
      ok: true,
      test: "มีออเดอร์นี้",
      total: t,
    });
  }
});
router.post("/showordernumber", async (req, res) => {
  //put
  let db = req.db;
  let rows;

  rows = await db("orders as o ")
    .where("o.order_status", "=", "รอการชำระเงิน")
    .where("o.userid", "=", req.query.userid)
    .select("o.orderid");
  //add totle
  res.send({
    ok: true,
    orderid: rows,
  });
});
