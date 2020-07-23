const fs = require("fs");
const express = require("express");
const bodyParser = require("body-parser");
const cron = require("./node_modules/node-cron");
const app = express();
const port = process.env.PORT || 5000;
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

const { getSmp } = require("./crawl.js");

const data = fs.readFileSync("./database.json");
const conf = JSON.parse(data);
const mysql = require("mysql");

const multer = require("multer");
const upload = multer({ dest: "./upload" });

async function handleAsync() {
  const rec = await getSmp();
  console.log("rec", rec);
}

cron.schedule("*/2 * * * *", async () => {
  console.log("running a task every two minutes");
  await handleAsync();
});

const connection = mysql.createConnection({
  host: conf.host,
  user: conf.user,
  password: conf.password,
  port: conf.port,
  database: conf.database,
});
connection.connect();

app.get("/api/customers", (req, res) => {
  connection.query(
    "Select * From Customer where isDeleted = 0",
    (err, rows, fields) => {
      res.send(rows);
    }
  );
});

app.use("/image", express.static("./upload"));

app.post("/api/customers", upload.single("image"), (req, res) => {
  let sql = "insert into customer values (null, ?, ?, ?, ?, ?, now(), 0)";
  let image = "/image/" + req.file.filename;
  let name = req.body.name;
  let birthday = req.body.birthday;
  let gender = req.body.gender;
  let job = req.body.job;
  let params = [image, name, birthday, gender, job];
  connection.query(sql, params, (err, rows, fields) => {
    res.send(rows);
  });
});

app.delete("/api/customers/:id", (req, res) => {
  let sql = "update customer set isDeleted = 1 where id = ?";
  let params = [req.params.id];
  connection.query(sql, params, (err, rows, fields) => {
    res.send(rows);
  });
});

app.listen(port, () => {
  console.log(`Listening to port ${port}`);
  handleAsync();
});
