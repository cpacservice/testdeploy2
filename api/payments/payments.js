const express = require("express");
const router = express.Router();

const nodemailer = require("nodemailer");
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
        rows = await db("payments as p")
          .join("orders as o", "o.orderid", "p.orderid")
          .where("p.orderid", "=", req.query.orderid);
      } else {
        rows = await db("payments");
      }
      res.send({
        ok: true, // ส่ง status
        payments: rows, // ส่งค่ากลับ
      });
    } catch (e) {
      res.send({ ok: false, error: e.message });
    }
  } catch (e) {
    res.send({ ok: false, error: e.message });
  }
});

router.get("/showpayment", async (req, res) => {
  // ใช้ async function
  try {
    let db = req.db;
    let rows;
    try {
      rows = await db("payments as p")
        .join("orders as o", "o.orderid", "p.orderid")
        .join("bank_account as b", "b.bankNum", "p.banknum");

      res.send({
        ok: true, // ส่ง status
        payments: rows, // ส่งค่ากลับ
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
  let rows2;
  let rows;
  let lastid;
  let db = req.db;
  let status = "กำลังดำเนินการ";
  try {
    rows2 = await db("payments")
      .insert({
        orderid: req.body.orderid,
        transferName: req.body.transferName,
        banknum: req.body.banknum,
        totalprice: req.body.totalprice,
        paymentDate: req.body.paymentDate,
        paymentTime: req.body.paymentTime,
        paymentImage: req.body.paymentImage,
        paymentstatus: status,
      })
      .returning("paymentid")
      .then(function (paymentid) {
        lastid = paymentid;
      });

    //join ตารางเพื่อดึงค่า email
    rows = await db("payments as p")
      .join("orders as o", "o.orderid", "p.orderid")
      .join("users as u", "u.userid", "o.userid")
      .join("bank_account as b", "b.bankNum", "p.banknum")
      .where("p.paymentid", "=", lastid);

    //join ตารางเพื่อดึงค่า email
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
      const tempText3 = `<div><b>เรียนคุณ</b> ${rows[0].firstname} <b>นามสกุล</b>  ${rows[0].lastname} <br /></div>`;
      const tempText4 = `<div style="text-align: center;>
                <h4 :style="{ paddingTop: '20px' }">
                      <br><b>แจ้งเตือนการชำระเงินของท่าน</b></h4></div>`;
      const image = `<div><u><b>หลักฐานการโอน</b></u><br ><a href="${rows.paymentImage}">คลิกที่นี่</a></div>`;
      const tempText5 = `<div><b></b><h4>หมายเหตุ</h4></b>
          <ul>
          <li>กรุณารอการติดต่อกลับจากเจ้าหน้าที่ภายใน 3 วันทำการ</li>
          <li>ท่านสามารถดูรายละเอียดการขำระเงินของท่าน และ ติดตามสถานะได้ที่หน้าเว็บไซต์ เมนู 'การซื้อของฉัน'</li>
        </ul></div>`;
      function tableGenerator(payments) {
        const theader = `<tr style="background :#3399FF" >
                <th style="border:1px solid black;" >หมายเลขออเดอร์</th>
                <th style="border:1px solid black;">ชื่อที่แจ้งชำระ</th>
                <th style="border:1px solid black;">ธนาคารที่ชำระ</th>
                <th style="border:1px solid black;">ยอดชำระ</th>

                <th style="border:1px solid black;">สถานะการชำระเงิน</th>

                </tr>`;
        const tbody = [];

        for (const payment of payments) {
          tbody.push(
            `<tr>
                    <td style="border:1px solid black;">${payment.orderid}</td>
                    <td style=" text-align: center;border:1px solid black;">${payment.transferName}</td>
                    <td style=" text-align: center;border:1px solid black;">${payment.bankName}</td>
                    <td style=" text-align: center;border:1px solid black;">${payment.totalprice}</td>
                  
                    <td style=" text-align: center;border:1px solid black;">${payment.paymentstatus}</td>
                    </tr>`
          );
        }

        return `<table style="width: 100%;  border-collapse: collapse; border:1px solid black;">${theader}${tbody.join(
          ""
        )}</table>`;
      }
      const html = `${tempText1}${tempText2}${tempText3}${tempText4}${tableGenerator(
        rows
      )}${image}${tempText5}`;

      let infouser = await transporter.sendMail({
        from: '"No reply" <cpacservicealert@gmail.com>', // อีเมลผู้ส่ง
        to: `${rows[0].email}`, // อีเมลผู้รับ สามารถกำหนดได้มากกว่า 1 อีเมล โดยขั้นด้วย ,(Comma)
        subject: "เรียนลูกค้า CPAC", // หัวข้ออีเมล
        text: "การชำระเงินของท่านกำลังดำเนินการ", // plain text body
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
      const tempText1 = `<div>ขณะนี้มีลูกค้าได้ทำการชำระเงิน สำหรับหมายเลขออเดอร์ ${rows[0].orderid} กรุณาตรวจสอบและดำเนินการ โดยมีรายละเอียดดังนี้</div>`;
      const tempText2 = `<div><b>ชื่อลูกค้า คุณ</b> ${rows[0].firstname} <b>นามสกุล</b>  ${rows[0].lastname} </div>`;
      const tempText3 = `<div style="text-align: center;>
                  <h4 :style="{ paddingTop: '20px' }">
                        <br><b>รายละเอียดการชำระเงิน</b></h4></div>`;
      const html = `${tempText1}${tempText2}${tempText3}${tableGenerator(
        rows
      )}`;
      let infoadmin = await transporter.sendMail({
        from: '"No reply" <cpacservice-f27bbb@inbox.mailtrap.io>', // อีเมลผู้ส่ง
        to: "s6006021630016@kmutnb.ac.th", // อีเมลผู้รับ สามารถกำหนดได้มากกว่า 1 อีเมล โดยขั้นด้วย ,(Comma)
        // อีเมลผู้รับ สามารถกำหนดได้มากกว่า 1 อีเมล โดยขั้นด้วย ,(Comma)
        subject: `แจ้งการชำระเงินออเดอร์ ${rows[0].orderid}`, // หัวข้ออีเมล
        text: "", // plain text body
        html, // html body
      });
      console.log("Message sent: %s", infoadmin.messageId);
      function tableGenerator(payments) {
        const theader = `<tr style="background :#3399FF" >
                <th style="border:1px solid black;" >หมายเลขออเดอร์</th>
                <th style="border:1px solid black;">ชื่อที่แจ้งชำระ</th>
                <th style="border:1px solid black;">ธนาคารที่ชำระ</th>
                <th style="border:1px solid black;">ยอดชำระ</th>
                <th style="border:1px solid black;">หลักฐานการชำระเงิน</th>
                <th style="border:1px solid black;">สถานะการชำระเงิน</th>

                </tr>`;
        const tbody = [];

        for (const payment of payments) {
          tbody.push(
            `<tr>
                    <td style="border:1px solid black;">${payment.orderid}</td>
                    <td style=" text-align: center;border:1px solid black;">${payment.transferName}</td>
                    <td style=" text-align: center;border:1px solid black;">${payment.bankName}</td>
                    <td style=" text-align: center;border:1px solid black;">${payment.totalprice}</td>
                    <td style=" text-align: center;border:1px solid black;"><img height="150px" width="100px" src="${payment.paymentImage}"/></td>
                    <td style=" text-align: center;border:1px solid black;">${payment.paymentstatus}</td>
                    </tr>`
          );
        }

        return `<table style="width: 100%;  border-collapse: collapse; border:1px solid black;">${theader}${tbody.join(
          ""
        )}</table>`;
      }
    }

    sendMailtoadmin().catch(console.error);
    sendMail().catch(console.error);

    ///sendMail Space

    res.send({
      ok: true,
      payments: rows,
    });
  } catch (e) {
    res.send({ ok: false, error: e.message });
  }
  let orderupdate;
  try {
    let db = req.db;
    await db("orders").where({ orderid: req.body.orderid }).update({
      orderStatus: status,
    });
    orderupdate;
  } catch (e) {
    res.send({ ok: false, error: e.message });
  }
});

router.post("/update", async (req, res) => {
  //put
  let db = req.db;
  let rows;

  await db("payments").where({ paymentid: req.body.paymentid }).update({
    paymentstatus: req.body.paymentstatus,
  });
  if (req.body.paymentstatus === "ไม่สำเร็จ") {
    rows = await db("orders as o ")
      .join("payments as p", "p.orderid", "o.orderid")
      .where("p.paymentid", "=", req.body.paymentid)
      .update({
        orderStatus: "การชำระเงินไม่สำเร็จ",
      });
  } else if (req.body.paymentstatus === "สำเร็จ") {
    rows = await db("orders as o ")
      .join("payments as p", "p.orderid", "o.orderid")
      .where("p.paymentid", "=", req.body.paymentid)
      .update({
        orderStatus: "กำลังจัดส่ง",
      });
  }
  res.send({
    ok: true,
  });
});
router.post("/delete", async (req, res) => {
  let db = req.db;
  await db("payments")
    .where({ paymentid: req.body.paymentid })
    .delete()
    .then(() => {
      res.send({ ok: true });
    })
    .catch((e) => res.send({ ok: false, error: e.message }));
});
