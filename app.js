const express = require("express");
const bodyParser = require("body-parser");
const fileUpload = require("express-fileupload");
const path = require("path");
const fs = require("fs");
var mammoth = require("mammoth");
var word2html = require("word-to-html");

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

  var filePath =
    require("path").join(".", "/") + "/public/documents/" + document.name;
  document.mv(filePath, function (err) {
    if (err) console.log(err);
    res.redirect("/analyse/?doc=" + document.name);
  });
});
