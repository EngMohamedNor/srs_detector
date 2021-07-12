const express = require("express");
const bodyParser = require("body-parser");
const fileUpload = require("express-fileupload");
const path = require("path");
const fs = require("fs");
var sqlite3 = require("sqlite3").verbose();

var mammoth = require("mammoth");
var word2html = require("word-to-html");

let db = new sqlite3.Database("./words.db", (err) => {
  if (err) {
    console.error(err.message);
  }
  console.log("Connected to the my database.");
});
const app = express();

app.use(bodyParser.json());
app.use(express.urlencoded({ extended: true }));

app.use(express.static(__dirname + "/public"));
app.use("/public", express.static("public"));
app.use(fileUpload());

//setting up handlebars
let handlebars = require("express-handlebars").create({
  defaultLayout: "main",
  extname: "hbs",
});

app.engine("hbs", handlebars.engine);
app.set("view engine", "hbs");
app.set("views", path.join(__dirname, "views"));

const port = process.env.PORT || 3000;
app.listen(port, () => console.log(`Server started on port ${port}`));

app.get("/", (req, res) => {
  res.render("index", { layout: "main" });
});

app.get("/upload", (req, res) => {
  res.render("upload", { layout: "main" });
});

app.get("/analyse", (req, res) => {
  let filePath =
    require("path").join(".", "/") + "/public/documents/" + req.query.doc;
  let plaintext = "";
  if (filePath.includes(".doc")) {
    mammoth
      .extractRawText({ path: filePath })
      .then(function (result) {
        var text = result.value; // The raw text
        console.log(text);
        plaintext = text;
        res.render("analyse", { plaintext, layout: "main" });
      })
      .done();
  } else {
    plaintext = fs.readFileSync(filePath);
    res.render("analyse", { plaintext, layout: "main" });
  }
});

app.post("/upload_document", (req, res) => {
  console.log("reached");

  var dir = require("path").join(".", "/") + "/public/documents/";
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir);
  }

  let document = req.files.file;
  let domain = req.body.domain;
  let domain_decription = "";

  switch (domain) {
    case "mcee":
      domain_decription = "Mechanical Engineering (MCEE)";
      break;
    case "cive":
      domain_decription = "Civil Engineering (CIV)";
      break;
    case "biee":
      domain_decription = "Biomedical Engineering (BIEE)";
  }
  console.log(domain);
  var filePath =
    require("path").join(".", "/") + "/public/documents/" + document.name;
  document.mv(filePath, function (err) {
    if (err) console.log(err);
    res.redirect(
      "/analyse/?doc=" +
        document.name +
        "&domain=" +
        domain +
        "&domain_desc=" +
        domain_decription
    );
  });
});

app.get("/keywords", (req, res) => {
  let wordData = [
    {
      keyword: "system",
      synonyms: [
        {
          domain: "mcee",
          words: [
            "network",
            "design",
            "software",
            "development",
            "database",
            "program",
          ],
        },
        {
          domain: "cive",
          words: [
            "power",
            "area",
            "control",
            "ventilation",
            "consumption",
            "software",
            "program",
          ],
        },
        {
          domain: "biee",
          words: [
            "neuroscience",
            "time",
            "neuron",
            "activity",
            "cell",
            " brain",
            "rate",
            "program",
          ],
        },
      ],
    },
    {
      keyword: "design",
      synonyms: [
        { domain: "CS", word: "Graphic Design" },
        { domain: "CS", word: "Web Design" },
        { domain: "Health", word: "Xray Design" },
        { domain: "Engineering", word: "Building Design" },
      ],
    },
  ];

  let words = [
    "machine",
    "design",
    "windows",
    "model",
    "source",
    "application",
    "control",
    "state",
    "action",
    "cell",
    "function",
    "system",
    "computer",
    "software	",
    "data",
    "time",
    "user",
    "application",
    "model",
    "information",
    "problem",
    "function",
    "language",
    "algorithm",
    "science	",
    "university	",
    "program	",
    "set",
    "use",
    "method",
    "research",
    "device",
  ];

  let data = fs.readFileSync("data.json");
  let json = JSON.parse(data);

  console.log(json);
  res.send(json);
});
