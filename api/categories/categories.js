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
    if (req.query.class) {
      rows = await db("categories");
    } else {
      rows = await db("categories");
    }
    res.send({
      ok: true, // ส่ง status
      categories: rows, // ส่งค่ากลับ
    });
  } catch (e) {
    res.send({ ok: false, error: e.message });
  }
});

// /api/student/แก้ไขรายชื่อ
router.post("/update", async (req, res) => {
  let db = req.db;
  // UPDATE products SET fname=?, lname=? WHERE id = 1
  await db("categories").where({ categoryid: req.body.categoryid }).update({
    categoryid: req.body.categoryid,
    categoryname: req.body.categoryname,
  });
  res.send({ ok: true });
});

// /api/student/delete
router.post("/delete", async (req, res) => {
  let db = req.db;
  await db("categories")
    .where({ categoryid: req.body.categoryid })
    .delete()
    .then(() => {
      res.send({ status: true });
    })
    .catch((e) => res.send({ status: false, error: e.message }));
});

// /api/student/new//เพิ่มชื่อนักเรียน
router.post("/insert", async (req, res) => {
  let db = req.db;
  let ids = await db("categories").insert({
    categoryid: req.body.categoryid,
    categoryname: req.body.categoryname,
  });
  res.send({
    ok: true,
    ids: ids,
  });
}),
  router.get("/about", function (req, res) {
    res.send("About birds");
  });
