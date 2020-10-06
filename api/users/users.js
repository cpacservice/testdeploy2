const express = require("express");
const router = express.Router();
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
require("dotenv").config();
module.exports = router;
const nodemailer = require("nodemailer");
let linklocal;

router.post("/login", async (req, res) => {
  let db = req.db;

  let rows = await req.db("users").where("email", "=", req.body.email);
  if (rows.length === 0) {
    return res.send({
      ok: false,
      message: "การยืนยันตัวตนผิดพลาด",
    });
  }
  try {
    if (
      bcrypt.compareSync(req.body.password, rows[0].password) &&
      rows[0].status == "user"
    ) {
      const token = jwt.sign(
        {
          email: rows[0].email,
          fisrtname: rows[0].firstname,
          lastname: rows[0].lastname,
          gender: rows[0].gender,
          status: rows[0].status,
        },
        process.env.JWT_KEY,
        {
          expiresIn: "7d",
        }
      );
      return res.send({
        ok: true,
        message: "เข้าสู่ระบบ User",
        token: token,
      });
    }
    if (
      bcrypt.compareSync(req.body.password, rows[0].password) &&
      rows[0].status == "admin"
    ) {
      const token = jwt.sign(
        {
          email: rows[0].email,
          fisrtname: rows[0].firstname,
          lastname: rows[0].lastname,
          gender: rows[0].gender,
          status: rows[0].status,
        },
        process.env.JWT_KEY,
        {
          expiresIn: "7d",
        }
      );
      return res.send({
        ok: true,
        message: "เข้าสู่ระบบ Admin",
        token: token,
      });
    } else {
      return res.send({
        ok: false,
        message: "ยืนยันไม่สำเร็จ",
      });
    }
  } catch (e) {
    res.send({ ok: false, error: e.message });
  } //ใข้งานได้
});

router.post("/register", async (req, res) => {
  let checknull = await req.db("users");
  //ส่วน captcha

  try {
    if (
      req.body.firstname === null ||
      req.body.lastname === null ||
      req.body.email === null ||
      req.body.password === null ||
      req.body.email === "" ||
      req.body.password === ""
    ) {
      return res.send({
        ok: false,
        message: "กรุณากรอกข้อมูลให้ครบถ้วน",
      });
    }
  } catch (e) {
    res.send({ ok: false, error: e.message });
  }
  try {
    let rows = await req.db("users").where("email", "=", req.body.email); //emailที่ดึงมา ไม่ซ้ำ
    if (rows.length === 0) {
      //ตรวจจากความยาวแล้วไม่ซ้ำ
      let statususer = "user";
      let active = "active";
      try {
        const hash = bcrypt.hashSync(req.body.password, 10); //เข้ารหัสpassword
        let db = req.db;
        let ids = await db("users").insert({
          firstname: req.body.firstname,
          lastname: req.body.lastname,
          gender: req.body.gender,
          email: req.body.email,
          password: hash,
          phone: req.body.phone,
          address: req.body.address,
          age: req.body.age,
          status: statususer,
          userStatus: active,
        });
        return res.send({
          ok: true,
          message: "ลงทะเบียนได้",
          ids,
        });
      } catch (e) {
        res.send({ ok: false, error: e.message });
      }
    } else {
      return res.send({
        ok: false,
        message: "email ซ้ำ",
      });
    }
  } catch (e) {
    res.send({ ok: false, error: e.message });
  }
});

router.get("/me", async (req, res) => {
  try {
    //เช็คauth
    const token = req.headers.authorization.split(" ")[1];
    const decoded = jwt.verify(token, process.env.JWT_KEY);
    req.userData = decoded;
    console.log(req.userData.email);
    userData = await req.db("users").where("email", "=", req.userData.email);
    console.log(userData);
    try {
      if (userData.length >= 1) {
        res.json({
          userData,
        });
      } else {
        return res.status(401).json({
          message: "ไม่ถูกต้อง",
        });
      }
    } catch (e) {
      res.send({ ok: false, error: e.message });
    }
  } catch (e) {
    return res.status(401).json({
      message: "Auth failed",
    });
  }
});

router.get("/", async (req, res) => {
  // ใช้ async function
  try {
    let db = req.db;
    let rows;
    if (req.query.userid) {
      rows = await db("users").where("userid", "=", req.query.userid);
    } else {
      rows = await db("users");
    }
    res.send({
      ok: true, // ส่ง status
      users: rows, // ส่งค่ากลับ
    });
  } catch (e) {
    res.send({ ok: false, error: e.message });
  }
});

router.post("/update", async (req, res) => {
  //put
  try {
    let db = req.db;
    await db("users").where({ email: req.body.email }).update({
      firstname: req.body.firstname,
      lastname: req.body.lastname,
      gender: req.body.gender,
      email: req.body.email,
      phone: req.body.phone,
      address: req.body.address,
      age: req.body.age,
      userStatus: req.body.userStatus,
      addressInfo: req.body.addressInfo,
      addressDistrict: req.body.addressDistrict,
      addressAmphoe: req.body.addressAmphoe,
      addressProvince: req.body.addressProvince,
      addressZipcode: req.body.addressZipcode,
    });
  } catch (e) {
    res.send({ ok: false, error: e.message });
  }
  res.send({ ok: true });
});

router.post("/updatestatus", async (req, res) => {
  //put
  try {
    let db = req.db;
    await db("users").where({ email: req.body.email }).update({
      userStatus: req.body.userStatus,
    });
  } catch (e) {
    res.send({ ok: false, error: e.message });
  }
  res.send({ ok: true });
});

router.post("/forgetpassword", async (req, res) => {
  // สร้างออปเจ็ค transporter เพื่อกำหนดการเชื่อมต่อ SMTP และใช้ตอนส่งเมล

  const email = req.body.email;
  let db = req.db;
  let rows;
  let rowupdate;

  rows = await db("users").where({ email: req.body.email });
  if (rows == 0) {
    res.send({
      ok: false,
      user: "have no this email",
    });
  } else {
    res.send({
      ok: true,
    });
    const token = jwt.sign(
      {
        email: rows[0].email,
        fisrtname: rows[0].firstname,
        lastname: rows[0].lastname,
        gender: rows[0].gender,
        status: rows[0].status,
      },
      process.env.RESET_JWT_KEY,
      {
        expiresIn: "20m",
      }
    );
    linklocal = token;
    rowupdate = await db("users").where({ email: req.body.email }).update({
      resetLink: token,
    });
    async function sendMail() {
      let transporter = nodemailer.createTransport({
        host: "smtp.gmail.com",
        port: 465,
        secure: true,
        auth: {
          type: "OAuth2",
          user: process.env.EMAIL,
          pass: process.env.EMAILPASSWORD,
          clientId: process.env.CLIENTID,
          clientSecret: process.env.CLIENTSECRET,
          refreshToken: process.env.REFRESHTOKEN,
          accessToken: process.env.ACCESSTOKEN,
          expires: process.env.EXP,
        },
      });
      let infouser = await transporter.sendMail({
        from: '"No reply" <cpacservice-f27bbb@inbox.mailtrap.io>', // อีเมลผู้ส่ง
        to: email, // อีเมลผู้รับ สามารถกำหนดได้มากกว่า 1 อีเมล โดยขั้นด้วย ,(Comma)
        subject: "แจ้งการรีเซ็ท", // หัวข้ออีเมล
        text: "", // plain text body
        html: `<a href=http://localhost:3000/users/resetpassword?token=${token} >คลิกที่นี่</a>`, // html body
      });
      console.log("Message sent: %s", infouser.messageId);
    }
    sendMail().catch(console.error);
  }
});

router.post("/resetpassword", async (req, res) => {
  let db = req.db;
  let rows;
  let newPass = req.body.newPass;
  let rowupadte;
  let token = req.body.token;

  rows = await db("users").where({ resetLink: req.body.token });
  if (rows == 0) {
    res.send({
      ok: false,
    });
  } else {
    const hash = bcrypt.hashSync(newPass, 10);
    rowupadte = await db("users").where({ resetLink: token }).update({
      password: hash,
    });
    res.send({
      ok: true,
      response: "เปลียนรหัสผ่านสำเร็จ",
    });
  }
});
