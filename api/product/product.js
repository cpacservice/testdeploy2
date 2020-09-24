const express = require("express");
const router = express.Router();
module.exports = router;
//     http://localhost:7000/api/student?class=1

// /api/product/list //โชว์ทั้งหมด
router.get("/", async (req, res) => {
  // ใช้ async function
  try {
    let db = req.db;
    let rows;
    if (req.query.categoryid) {
      rows = await db("products as p").where(
        "categoryid",
        "=",
        req.query.categoryid
      );
    } else if (req.query.productid) {
      rows = await db("products as p").where(
        "productid",
        "=",
        req.query.productid
      );
    } else {
      rows = await db("products as p").join(
        "categories as c",
        "c.categoryid",
        "p.categoryid"
      );
    }
    res.send({
      ok: true, // ส่ง status
      products: rows, // ส่งค่ากลับ
    });
  } catch (e) {
    res.send({ ok: false, error: e.message });
  }
});

// /api/student/แก้ไขรายชื่อ
router.post("/update", async (req, res) => {
  //put
  let db = req.db;
  // UPDATE products SET fname=?, lname=? WHERE id = 1
  await db("products").where({ productid: req.body.productid }).update({
    productname: req.body.productname,
    categoryid: req.body.categoryid,
    unitprice: req.body.unitprice,
    notation: req.body.notation,
    productstatus: req.body.productstatus,
    productimage: req.body.productimage,
    quotationStatus: req.body.quotationStatus,
    height: req.body.height,
    weight: req.body.weight,
    length: req.body.length,
    width: req.body.width,
    unit: req.body.unit,
  });
  res.send({ ok: true });
});

// /api/product/delete
router.post("/delete", async (req, res) => {
  let db = req.db;
  await db("products")
    .where({ productid: req.body.productid })
    .delete()
    .then(() => {
      res.send({ ok: true });
    })
    .catch((e) => res.send({ ok: false, error: e.message }));
});

router.post("/insert", async (req, res) => {
  if (
    req.body.productname == null ||
    req.body.productname == "" ||
    req.body.unitprice == null ||
    req.body.unitprice == "" ||
    req.body.categoryid == null ||
    req.body.categoryid == "" ||
    req.body.productstatus == null ||
    req.body.productstatus == ""
  ) {
    res.send({
      ok: false,
      message: "ไม่มีค่า",
    });
  }
  let db = req.db;
  let ids = await db("products").insert({
    productname: req.body.productname,
    unitprice: req.body.unitprice,
    categoryid: req.body.categoryid,
    notation: req.body.notation,
    productstatus: req.body.productstatus,
    productimage: req.body.productimage,
    height: req.body.height,
    weight: req.body.weight,
    length: req.body.length,
    width: req.body.width,
    unit: req.body.unit,
  });
  res.send({
    ok: true,
    ids: ids,
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
