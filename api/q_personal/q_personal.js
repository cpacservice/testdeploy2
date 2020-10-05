const express = require("express");
const router = express.Router();
module.exports = router;

const nodemailer = require("nodemailer");

router.get("/", async (req, res) => {
  // ใช้ async function
  try {
    let db = req.db;
    let rows;
    rows = await db("q_personal");
    res.send({
      ok: true, // ส่ง status
      personal: rows, // ส่งค่ากลับ
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
  await db("q_personal").where({ qPersonalId: req.body.qPersonalId }).update({
    qPersonalName: req.body.qPersonalName,
    qPersonalUserid: req.body.qPersonalUserid,
    qPersonalLast: req.body.qPersonalLast,
    qPersonalPhone: req.body.qPersonalPhone,
    qPersonalEmail: req.body.qPersonalEmail,
    qPersonalIdcard: req.body.qPersonalIdcard,
    qPersonalIdcard: req.body.qPersonalIdcard,
    qPersonalAddressDelivery: req.body.qPersonalAddressDelivery,
    qPersonalAddress: req.body.qPersonalAddress,
    qPersonalProductname: req.body.qPersonalProductname,
    qPersonalProductid: req.body.qPersonalProductid,
    qPersonalQuantity: req.body.qPersonalQuantity,
    qPeronalUnittype: req.body.qPeronalUnittype,
    qPersonalSquaremetre: req.body.qPersonalSquaremetre,
    qPersonalDate: req.body.qPersonalDate,
    qPersonalTime: req.body.qPersonalTime,
    qPersonalStatus: req.body.qPersonalStatus,
  });
  res.send({ ok: true });
});

router.post("/delete", async (req, res) => {
  let db = req.db;
  await db("q_personal")
    .where({ qPersonalId: req.body.qPersonalId })
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
  let ids = await db("q_personal")
    .insert({
      qPersonalName: req.body.qPersonalName,
      qPersonalUserid: req.body.qPersonalUserid,
      qPersonalLast: req.body.qPersonalLast,
      qPersonalPhone: req.body.qPersonalPhone,
      qPersonalEmail: req.body.qPersonalEmail,
      qPersonalIdcard: req.body.qPersonalIdcard,
      qPersonalIdcard: req.body.qPersonalIdcard,
      qPersonalAddressDelivery: req.body.qPersonalAddressDelivery,
      qPersonalAddress: req.body.qPersonalAddress,
      qPersonalProductname: req.body.qPersonalProductname,
      qPersonalProductid: req.body.qPersonalProductid,
      qPersonalQuantity: req.body.qPersonalQuantity,
      qPeronalUnittype: req.body.qPeronalUnittype,
      qPersonalSquaremetre: req.body.qPersonalSquaremetre,
      qPersonalDate: req.body.qPersonalDate,
      qPersonalTime: req.body.qPersonalTime,
      qPersonalStatus: active,
    })
    .returning("qNormalId")
    .then(function (qNormalId) {
      quanum = qNormalId;
    });
  rows = await db("q_personal").where("qPersonalId", "=", quanum);
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
    const tempText3 = `<div><b>เรียนคุณ</b> ${rows[0].qPersonalName} <b>นามสกุล</b>  ${rows[0].qPersonalLast} <br /><b>ที่อยู่จัดส่ง </b> ${rows[0].qPersonalAddressDelivery} <br /><b>ที่อยู่สำหรับออกใบกำกับภาษี </b> ${rows[0].qPersonalAddress}<br /><b>เลขบัตรประจำตัวประชาชน : </b> ${rows[0].qPersonalIdcard}<br /><b>เบอร์โทรติดต่อ </b> ${rows[0].qPersonalPhone}<br /><b>วันที่สั่งซื้อสินค้า </b> วัน${rows[0].qPersonalDate}<br /><b>เวลาที่สั่งซื้อสินค้า </b> ${rows[0].qPersonalTime} นาที<br /><b>หมายเลขขอใบเสนอราคาที่  </b> ${rows[0].qPersonalId}<br /><b>ความต้องการขอใบกำกับภาษี : </b> ออกในนามบุคคลธรรมดา</div>`;
    const tempText4 = `<div style="text-align: center;>
            <h4 :style="{ paddingTop: '20px' }">
                  <br><b>รายการขอเสนอราคาของท่าน</b></h4></div>`;
    const tempText5 = `<div><b></b><h4>หมายเหตุ</h4></b>
      <ul>
      <li>กรุณารอการติดต่อกลับจากเจ้าหน้าที่ภายใน 3 วันทำการ</li>
      <li>ท่านสามารถดูรายละเอียดการขอใบเสนอราคาของท่าน และ ติดตามสถานะได้ที่หน้าเว็บไซต์ เมนู 'การขอใบเสนอราคา'</li>
    </ul></div>`;
    function tableGenerator(qNormal) {
      const theader = `<tr style="background :#3399FF" >
            <th style="border:1px solid black;" >สินค้า</th>
            <th style="border:1px solid black;">จำนวน</th>
            <th style="border:1px solid black;">หน่วย</th>

            </tr>`;
      const tbody = [];

      for (const q of qNormal) {
        if (q.qNormalQuantity === 0) {
          tbody.push(
            `<tr>
                <td style="border:1px solid black;">${q.qPersonalProductname}</td>
                <td style=" text-align: center;border:1px solid black;">${q.qPersonalSquaremetre}</td>
                <td style=" text-align: center;border:1px solid black;">${q.qPersonalUnittype}</td>
                </tr>`
          );
        } else {
          tbody.push(
            `<tr>
                <td style="border:1px solid black;">${q.qPersonalProductname}</td>
                <td style=" text-align: center;border:1px solid black;">${q.qPersonalQuantity}</td>
              <td style=" text-align: center;border:1px solid black;">${q.qPersonalUnittype}</td>
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
      from: '"No reply" <cpacservice-f27bbb@inbox.mailtrap.io>', // อีเมลผู้ส่ง
      to: `${rows[0].qPersonalEmail}`, // อีเมลผู้รับ สามารถกำหนดได้มากกว่า 1 อีเมล โดยขั้นด้วย ,(Comma)
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
    const tempText1 = `<div>ขณะนี้มีลูกค้าขอใบเสนอราคาหมายเลข  ${rows[0].qPersonalId} กรุณาตรวจสอบและดำเนินการ โดยมีรายละเอียดดังนี้</div>`;
    const tempText2 = `<div><b>ชื่อลูกค้า คุณ</b> ${rows[0].qPersonalName} <b>นามสกุล</b>  ${rows[0].qPersonalLast} <br /><b>ที่อยู่จัดส่ง </b> ${rows[0].qPersonalAddressDelivery}  <br /><b>ที่อยู่สำหรับออกใบกำกับภาษี </b> ${rows[0].qPersonalAddress}<br /><b>เบอร์โทรติดต่อ </b> ${rows[0].qPersonalPhone}<br /><b>วันที่สั่งซื้อสินค้า </b> วัน${rows[0].qPersonalDate}<br /><b>เวลาที่สั่งซื้อสินค้า </b> ${rows[0].qPersonalTime} นาที<br /><b>หมายเลขขอใบเสนอราคาที่  </b> ${rows[0].qPersonalId}<br /><b>ความต้องการออกใบกำกับภาษี :   </b> ออกในนามบุคคลธรรมดา</div>`;
    const tempText3 = `<div style="text-align: center;>
            <h4 :style="{ paddingTop: '20px' }">
                  <br><b>รายละเอียดการสั่งสินค้า</b></h4></div>`;
    const html = `${tempText1}${tempText2}${tempText3}${tableGenerator(rows)}`;
    let infoadmin = await transporter.sendMail({
      from: '"No reply" <cpacservice-f27bbb@inbox.mailtrap.io>', // อีเมลผู้ส่ง
      to: "s6006021630016@kmutnb.ac.th", // อีเมลผู้รับ สามารถกำหนดได้มากกว่า 1 อีเมล โดยขั้นด้วย ,(Comma)
      subject: "แจ้งเตือนAdmin ความต้องการขอใบเสนอราคา(ในนามบุคคลธรรมดา)", // หัวข้ออีเมล
      text: "", // plain text body
      html, // html body
    });
    console.log("Message sent: %s", infoadmin.messageId);
    function tableGenerator(qNormal) {
      const theader = `<tr style="background :#3399FF" >
            <th style="border:1px solid black;" >สินค้า</th>
            <th style="border:1px solid black;">จำนวน</th>
            <th style="border:1px solid black;">หน่วย</th>

            </tr>`;
      const tbody = [];

      for (const q of qNormal) {
        if (q.qPersonalQuantity === 0) {
          tbody.push(
            `<tr>
                <td style="border:1px solid black;">${q.qPersonalProductname}</td>
                <td style=" text-align: center;border:1px solid black;">${q.qPersonalSquaremetre}</td>
                <td style=" text-align: center;border:1px solid black;">${q.qPeronalUnittype}</td>
                </tr>`
          );
        } else {
          tbody.push(
            `<tr>
                <td style="border:1px solid black;">${q.qPersonalProductname}</td>
                <td style=" text-align: center;border:1px solid black;">${q.qPersonalQuantity}</td>
              <td style=" text-align: center;border:1px solid black;">${q.qPeronalUnittype}</td>
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
    personal: ids,
    lastid: quanum,
  });
});
// router.get("/search", async (req, res) => {
//   // ใช้ async function
//   try {
//     let db = req.db;
//     let rows;
//     if (req.query.productname) {
//       // rows = await db("products")
//       //   .where("productname", "like", '%' + req.query.productname + '%',"productid","like",'%' + req.query.productname + '%')
//       rows = await db("products as p")
//         .join("categories as c", "c.categoryid", "p.categoryid")
//         .where("productname", "like", "%" + req.query.productname + "%")
//         .orWhere("categoryname", "like", "%" + req.query.productname + "%");
//     } else {
//       rows = await db("products");
//     }
//     res.send({
//       ok: true, // ส่ง status
//       products: rows, // ส่งค่ากลับ
//     });
//   } catch (e) {
//     res.send({ ok: false, error: e.message });
//   }
// });
