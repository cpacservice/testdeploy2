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
    let test;
    let rows;
    let db = req.db;
    let quanum;
    let active = "กำลังดำเนินการ";
    rows1 = await db("q_normal")
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
    rows = await db("q_normal").where("qNormalId", "=", quanum);
    ///send Mail Space
    async function sendMail() {
      // สร้างออปเจ็ค transporter เพื่อกำหนดการเชื่อมต่อ SMTP และใช้ตอนส่งเมล
      let transporter = nodemailer.createTransport({
        host: "Hotmail",
        port: 2525,
        auth: {
          user: "cpacalertservice@hotmail.com",
          pass: "cpac12345678",
        },
      });
      const tempText1 = `<div style="text-align: center;>
        <h4 :style="{ paddingTop: '20px' }">
              <b>บริษัท ผลิตภัณฑ์และวัตถุก่อสร้าง จำกัด</b></h4>`;
      const tempText2 = `<div>1516 ถ.ประชาราษฎร์ 1 แขวงวงศ์สว่าง เขตบางซื่อ กรุงเทพฯ 10800<br />โทร.02-555-5000 CPAC CALL CENTER 02-555-5555 Email:cpacinside@scg.com</div></div><br />`;
      const tempText3 = `<div><b>เรียนคุณ</b> ${rows[0].qNormalName} <b>นามสกุล</b>  ${rows[0].qNormalLast} <br /><b>ที่อยู่จัดส่ง </b> ${rows[0].qNormalAddressDelivery} <br /><b>เบอร์โทรติดต่อ </b> ${rows[0].qNormalPhone}<br /><b>วันที่สั่งซื้อสินค้า </b> วัน${rows[0].qNormalDate}<br /><b>เวลาที่สั่งซื้อสินค้า </b> ${rows[0].qNormalTime} นาที<br /><b>หมายเลขขอใบเสนอราคาที่  </b> ${rows[0].qNormalId}<br /><b>ความต้องการขอใบกำกับภาษี :</b> ไม่มี<br/><b>ความต้องการเพิ่มเติม :</b>${rows[0].qNormalInfo}</div>`;
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
                  <td style="border:1px solid black;">${q.qNormalProductname}</td>
                  <td style=" text-align: center;border:1px solid black;">${q.qNormalSquaremetre}</td>
                  <td style=" text-align: center;border:1px solid black;">${q.qNormalUnittype}</td>
                  </tr>`
            );
          } else {
            tbody.push(
              `<tr>
                  <td style="border:1px solid black;">${q.qNormalProductname}</td>
                  <td style=" text-align: center;border:1px solid black;">${q.qNormalQuantity}</td>
                <td style=" text-align: center;border:1px solid black;">${q.qNormalUnittype}</td>
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
        from: '"No reply" <cpacalertservice@hotmail.com>', // อีเมลผู้ส่ง
        to: `${rows[0].qNormalEmail}`, // อีเมลผู้รับ สามารถกำหนดได้มากกว่า 1 อีเมล โดยขั้นด้วย ,(Comma)
        subject: "เรียนลูกค้า CPAC", // หัวข้ออีเมล
        text: "ใบเสนอราคาของท่านกำลังดำเนินการ กรุณารอเจ้าหน้าที่ติดต่อกลับ", // plain text body
        html, // html body
      });
      console.log("Message sent: %s", infouser.messageId);
    }

    async function sendMailtoadmin() {
      // สร้างออปเจ็ค transporter เพื่อกำหนดการเชื่อมต่อ SMTP และใช้ตอนส่งเมล
      let transporter = nodemailer.createTransport({
        host: "Hotmail",
        port: 2525,
        auth: {
          user: "cpacalertservice@hotmail.com",
          pass: "cpac12345678",
        },
      });
      const tempText1 = `<div>ขณะนี้มีลูกค้าขอใบเสนอราคาหมายเลข  ${rows[0].qNormalId} กรุณาตรวจสอบและดำเนินการ โดยมีรายละเอียดดังนี้</div>`;
      const tempText2 = `<div><b>ชื่อลูกค้า คุณ</b> ${rows[0].qNormalName} <b>นามสกุล</b>  ${rows[0].qNormalLast} <br /><b>ที่อยู่จัดส่ง </b> ${rows[0].qNormalAddressDelivery} <br /><b>เบอร์โทรติดต่อ </b> ${rows[0].qNormalPhone}<br /><b>วันที่สั่งซื้อสินค้า </b> วัน${rows[0].qNormalDate}<br /><b>เวลาที่สั่งซื้อสินค้า </b> ${rows[0].qNormalTime} นาที<br /><b>หมายเลขขอใบเสนอราคาที่  </b> ${rows[0].qNormalId}</div>`;
      const tempText3 = `<div style="text-align: center;>
              <h4 :style="{ paddingTop: '20px' }">
                    <br><b>รายละเอียดการสั่งสินค้า</b></h4></div>`;
      const html = `${tempText1}${tempText2}${tempText3}${tableGenerator(
        rows
      )}`;
      let infoadmin = await transporter.sendMail({
        from: '"No reply" <cpacalertservice@hotmail.com>', // อีเมลผู้ส่ง
        to: "s6006021630016@kmutnb.ac.th", // อีเมลผู้รับ สามารถกำหนดได้มากกว่า 1 อีเมล โดยขั้นด้วย ,(Comma)
        subject: "แจ้งเตือนAdmin ความต้องการขอใบเสนอราคา(ทั่วไป)", // หัวข้ออีเมล
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
          if (q.qNormalQuantity === 0) {
            tbody.push(
              `<tr>
                  <td style="border:1px solid black;">${q.qNormalProductname}</td>
                  <td style=" text-align: center;border:1px solid black;">${q.qNormalSquaremetre}</td>
                  <td style=" text-align: center;border:1px solid black;">${q.qNormalUnittype}</td>
                  </tr>`
            );
          } else {
            tbody.push(
              `<tr>
                  <td style="border:1px solid black;">${q.qNormalProductname}</td>
                  <td style=" text-align: center;border:1px solid black;">${q.qNormalQuantity}</td>
                <td style=" text-align: center;border:1px solid black;">${q.qNormalUnittype}</td>
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

    //sendMail Space

    res.send({
      ok: true,
      Normal: rows,
      lastid: quanum,
    });
  } catch (e) {
    res.send({ ok: false, error: e.message });
  }
});

//
