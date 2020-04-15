var mysql_dbc = require("../../config/db_con")();
var connection = mysql_dbc.init();
var express = require("express");
var router = express.Router();
var async = require("async");
// const winston   = require('../../config/winston');

router.get("/getAdminList", (req, res) => {
  getAdminList(req, res);
});

router.post("/registAdmin", function(req, res) {
  console.log("registAdmin");
  registAdmin(req, res);
});

router.post("/modifyAdmin", function(req, res) {
  modifyAdmin(req, res);
});

async function getAdminList(req, res) {
  try {
    var { offset, limit } = req.query;
    var params = [parseInt(offset), parseInt(limit)];
    var cnt = await selectAdminCnt(params);
    var rs = await selectAdminList(params);

    console.log("조회성공");
    res.json({
      code: 200,
      total: cnt.data,
      rows: rs.data
    });
  } catch (err) {
    console.log(err);
    res.json({
      code: 500,
      message: "Server Error"
    });
  }
}

async function registAdmin(req, res) {
  try {
    var { id } = req.body;
    console.log(`registAdmin id : ${id}`);
    var admin = {
      id: req.body.id,
      pw: req.body.pw,
      name: req.body.name,
      phone: req.body.phone,
      department: req.body.department,
      level: req.body.level
    };
    console.log(req.body);
    var rs = await insertAdmin(admin);
    res.json({
      code: 200,
      message: rs.message,
      data: rs.data
      //
    });
  } catch (err) {
    // console.log(err);
    res.json({
      code: 500,
      message: "어드민 등록에 실패하였습니다."
    });
  }
}

async function modifyAdmin(req, res) {
  try {
    var admin = {
      id: req.body.id,
      pw: req.body.pw,
      name: req.body.name,
      phone: req.body.phone,
      departmet: req.body.departmet,
      level: req.body.level
    };
    var rs = await insertAdmin(admin);
    res.json({
      code: rs.code,
      message: rs.message,
      data: rs.data
    });
  } catch (err) {
    console.log(err);
    res.json({
      code: 500,
      message: "Server Error"
    });
  }
}

async function selectAdminCnt(params) {
  return new Promise(function(resolve, reject) {
    var sql = `SELECT COUNT(1) AS cnt
                     FROM tadmin tm 
                    WHERE 1=1 
                    LIMIT ? ,?`;
    connection.query(sql, params, (err, result) => {
      if (err) {
        return reject({ code: 500, message: "Fail" });
      } else {
        return resolve({ code: 200, message: "Success", data: result[0].cnt });
      }
    });
  });
}

async function selectAdminList(params) {
  return new Promise(function(resolve, reject) {
    var sql = `SELECT tm.idx
                        , tm.id
                        , tm.pw
                        , tm.name
                        , tm.phone
                        , tm.department
                        , tm.level
                        , DATE_FORMAT(tm.reg_date, '%Y-%c-%e %H:%i:%s') AS reg_date
                        , DATE_FORMAT(tm.update_date, '%Y-%c-%e %H:%i:%s') AS update_date
                     FROM tadmin tm 
                    WHERE 1=1 
                    LIMIT ? ,?`;
    connection.query(sql, params, (err, result) => {
      if (err) {
        return reject({ code: 500, message: "Fail" });
      } else {
        return resolve({ code: 200, message: "Success", data: result });
      }
    });
  });
}

async function selectMember(member) {
  return new Promise(function(resolve, reject) {
    var sql = `SELECT tm.id
                        , tm.pw
                        , DATE_FORMAT(tm.reg_date, '%Y-%c-%e %H:%i:%s') AS reg_date
                        , DATE_FORMAT(tm.update_date, '%Y-%c-%e %H:%i:%s') AS update_date 
                     FROM tmember tm 
                    WHERE 1=1 
                      AND tm.id = ?
                      AND tm.pw = ?
                    LIMIT 1`;
    connection.query(sql, [member.id, member.pw], (err, result) => {
      if (err) {
        return reject({ code: 500, message: "Fail" });
      } else {
        if (result.length > 0) {
          //로그인성공
          return resolve({ code: 200, message: "로그인 성공", data: result });
        } else {
          return resolve({ code: 200, message: "로그인 실패", data: result });
        }
      }
    });
  });
}

async function insertAdmin(member) {
  return new Promise(function(resolve, reject) {
    var sql = `INSERT INTO tadmin (id, pw, name, phone, department, level, reg_date, update_date) 
                                VALUES (?, ?, ?, ?, ?, ?, NOW(), NOW())`;
    connection.query(
      sql,
      [
        member.id,
        member.pw,
        member.name,
        member.phone,
        member.department,
        member.level
      ],
      (err, result) => {
        if (err) {
          return reject({ code: 500, message: err });
        } else {
          return resolve({ code: 200, message: "Success" });
        }
      }
    );
  });
}

module.exports = router;
