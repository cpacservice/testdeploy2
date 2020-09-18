const express = require("express");
const router = express.Router();
module.exports = router;

router.get("/", async (req, res) => {
  // ใช้ async function
  try {
    let db = req.db;
    let rows;
    if (req.query.class) {
      rows = await db("ship_medthod");
    } else {
      rows = await db("ship_medthod");
    }
    res.send({
      ok: true, // ส่ง status
      ship_medthod: rows, // ส่งค่ากลับ
    });
  } catch (e) {
    res.send({ ok: false, error: e.message });
  }
});

router.post("/update", async (req, res) => {
  let db = req.db;
  await db("ship_medthod").where({ shm_id: req.body.shmId }).update({
    shmId: req.body.shmId,
    shmName: req.body.shmName,
  });
  res.send({ ok: true });
});

// /api/student/delete
router.post("/delete", async (req, res) => {
  let db = req.db;
  await db("ship_medthod")
    .where({ shmId: req.body.shmId })
    .delete()
    .then(() => {
      res.send({ status: true });
    })
    .catch((e) => res.send({ status: false, error: e.message }));
});

// /api/student/new//เพิ่มชื่อนักเรียน
router.post("/insert", async (req, res) => {
  let db = req.db;
  let ids = await db("ship_medthod").insert({
    shmId: req.body.shmId,
    shmName: req.body.shmName,
  });
  res.send({
    ok: true,
    ship_medthod: ids,
  });
});
