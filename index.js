const express = require("express");
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
const ShortUniqueId = require("short-unique-id");
const cors = require("cors");
const fetch = require("node-fetch");
const app = express();
const port = process.env.PORT || 3000;
const uid = new ShortUniqueId();
app.use((req, res, next) => {
  res.setHeader(
    "Access-Control-Allow-Origin",
    "https://s-url-qr-front-ki6ytygw2-boothza001s-projects.vercel.app"
  );
  res.setHeader("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type");
  next();
});
app.use(cors());
app.use(bodyParser.json());

mongoose
  .connect("mongodb+srv://root:1234@cluster0.sbjr9av.mongodb.net/db")
  .then(() => console.log("Connected to MongoDB"))
  .catch((err) => console.error("Failed to connect to MongoDB", err));

const Url = mongoose.model("Url", {
  url: String,
  surl: String,
  count: { type: Number, default: 0 },
});

app.get("/:surl", async (req, res) => {
  try {
    const urlData = await Url.findOneAndUpdate(
      { surl: req.params.surl },
      { $inc: { count: 1 } }
    );

    if (urlData) {
      const url3000 = urlData.url;
      res.redirect(url3000); // ทำการ redirect ผู้ใช้ไปยัง URL ปลายทาง
    } else {
      res.status(404).send("URL not found");
    }
  } catch (error) {
    console.error(error);
    res.status(500).send("Internal Server Error");
  }
});

app.post("/api/create", async (req, res) => {
  try {
    const { url } = req.body;
    const sUrl = uid.rnd(5);
    const newsUrl = sUrl;
    const newUrl = await Url.create({ url, surl: newsUrl });
    res.send(newUrl);
  } catch (error) {
    res.status(500).send(error);
  }
});

app.get("/api/show", async (req, res) => {
  try {
    const urls = await Url.find();
    res.send(urls);
  } catch (error) {
    res.status(500).send(error);
  }
});

app.delete("/api/delete/:id", async (req, res) => {
  try {
    const deletedUrl = await Url.findByIdAndDelete(req.params.id);
    !deletedUrl ? res.status(404).send("Url not found") : res.send(deletedUrl);
  } catch (error) {
    res.status(500).send(error);
  }
});

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});

// const express = require("express");
// const mongoose = require("mongoose");
// const bodyParser = require("body-parser");
// const ShortUniqueId = require("short-unique-id");
// const fetch = require("node-fetch");
// const app = express();
// const uid = new ShortUniqueId();
// const cors = require("cors");
// const port = process.env.PORT || 3000;

// app.use(cors());
// app.use(bodyParser.json());
// const svaddr = "https://surl-qr-back-2.onrender.com";

// mongoose
//   .connect("mongodb+srv://root:1234@cluster0.sbjr9av.mongodb.net/db")
//   .then(() => console.log("Connected to MongoDB"))
//   .catch((err) => console.error("Failed to connect to MongoDB", err));

// const Url = mongoose.model("Url", {
//   url: String,
//   surl: String,
//   domain: String,
//   date: String,
//   count: { type: Number, default: 0 },
// });

// app.use((req, res, next) => {
//   res.setHeader("Access-Control-Allow-Origin", svaddr);
//   res.setHeader("Access-Control-Allow-Methods", "POST, GET, PUT");
//   res.setHeader("Access-Control-Allow-Headers", "Server, Date");
//   next();
// });

// app.get("/api/redirect/:surl", async (req, res) => {
//   try {
//     const urlData = await Url.findOneAndUpdate(
//       { surl: req.params.surl },
//       { $inc: { count: 1 } }
//     );

//     if (urlData) {
//       const url3000 = urlData.url;
//       res.redirect(url3000);
//     } else {
//       res.status(404).send("URL not found");
//     }
//   } catch (error) {
//     console.error(error);
//     res.status(500).send("Internal Server Error");
//   }
// });

// app.post("/api/create", async (req, res) => {
//   try {
//     const { url } = req.body;
//     const sUrl = uid.rnd(5);
//     const domain = req.get("Server");
//     const date = new Date();
//     const newUrl = await Url.create({ url, surl: sUrl, domain, date });
//     console.log("New URL data:", newUrl);
//     console.log(newUrl);
//     res.send(newUrl);
//   } catch (error) {
//     res.status(500).send(error);
//   }
// });

// app.get("/api/show", async (req, res) => {
//   try {
//     const urls = await Url.find();
//     res.send(urls);
//   } catch (error) {
//     res.status(500).send(error);
//   }
// });

// app.delete("/api/delete/:id", async (req, res) => {
//   try {
//     const deletedUrl = await Url.findByIdAndDelete(req.params.id);
//     !deletedUrl ? res.status(404).send("Url not found") : res.send(deletedUrl);
//   } catch (error) {
//     res.status(500).send(error);
//   }
// });

// app.listen(port, () => {
//   console.log(`Server is running on port ${port}`);
// });
