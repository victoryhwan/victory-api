var mysql_dbc = require("../../config/db_con")();
var connection = mysql_dbc.init();
var express = require("express");
var router = express.Router();
var async = require("async");
// const winston   = require('../../config/winston');
var SERVER_ERR_MSG = "Server Error";
const _member = require("./mng/common");
const _util = require("../util/auth");

/* dddd */

/* 로그인 */
router.post("/login", async (req, res) => {
  await login(req, res);
});

/* 회원가입여부 체크 */
router.post("/check", async (req, res) => {
  await check(req, res);
});

/* 데이터 확인용 */
router.get("/list", async (req, res) => {
  // await _util.apiAuth(req, res);
  getMemberList(req, res);
});

/* 회원등록 */
router.post("/regist", async (req, res) => {
  await regist(req, res);
});

/* 회원삭제 (개발용) */
router.delete("/delete", async (req, res) => {
  await del(req, res);
});

async function login(req, res) {
  try {
    var member = {
      id: req.body.id,
      pw: req.body.pw
    };

    var resultCode = 500;
    var resultMsg = SERVER_ERR_MSG;
    var resultData = null;

    var rs = await _member.loginMember(member);
    resultCode = rs.code;
    resultMsg = rs.message;

    if (rs.code == 200) {
      var selectMember = await _member.selectMember(member);
      resultData = selectMember.data;
    }
  } catch (err) {
    console.log(err);
    resultCode = 500;
    resultMsg = SERVER_ERR_MSG;
  } finally {
    res.json({
      code: resultCode,
      message: resultMsg,
      data: resultData,

      info: `${JSON.stringify(req.headers)}`
    });
  }
}

async function check(req, res) {
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
      id: req.body.id
    };

    var resultCode = 500;
    var resultMsg = SERVER_ERR_MSG;
    var resultData = null;

    var selectMember = await _member.selectMember(member);
    if (selectMember.code == 200) {
      resultCode = 201;
      resultMsg = `Fail, exist ID`;
    } else {
      var rs = await _member.insertMember(member);
      resultCode = rs.code;
      resultMsg = rs.message;
    }
  } catch (err) {
    console.log(err);
    resultCode = 500;
    resultMsg = SERVER_ERR_MSG;
  } finally {
    res.json({
      code: resultCode,
      message: resultMsg
    });
  }
}

async function del(req, res) {
  try {
    var member = {
      id: req.body.id
    };

    var resultCode = 500;
    var resultMsg = SERVER_ERR_MSG;
    var resultData = null;

    var selectMember = await _member.selectMember(member);
    if (selectMember.code != 200) {
      resultCode = 201;
      resultMsg = `Fail, not exist ID`;
    } else {
      var rs = await _member.deleteMember(member);
      resultCode = rs.code;
      resultMsg = rs.message;
    }
  } catch (err) {
    console.log(err);
    resultCode = 500;
    resultMsg = SERVER_ERR_MSG;
  } finally {
    res.json({
      code: resultCode,
      message: resultMsg
    });
  }
}

// async function

module.exports = router;
