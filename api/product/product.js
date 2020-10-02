const express = require("express");
const router = express.Router();

const nodemailer = require("nodemailer");
module.exports = router;
//     http://localhost:7000/api/student?class=1

// /api/product/list //โชว์ทั้งหมด
router.get("/", async (req, res) => {
  // ใช้ async function
  try {
    let db = req.db;
    let rows;
    if (req.query.categoryid) {
      rows = await db("products as p").where(
        "categoryid",
        "=",
        req.query.categoryid
      );
    } else if (req.query.productid) {
      rows = await db("products as p").where(
        "productid",
        "=",
        req.query.productid
      );
    } else {
      rows = await db("products as p").join(
        "categories as c",
        "c.categoryid",
        "p.categoryid"
      );
    }
    res.send({
      ok: true, // ส่ง status
      products: rows, // ส่งค่ากลับ
    });
  } catch (e) {
    res.send({ ok: false, error: e.message });
  }
});

// /api/student/แก้ไขรายชื่อ
router.post("/update", async (req, res) => {
  //put
  let db = req.db;
  // UPDATE products SET fname=?, lname=? WHERE id = 1
  await db("products").where({ productid: req.body.productid }).update({
    productname: req.body.productname,
    categoryid: req.body.categoryid,
    unitprice: req.body.unitprice,
    notation: req.body.notation,
    productstatus: req.body.productstatus,
    productimage: req.body.productimage,
    quotationStatus: req.body.quotationStatus,
    height: req.body.height,
    weight: req.body.weight,
    length: req.body.length,
    width: req.body.width,
    unit: req.body.unit,
  });
  res.send({ ok: true });
});

// /api/product/delete
router.post("/delete", async (req, res) => {
  let db = req.db;
  await db("products")
    .where({ productid: req.body.productid })
    .delete()
    .then(() => {
      res.send({ ok: true });
    })
    .catch((e) => res.send({ ok: false, error: e.message }));
});

router.post("/insert", async (req, res) => {
  // if (
  //   req.body.productname == null ||
  //   req.body.productname == "" ||
  //   req.body.unitprice == null ||
  //   req.body.unitprice == "" ||
  //   req.body.categoryid == null ||
  //   req.body.categoryid == "" ||
  //   req.body.productstatus == null ||
  //   req.body.productstatus == ""
  // ) {
  //   res.send({
  //     ok: false,
  //     message: "ไม่มีค่า",
  //   });
  // }
  let db = req.db;
  let ids = await db("products").insert({
    productname: req.body.productname,
    unitprice: req.body.unitprice,
    categoryid: req.body.categoryid,
    notation: req.body.notation,
    productstatus: req.body.productstatus,
    productimage: req.body.productimage,
    height: req.body.height,
    weight: req.body.weight,
    length: req.body.length,
    width: req.body.width,
    unit: req.body.unit,
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
    <h2>${req.body.productname}</h2>
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
    ids: ids,
  });
}),
  // router.get("/about", function (req, res) {
  //   res.send("About birds");
  // });

  router.get("/search", async (req, res) => {
    // ใช้ async function
    try {
      let db = req.db;
      let rows;
      if (req.query.productname) {
        // rows = await db("products")
        //   .where("productname", "like", '%' + req.query.productname + '%',"productid","like",'%' + req.query.productname + '%')
        rows = await db("products as p")
          .join("categories as c", "c.categoryid", "p.categoryid")
          .where("productname", "like", "%" + req.query.productname + "%")
          .orWhere("categoryname", "like", "%" + req.query.productname + "%");
      } else {
        rows = await db("products");
      }
      res.send({
        ok: true, // ส่ง status
        products: rows, // ส่งค่ากลับ
      });
    } catch (e) {
      res.send({ ok: false, error: e.message });
    }
  });
