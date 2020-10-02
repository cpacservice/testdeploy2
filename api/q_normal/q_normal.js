const express = require("express");
const router = express.Router();
var sendmail;
module.exports = router;

const nodemailer = require("nodemailer");
// async..await is not allowed in global scope, must use a wrapper

router.get("/", async (req, res) => {
  // ใช้ async function
  try {
    let db = req.db;
    let rows;
    rows = await db("q_normal");
    res.send({
      ok: true, // ส่ง status
      Normal: rows, // ส่งค่ากลับ
    });
  } catch (e) {
    res.send({ ok: false, error: e.message });
  }
});

router.post("/update", async (req, res) => {
  let db = req.db;
  await db("q_normal").where({ qNormalId: req.body.qNormalId }).update({
    qNormalName: req.body.qNormalName,
    qNormalUserid: req.body.qNormalUserid,
    qNormalLast: req.body.qNormalLast,
    qNormalPhone: req.body.qNormalPhone,
    qNormalEmail: req.body.qNormalEmail,
    qNormalNormalname: req.body.qNormalNormalname,
    qNormalNormalid: req.body.qNormalNormalid,
    qNormalAddressDelivery: req.body.qNormalAddressDelivery,
    qNormalProductname: req.body.qNormalProductname,
    qNormalProductid: req.body.qNormalProductid,
    qNormalQuantity: req.body.qNormalQuantity,
    qNormalUnittype: req.body.qNormalUnittype,
    qNormalSquaremetre: req.body.qNormalSquaremetre,
    qNormalDate: req.body.qNormalDate,
    qNormalTime: req.body.qNormalTime,
    qNormalStatus: req.body.qNormalStatus,
    qNormalInfo: req.body.qNormalInfo,
  });
  res.send({ ok: true });
});

router.post("/delete", async (req, res) => {
  let db = req.db;
  try {
    await db("q_normal")
      .where({ qNormalId: req.body.qNormalId })
      .delete()
      .then(() => {
        res.send({ ok: true });
      })
      .catch((e) => res.send({ ok: false, error: e.message }));
  } catch (e) {
    res.send({ ok: false, error: e.message });
  }
});

router.post("/insert", async (req, res) => {
  try {
    let db = req.db;
    let quanum;
    let active = "กำลังดำเนินการ";
    let ids = await db("q_normal")
      .insert({
        qNormalName: req.body.qNormalName,
        qNormalUserid: req.body.qNormalUserid,
        qNormalLast: req.body.qNormalLast,
        qNormalPhone: req.body.qNormalPhone,
        qNormalEmail: req.body.qNormalEmail,
        qNormalInfo: req.body.qNormalNormalid,
        qNormalAddressDelivery: req.body.qNormalAddressDelivery,
        qNormalProductname: req.body.qNormalProductname,
        qNormalProductid: req.body.qNormalProductid,
        qNormalQuantity: req.body.qNormalQuantity,
        qNormalUnittype: req.body.qNormalUnittype,
        qNormalSquaremetre: req.body.qNormalSquaremetre,
        qNormalDate: req.body.qNormalDate,
        qNormalTime: req.body.qNormalTime,
        qNormalStatus: active,
      })
      .returning("qNormalId")
      .then(function (qNormalId) {
        quanum = qNormalId;
      });
    async function sendMail() {
      // สร้างออปเจ็ค transporter เพื่อกำหนดการเชื่อมต่อ SMTP และใช้ตอนส่งเมล
      let transporter = nodemailer.createTransport({
        host: "smtp.gmail.com",
        port: 587,
        secure: false, // true for 465, false for other ports
        auth: {
          // ข้อมูลการเข้าสู่ระบบ
          user: "natthariknan@gmail.com", // email user ของเรา
          pass: "0873574010", // email password
        },
      });
      let infouser = await transporter.sendMail({
        from: '"No reply 👻" <natthariknan@gmail.com>', // อีเมลผู้ส่ง
        to: `${req.body.qNormalEmail}`, // อีเมลผู้รับ สามารถกำหนดได้มากกว่า 1 อีเมล โดยขั้นด้วย ,(Comma)
        subject: "Hello ✔", // หัวข้ออีเมล
        text: "ใบเสนอราคาของท่านกำลังดำเนินการ กรุณารอเจ้าหน้าที่ติดต่อกลับ", // plain text body
        html: `<div class="text-center">
        <h4 :style="{ paddingTop: '20px' }">
          <b>บริษัท ผลิตภัณฑ์และวัตถุก่อสร้าง จำกัด</b>
        </h4>

        <div>
          1516 ถ.ประชาราษฎร์ 1 แขวงวงศ์สว่าง เขตบางซื่อ กรุงเทพฯ 10800
          <br />โทร.02-555-5000 CPAC CALL CENTER 02-555-5555 Email:
          cpacinside@scg.com
        </div>
      </div>
     `, // html body
      });
      console.log("Message sent: %s", infouser.messageId);
    }

    async function sendMailtoadmin() {
      // สร้างออปเจ็ค transporter เพื่อกำหนดการเชื่อมต่อ SMTP และใช้ตอนส่งเมล
      let transporter = nodemailer.createTransport({
        host: "smtp.gmail.com",
        port: 587,
        secure: false, // true for 465, false for other ports
        auth: {
          // ข้อมูลการเข้าสู่ระบบ
          user: "natthariknan@gmail.com", // email user ของเรา
          pass: "0873574010", // email password
        },
      });
      let infoadmin = await transporter.sendMail({
        from: '"No reply 👻" <natthariknan@gmail.com>', // อีเมลผู้ส่ง
        to: "natthariknan@gmail.com", // อีเมลผู้รับ สามารถกำหนดได้มากกว่า 1 อีเมล โดยขั้นด้วย ,(Comma)
        subject: "Hello ✔", // หัวข้ออีเมล
        text: "", // plain text body
        html: "<b>มีรายการใบขอเสนอราคาจาก" + `${req.body.qNormalName}` + "</b>", // html body
      });
      console.log("Message sent: %s", infoadmin.messageId);
    }
    sendMail().catch(console.error);
    sendMailtoadmin().catch(console.error);
    res.send({
      ok: true,
      Normal: ids,
      lastid: quanum,
    });
  } catch (e) {
    res.send({ ok: false, error: e.message });
  }
});

//
