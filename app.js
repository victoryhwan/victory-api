require("dotenv").config();
const express = require("express");
const app = express();
const http = require("http");
var cors = require("cors");
var path = require("path");
var bodyParser = require("body-parser");
// var cookieParser = require('cookie-parser');
const formData = require("express-form-data");
const os = require("os");

app.set("port", process.env.PORT || 3031);

// app.listen(port, ()=> winston.info(`Listening on port ${port}...`));
// app.use(logger('dev'));
app.use(express.json({ limit: "50mb" }));
app.use(express.urlencoded({ extended: false, limit: "50mb" }));
// app.use(cookieParser());
// app.use(express.static(path.join(__dirname, 'public')));
app.use(bodyParser.json({ limit: "200mb" }));
app.use(bodyParser.urlencoded({ extended: true, limit: "200mb" }));
app.use(bodyParser.text({ limit: "200mb" }));

http.createServer(app).listen(app.get("port"), function() {
  //   winston.info(`Listening on port ${app.get('port')}...`)
  console.log("Express server listening on port " + app.get("port"));
});

var allowCORS = function(req, res, next) {
  res.header("Acess-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Methods", "GET, PUT, POST, DELETE, OPTIONS");
  res.header(
    "Access-Control-Allow-Headers",
    "Origin, Accecpt, Content-Type, Access-Control-Allow-Origin, Authorization, X-Requested-With, Access-Control-Request-Method, Access-Control-Request-Headers"
  );
  res.header("Access-Control-Allow-Credentials", true);
  next();
};

app.use(allowCORS);
app.use(cors());
app.set("trust proxy", 1); // trust first proxy

const options = {
  uploadDir: os.tmpdir()
};
app.use(function(req, res, next) {
  if (process.env.API_KEY != req.headers.api_key) {
    res.json({
      code: 410,
      message: "API Key Auth Fail",
      data: `${process.env.API_KEY}, ${JSON.stringify(req.headers)}`
    });
  } else {
    next();
  }
});

app.use(formData.parse(options));

app.get("/", (req, res) => res.send("Welcome to VicFactory"));
app.use("/api/member", require("./routes/api/member/controller"));
app.use("/api/cart", require("./routes/api/cart/controller"));
app.use("/auth", require("./routes/api/auth/auth"));
app.use("/admin", require("./routes/api/admin/admin"));
