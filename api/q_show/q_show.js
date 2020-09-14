const express = require("express");
const router = express.Router();
module.exports = router;

router.get("/normal", async (req, res) => {
  // ใช้ async function
  try {
    let db = req.db;
    let rows;
    rows = await db("q_normal as n")
      .join("users as u", "u.userid", "n.qNormalUserid")
      .where("u.userid", "=", req.query.userid);
    res.send({
      ok: true, // ส่ง status
      normal: rows, // ส่งค่ากลับ
    });
  } catch (e) {
    res.send({ ok: false, error: e.message });
  }
});
router.get("/normal/show", async (req, res) => {
  // ใช้ async function
  try {
    let db = req.db;
    let rows;
    rows = await db("q_normal as n").where(
      "n.qNormalId",
      "=",
      req.query.qNormalId
    );
    res.send({
      ok: true, // ส่ง status
      normal: rows, // ส่งค่ากลับ
    });
  } catch (e) {
    res.send({ ok: false, error: e.message });
  }
});

router.get("/personal", async (req, res) => {
  // ใช้ async function
  try {
    let db = req.db;
    let rows;
    rows = await db("q_personal as p")
      .join("users as u", "u.userid", "p.qPersonalUserid")
      .where("u.userid", "=", req.query.userid);
    res.send({
      ok: true, // ส่ง status
      personal: rows, // ส่งค่ากลับ
    });
  } catch (e) {
    res.send({ ok: false, error: e.message });
  }
});

router.get("/personal/show", async (req, res) => {
  // ใช้ async function
  try {
    let db = req.db;
    let rows;
    rows = await db("q_personal as p").where(
      "p.qPersonalId",
      "=",
      req.query.qPersonalId
    );
    res.send({
      ok: true, // ส่ง status
      personal: rows, // ส่งค่ากลับ
    });
  } catch (e) {
    res.send({ ok: false, error: e.message });
  }
});

router.get("/company", async (req, res) => {
  // ใช้ async function
  try {
    let db = req.db;
    let rows;
    rows = await db("q_company as c")
      .join("users as u", "u.userid", "c.qCompanyUserid")
      .where("u.userid", "=", req.query.userid);
    res.send({
      ok: true, // ส่ง status
      company: rows, // ส่งค่ากลับ
    });
  } catch (e) {
    res.send({ ok: false, error: e.message });
  }
});

router.get("/company/show", async (req, res) => {
  // ใช้ async function
  try {
    let db = req.db;
    let rows;
    rows = await db("q_company as c").where(
      "c.qCompanyId",
      "=",
      req.query.qCompanyId
    );
    res.send({
      ok: true, // ส่ง status
      company: rows, // ส่งค่ากลับ
    });
  } catch (e) {
    res.send({ ok: false, error: e.message });
  }
});
