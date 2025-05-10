const express = require("express");
const multer = require("multer");
const fs = require("fs");
const path = require("path");

const app = express();
const PORT = 3000;

const storage = multer.diskStorage({
  destination: "videos/",
  filename: (req, file, cb) => {
    cb(null, Date.now() + path.extname(file.originalname));
  }
});

const upload = multer({ storage });
app.use("/videos", express.static(path.join(__dirname, "videos")));
app.use(express.urlencoded({ extended: true }));

app.get("/upload", (req, res) => {
  res.send(`
    <h2>ভিডিও আপলোড করুন</h2>
    <form method="POST" action="/upload" enctype="multipart/form-data">
      <input type="file" name="video" accept="video/mp4" required />
      <br/><br/>
      <button type="submit">আপলোড</button>
    </form>
  `);
});

app.post("/upload", upload.single("video"), (req, res) => {
  res.send(`<p>ভিডিও আপলোড সম্পন্ন! <a href='/'>হোমে যান</a></p>`);
});

app.get("/", (req, res) => {
  fs.readdir("videos", (err, files) => {
    if (err) return res.send("ভিডিও লোড করা যাচ্ছে না");

    let videoList = files.map(file => `
      <div>
        <h3>${file}</h3>
        <video width="600" controls>
          <source src="/videos/${file}" type="video/mp4">
          ভিডিও চালানো যাচ্ছে না
        </video>
      </div><hr/>
    `).join("\n");

    res.send(`
      <h1>Banglaxxx - ভিডিও গ্যালারি</h1>
      <a href="/upload">[ভিডিও আপলোড করুন]</a>
      <div>${videoList}</div>
    `);
  });
});

if (!fs.existsSync("videos")) fs.mkdirSync("videos");

app.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
});