const express = require("express");
const router = express.Router();
module.exports = router;

const nodemailer = require("nodemailer");

router.get("/", async (req, res) => {
  // ใช้ async function
  try {
    let db = req.db;
    let rows;
    rows = await db("q_company");
    res.send({
      ok: true, // ส่ง status
      company: rows, // ส่งค่ากลับ
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
  try {
    await db("q_company").where({ qCompanyId: req.body.qCompanyId }).update({
      qCompanyName: req.body.qCompanyName,
      qCompanyUserid: req.body.qCompanyUserid,
      qCompanyLast: req.body.qCompanyLast,
      qCompanyPhone: req.body.qCompanyPhone,
      qCompanyEmail: req.body.qCompanyEmail,
      qCompanyCompanyname: req.body.qCompanyCompanyname,
      qCompanyCompanyid: req.body.qCompanyCompanyid,
      qCompanyAddressDelivery: req.body.qCompanyAddressDelivery,
      qCompanyAddress: req.body.qCompanyAddress,
      qCompanyProductname: req.body.qCompanyProductname,
      qCompanyProductid: req.body.qCompanyProductid,
      qCompanyQuantity: req.body.qCompanyQuantity,
      qCompanyUnittype: req.body.qCompanyUnittype,
      qCompanySquaremetre: req.body.qCompanySquaremetre,
      qCompanyDate: req.body.qCompanyDate,
      qCompanyTax: req.body.qCompanyTax,
      qCompanyTime: req.body.qCompanyTime,
      qCompanyStatus: req.body.qCompanyStatus,
    });
    res.send({
      ok: true,
    });
  } catch (e) {
    res.send({ ok: false, error: e.message });
  }
});

router.post("/delete", async (req, res) => {
  let db = req.db;
  await db("q_company")
    .where({ qCompanyId: req.body.qCompanyId })
    .delete()
    .then(() => {
      res.send({ ok: true });
    })
    .catch((e) => res.send({ ok: false, error: e.message }));
});

router.post("/insert", async (req, res) => {
  let db = req.db;
  let rows;
  let quanum;
  let active = "กำลังดำเนินการ";
  let ids = await db("q_company")
    .insert({
      qCompanyName: req.body.qCompanyName,
      qCompanyUserid: req.body.qCompanyUserid,
      qCompanyLast: req.body.qCompanyLast,
      qCompanyPhone: req.body.qCompanyPhone,
      qCompanyEmail: req.body.qCompanyEmail,
      qCompanyTax: req.body.qCompanyTax,
      qCompanyCompanyname: req.body.qCompanyCompanyname,
      qCompanyCompanyid: req.body.qCompanyCompanyid,
      qCompanyAddressDelivery: req.body.qCompanyAddressDelivery,
      qCompanyAddress: req.body.qCompanyAddress,
      qCompanyProductname: req.body.qCompanyProductname,
      qCompanyProductid: req.body.qCompanyProductid,
      qCompanyQuantity: req.body.qCompanyQuantity,
      qCompanyUnittype: req.body.qCompanyUnittype,
      qCompanySquaremetre: req.body.qCompanySquaremetre,
      qCompanyDate: req.body.qCompanyDate,
      qCompanyTime: req.body.qCompanyTime,
      qCompanyStatus: active,
    })
    .returning("qCompanyId")
    .then(function (qCompanyId) {
      quanum = qCompanyId;
    });
  rows = await db("q_company").where("qCompanyId", "=", quanum);
  ///send Mail Space
  async function sendMail() {
    // สร้างออปเจ็ค transporter เพื่อกำหนดการเชื่อมต่อ SMTP และใช้ตอนส่งเมล
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
    const tempText1 = `<div style="text-align: center;>
          <h4 :style="{ paddingTop: '20px' }">
                <b>บริษัท ผลิตภัณฑ์และวัตถุก่อสร้าง จำกัด</b></h4>`;
    const tempText2 = `<div>1516 ถ.ประชาราษฎร์ 1 แขวงวงศ์สว่าง เขตบางซื่อ กรุงเทพฯ 10800<br />โทร.02-555-5000 CPAC CALL CENTER 02-555-5555 Email:cpacinside@scg.com</div></div><br />`;
    const tempText3 = `<div><b>เรียนคุณ</b> ${rows[0].qCompanyName} <b>นามสกุล</b>  ${rows[0].qCompanyLast} <br /><b>ที่อยู่จัดส่ง </b> ${rows[0].qCompanyAddressDelivery} <br /><b>ที่อยู่สำหรับออกใบกำกับภาษี </b> ${rows[0].qCompanyAddress}<br /><b>ชื่อบริษัท </b> ${rows[0].qCompanyCompanyname}<br /><b>หมายเลขสำนักงาน/สาขา ${rows[0].qCompanyCompanyid}</b><br /><b>เลขประจำตัวผู้เสียภาษีอากร </b> ${rows[0].qCompanyTax}<br /><b>เบอร์โทรติดต่อ </b> ${rows[0].qCompanyPhone}<br /><b>วันที่สั่งซื้อสินค้า </b> วัน${rows[0].qCompanyDate}<br /><b>เวลาที่สั่งซื้อสินค้า </b> ${rows[0].qCompanyTime} นาที<br /><b>หมายเลขขอใบเสนอราคาที่  </b> ${rows[0].qCompanyId}<br /><b>ความต้องการขอใบกำกับภาษี : </b> ออกในนามบริษัท</div>`;
    const tempText4 = `<div style="text-align: center;>
                <h4 :style="{ paddingTop: '20px' }">
                      <br><b>รายการขอเสนอราคาของท่าน</b></h4></div>`;
    const tempText5 = `<div><b></b><h4>หมายเหตุ</h4></b>
          <ul>
          <li>กรุณารอการติดต่อกลับจากเจ้าหน้าที่ภายใน 3 วันทำการ</li>
          <li>ท่านสามารถดูรายละเอียดการขอใบเสนอราคาของท่าน และ ติดตามสถานะได้ที่หน้าเว็บไซต์ เมนู 'การขอใบเสนอราคา'</li>
        </ul></div>`;
    function tableGenerator(qCompany) {
      const theader = `<tr style="background :#3399FF" >
                <th style="border:1px solid black;" >สินค้า</th>
                <th style="border:1px solid black;">จำนวน</th>
                <th style="border:1px solid black;">หน่วย</th>
    
                </tr>`;
      const tbody = [];

      for (const q of qCompany) {
        if (q.qCompanyQuantity === 0 ||q.qCompanyQuantity === null ||q.qCompanyQuantity ==="") {
          tbody.push(
            `<tr>
                    <td style="border:1px solid black;">${q.qCompanyProductname}</td>
                    <td style=" text-align: center;border:1px solid black;">${q.qCompanySquaremetre}</td>
                    <td style=" text-align: center;border:1px solid black;">${q.qCompanyUnittype}</td>
                    </tr>`
          );
        } else {
          tbody.push(
            `<tr>
                    <td style="border:1px solid black;">${q.qCompanyProductname}</td>
                    <td style=" text-align: center;border:1px solid black;">${q.qCompanyQuantity}</td>
                  <td style=" text-align: center;border:1px solid black;">${q.qCompanyUnittype}</td>
                    </tr>`
          );
        }
      }

      return `<table style="width: 100%;  border-collapse: collapse; border:1px solid black;">${theader}${tbody.join(
        ""
      )}</table>`;
    }
    const html = `${tempText1}${tempText2}${tempText3}${tempText4}${tableGenerator(
      rows
    )}${tempText5}`;

    let infouser = await transporter.sendMail({
      from: '"CPAC Service Alert" <cpacservicealert@gmail.com>', // อีเมลผู้ส่ง
      to: `${rows[0].qCompanyEmail}`, // อีเมลผู้รับ สามารถกำหนดได้มากกว่า 1 อีเมล โดยขั้นด้วย ,(Comma)
      subject: "เรียนลูกค้า CPAC", // หัวข้ออีเมล
      text: "ใบเสนอราคาของท่านกำลังดำเนินการ กรุณารอเจ้าหน้าที่ติดต่อกลับ", // plain text body
      html, // html body
    });
    console.log("Message sent: %s", infouser.messageId);
  }

  async function sendMailtoadmin() {
    // สร้างออปเจ็ค transporter เพื่อกำหนดการเชื่อมต่อ SMTP และใช้ตอนส่งเมล
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
    const tempText1 = `<div>ขณะนี้มีลูกค้าขอใบเสนอราคาหมายเลข  ${rows[0].qCompanyId} กรุณาตรวจสอบและดำเนินการ โดยมีรายละเอียดดังนี้</div>`;
    const tempText2 = `<div><b>ชื่อลูกค้า คุณ</b> ${rows[0].qCompanyName} <b>นามสกุล</b>  ${rows[0].qCompanyLast} <br /><b>ที่อยู่จัดส่ง </b> ${rows[0].qCompanyAddressDelivery} <br /><b>ที่อยู่สำหรับออกใบกำกับภาษี </b> ${rows[0].qCompanyAddress}<br /><b>ชื่อบริษัท </b> ${rows[0].qCompanyCompanyname}<br /><b>หมายเลขสำนักงาน/สาขา</b>  ${rows[0].qCompanyCompanyid}<br /><b>เลขประจำตัวผู้เสียภาษีอากร </b> ${rows[0].qCompanyTax}<br /><b>เบอร์โทรติดต่อ </b> ${rows[0].qCompanyPhone}<br /><b>วันที่สั่งซื้อสินค้า </b> วัน${rows[0].qCompanyDate}<br /><b>เวลาที่สั่งซื้อสินค้า </b> ${rows[0].qCompanyTime} นาที<br /><b>หมายเลขขอใบเสนอราคาที่  </b> ${rows[0].qCompanyId}<br /><b>ความต้องการขอใบกำกับภาษี : </b> ออกในนามบริษัท</div>`;
    const tempText3 = `<div style="text-align: center;>
                <h4 :style="{ paddingTop: '20px' }">
                      <br><b>รายละเอียดการสั่งสินค้า</b></h4></div>`;
    const html = `${tempText1}${tempText2}${tempText3}${tableGenerator(rows)}`;
    let infoadmin = await transporter.sendMail({
      from: '"CPAC Service Alert" <cpacservicealert@gmail.com>', // อีเมลผู้ส่ง
      to: "s6006021630016@kmutnb.ac.th,nisira@scg.com,ratchanw@scg.com,sombatd@scg.com,jakkreer@scg.com,somchlek@scg.com", // อีเมลผู้รับ สามารถกำหนดได้มากกว่า 1 อีเมล โดยขั้นด้วย ,(Comma)
      // อีเมลผู้รับ สามารถกำหนดได้มากกว่า 1 อีเมล โดยขั้นด้วย ,(Comma)
      subject: "แจ้งเตือนAdmin ความต้องการขอใบเสนอราคา(ในนามบริษัท)", // หัวข้ออีเมล
      text: "", // plain text body
      html, // html body
    });
    console.log("Message sent: %s", infoadmin.messageId);
    function tableGenerator(qCompany) {
      const theader = `<tr style="background :#3399FF" >
                <th style="border:1px solid black;" >สินค้า</th>
                <th style="border:1px solid black;">จำนวน</th>
                <th style="border:1px solid black;">หน่วย</th>
    
                </tr>`;
      const tbody = [];

      for (const q of qCompany) {
        if (q.qCompanyQuantity === 0 ||q.qCompanyQuantity === null ||q.qCompanyQuantity ==="") {
          tbody.push(
            `<tr>
                    <td style="border:1px solid black;">${q.qCompanyProductname}</td>
                    <td style=" text-align: center;border:1px solid black;">${q.qCompanySquaremetre}</td>
                    <td style=" text-align: center;border:1px solid black;">${q.qCompanyUnittype}</td>
                    </tr>`
          );
        } else {
          tbody.push(
            `<tr>
                    <td style="border:1px solid black;">${q.qCompanyProductname}</td>
                    <td style=" text-align: center;border:1px solid black;">${q.qCompanyQuantity}</td>
                  <td style=" text-align: center;border:1px solid black;">${q.qCompanyUnittype}</td>
                    </tr>`
          );
        }
      }

      return `<table style="width: 100%;  border-collapse: collapse; border:1px solid black;">${theader}${tbody.join(
        ""
      )}</table>`;
    }
  }
  // sendMail().catch(console.error);
  sendMailtoadmin().catch(console.error);
  sendMail().catch(console.error);

  ///sendMail Space
  res.send({
    ok: true,
    Company: ids,
    lastid: quanum,
  });
});
