var mysql_dbc = require("../../config/db_con")();
var connection = mysql_dbc.init();
var express = require("express");
var router = express.Router();
var async = require("async");
// const winston   = require('../../config/winston');
var SERVER_ERR_MSG = "Server Error";
const _member = require("./mng/common");
/* 로그인 */
router.post("/login", async (req, res) => {
  await login(req, res);
});

/* 데이터 확인용 */
router.get("/list", async (req, res) => {
  getMemberList(req, res);
});

/* 회원등록 */
router.get("/regist", async (req, res) => {
  await regist(req, res);
});

async function login(req, res) {
  try {
    var member = {
      id: req.body.id,
      pw: req.body.pw
    };

    var rs = await _member.selectMember(member);
    res.json({
      code: rs.code,
      message: rs.message,
      data: rs.data
    });
  } catch (err) {
    console.log(err);
    res.json({
      code: 500,
      message: SERVER_ERR_MSG
    });
  }
}

async function getMemberList(req, res) {
  try {
    var rs = await _member.selectMemberList();
    res.json({
      code: rs.code,
      message: rs.message,
      data: rs.data
    });
  } catch (err) {
    console.log(err);
    res.json({
      code: 500,
      message: SERVER_ERR_MSG
    });
  }
}

async function regist(req, res) {
  try {
    var member = {
      id: req.body.id,
      pw: req.body.pw
    };
    var rs = await _member.insertMember(member);
    res.json({
      code: rs.code,
      message: rs.message,
      data: rs.data
    });
  } catch (err) {
    console.log(err);
    res.json({
      code: 500,
      message: SERVER_ERR_MSG
    });
  }
}

module.exports = router;
