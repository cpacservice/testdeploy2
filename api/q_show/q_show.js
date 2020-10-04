const express = require("express");
const router = express.Router();
const nodemailer = require("nodemailer");
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
    ///send Mail Space
    async function sendMail() {
      // สร้างออปเจ็ค transporter เพื่อกำหนดการเชื่อมต่อ SMTP และใช้ตอนส่งเมล
      let transporter = nodemailer.createTransport({
        host: "smtp.mailtrap.io",
        port: 2525,
        auth: {
          user: "2c642fdfcfd5a3",
          pass: "a756a74cb04af0",
        },
      });
      const tempText1 = `<div style="text-align: center;>
      <h4 :style="{ paddingTop: '20px' }">
            <b>บริษัท ผลิตภัณฑ์และวัตถุก่อสร้าง จำกัด</b></h4>`;
      const tempText2 = `<div>1516 ถ.ประชาราษฎร์ 1 แขวงวงศ์สว่าง เขตบางซื่อ กรุงเทพฯ 10800<br />โทร.02-555-5000 CPAC CALL CENTER 02-555-5555 Email:cpacinside@scg.com</div></div><br />`;
      const tempText3 = `<div><b>เรียนคุณ</b> ${rows[0].qNormalName} <b>นามสกุล</b>  ${rows[0].qNormalLast} <br /><b>ที่อยู่จัดส่ง </b> ${rows[0].qNormalAddressDelivery} <br /><b>เบอร์โทรติดต่อ </b> ${rows[0].qNormalPhone}<br /><b>วันที่สั่งซื้อสินค้า </b> วัน${rows[0].qNormalDate}<br /><b>เวลาที่สั่งซื้อสินค้า </b> ${rows[0].qNormalTime} นาที<br /><b>หมายเลขขอใบเสนอราคาที่  </b> ${rows[0].qNormalId}</div>`;
      const tempText4 = `<div style="text-align: center;>
            <h4 :style="{ paddingTop: '20px' }">
                  <br><b>รายการขอเสนอราคาของท่าน</b></h4></div>`;
      // const table = `<table ><tr>
      //     <th>หมายเลขสินค้า</th> <th>สินค้า</th><th>จำนวน</th>
      //     </tr>
      //     <tr>
      //     <td>${qNormalProductid}<td>
      //     <td>${qNormalProductname}<td>
      //     <td>${qNormalQuantity}<td>
      //     </td></tr></table>`;
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
      )}`;

      let infouser = await transporter.sendMail({
        from: '"No reply" <cpacservice-f27bbb@inbox.mailtrap.io>', // อีเมลผู้ส่ง
        to: `${rows[0].qNormalEmail}`, // อีเมลผู้รับ สามารถกำหนดได้มากกว่า 1 อีเมล โดยขั้นด้วย ,(Comma)
        subject: "เรียนลูกค้า CPAC", // หัวข้ออีเมล
        text: "ใบเสนอราคาของท่านกำลังดำเนินการ กรุณารอเจ้าหน้าที่ติดต่อกลับ", // plain text body
        html, // html body
      });
      console.log("Message sent: %s", infouser.messageId);
    }

    // async function sendMailtoadmin() {
    //   // สร้างออปเจ็ค transporter เพื่อกำหนดการเชื่อมต่อ SMTP และใช้ตอนส่งเมล
    //   let transporter = nodemailer.createTransport({
    //     host: "smtp.mailtrap.io",
    //     port: 2525,
    //     auth: {
    //       user: "2c642fdfcfd5a3",
    //       pass: "a756a74cb04af0",
    //     },
    //   });
    //   const tempText1 = `<div>ขณะนี้มีรายการสั่งซื้อหมายเลขที่  ${rows[0].orderid} กรุณาตรวจสอบและดำเนินการ โดยมีรายละเอียดดังนี้</div>`;
    //   const tempText2 = `<div><b>คุณ</b> ${rows[0].firstname} <b>นามสกุล</b>  ${rows[0].lastname} <br /><b>ที่อยู่จัดส่ง </b> ${rows[0].address} <br /><b>เบอร์โทรติดต่อ </b> ${rows[0].phone}<br /><b>วันที่สั่งซื้อสินค้า </b> วัน${rows[0].orderdate}<br /><b>เวลาที่สั่งซื้อสินค้า </b> ${rows[0].ordertime} นาที<br /><b>หมายเลขคำสั่งซื้อที่  </b> ${rows[0].orderid}</div>`;
    //   const tempText3 = `<div style="text-align: center;>
    //         <h4 :style="{ paddingTop: '20px' }">
    //               <br><b>รายละเอียดการสั่งสินค้า</b></h4></div>`;
    //   const html = `${tempText1}${tempText2}${tempText3}${tableGenerator(
    //     rows
    //   )}`;
    //   let infoadmin = await transporter.sendMail({
    //     from: '"No reply" <cpacservice-f27bbb@inbox.mailtrap.io>', // อีเมลผู้ส่ง
    //     to: "natthariknan@gmail.com", // อีเมลผู้รับ สามารถกำหนดได้มากกว่า 1 อีเมล โดยขั้นด้วย ,(Comma)
    //     subject: "แจ้งเตือนAdmin", // หัวข้ออีเมล
    //     text: "", // plain text body
    //     html, // html body
    //   });
    //   console.log("Message sent: %s", infoadmin.messageId);
    //   function tableGenerator(orderDetails) {
    //     const theader = `<tr style="background :#3399FF" >
    //       <th style="border:1px solid black;" >สินค้า</th>
    //       <th style="border:1px solid black;">จำนวน</th>
    //       <th style="border:1px solid black;">ราคาต่อชิ้น</th>
    //       <th style="border:1px solid black;">ราคารวม</th>

    //       </tr>`;
    //     const tbody = [];

    //     for (const orderDetail of orderDetails) {
    //       tbody.push(
    //         `<tr>
    //           <td style="border:1px solid black;">${
    //             orderDetail.productname
    //           }</td>
    //           <td style=" text-align: center;border:1px solid black;">${
    //             orderDetail.quantity
    //           }</td>
    //           <td style=" text-align: center;border:1px solid black;">${
    //             orderDetail.unitprice
    //           }</td>
    //           <td style=" text-align: center;border:1px solid black;">฿ ${formatPrice(
    //             orderDetail.quantity * orderDetail.unitprice
    //           )}</td>
    //           </tr>`
    //       );
    //     }

    //     const vatRow = `<tr style=" border:1px solid black;" ><th style=" border:1px solid black;  background :#3399FF;">vat (7%)</th><th style=" background :#3399FF;" colspan="4">${formatPrice(
    //       calVat(orderDetails).vat
    //     )} บาท</th></tr>`;
    //     const totalRow = `<tr style=" border:1px solid black;"><th style=" border:1px solid black; background :#3399FF; ">ยอดที่ต้องชำระ</th><th style=" background :#3399FF; color:red;" colspan="4">${formatPrice(
    //       calVat(orderDetails).netPrice
    //     )} บาท</th></tr>`;

    //     return `<table style="width: 100%;  border-collapse: collapse; border:1px solid black;">${theader}${tbody.join(
    //       ""
    //     )}${vatRow}${totalRow}</table>`;
    //   }
    //   //ตรงนี้ฟังก์ชันทำให้ค่ามีลูกน้ำสวยๆ
    //   function formatPrice(value) {
    //     let val = (value / 1).toFixed(2).replace(",", ".");
    //     return val.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
    //   }
    //   function calVat(products) {
    //     const totalPrice = products.reduce(
    //       (total, product) => (total += product.unitprice * product.quantity),
    //       0
    //     );
    //     const vat7 = totalPrice * (7 / 100);
    //     const netPrice = vat7 + totalPrice;

    //     return { vat: vat7, netPrice };
    //   }
    // }
    // // sendMail().catch(console.error);
    // sendMailtoadmin().catch(console.error);
    sendMail().catch(console.error);

    ///sendMail Space

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
