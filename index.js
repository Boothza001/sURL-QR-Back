const express = require("express");
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
const randomstring = require("randomstring");
const cors = require("cors");

const app = express();
const port = 3000;

mongoose
  .connect("mongodb+srv://root:1234@cluster0.sbjr9av.mongodb.net/db")
  .then(() => console.log("Connected to MongoDB"))
  .catch((err) => console.error("Failed to connect to MongoDB", err));

const Url = mongoose.model("Url", {
  url: String,
  surl: String,
  count: { type: Number, default: 0 },
});

app.use(cors());
app.use(bodyParser.json());

app.post("/api/create", async (req, res) => {
  try {
    const { url } = req.body;
    const sUrl = randomstring.generate({ length: 4, charset: url });
    const newUrl = await Url.create({ url, surl: sUrl });
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

app.put("/api/update/:surl", async (req, res) => {
  try {
    const updatedUrl = await Url.findOneAndUpdate(
      { surl: req.body.surl },
      { $inc: { count: 1 } },
      { new: true }
    );
    !updatedUrl ? res.status(404).send("URL not found") : res.send(updatedUrl);
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
