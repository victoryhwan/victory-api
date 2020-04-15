var mysql_dbc = require("../../../config/db_con")();
var connection = mysql_dbc.init();
var express = require("express");
var router = express.Router();
var async = require("async");
// const winston   = require('../../config/winston');
var SERVER_ERR_MSG = "Server Error";

router.selectMemberList = async () => {
  return new Promise(resolve => {
    var sql = `SELECT tm.id
                      , tm.pw
                      , DATE_FORMAT(tm.reg_date, '%Y-%c-%e %H:%i:%s') AS reg_date
                      , DATE_FORMAT(tm.update_date, '%Y-%c-%e %H:%i:%s') AS update_date
                      FROM tmember tm 
                  WHERE 1=1 
                  LIMIT 5`;
    connection.query(sql, [], (err, result) => {
      if (err) {
        return resolve({ code: 500, message: "Fail" });
      } else {
        return resolve({ code: 200, message: "Success", data: result });
      }
    });
  });
};

router.selectMember = async member => {
  return new Promise(resolve => {
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
        return resolve({ code: 500, message: "Fail" });
      } else {
        if (result.length > 0) {
          //로그인성공
          return resolve({ code: 200, message: "로그인 성공", data: result });
        } else {
          return resolve({ code: 201, message: "로그인 실패", data: result });
        }
      }
    });
  });
};

router.insertMember = async member => {
  return new Promise(resolve => {
    var sql = `INSERT INTO tmember (id, pw, reg_date, update_date) 
                                  VALUES (?, ?, NOW(), NOW())`;
    connection.query(sql, [member.id, member.pw], (err, result) => {
      if (err) {
        return resolve({ code: 500, message: "Fail" });
      } else {
        return resolve({ code: 200, message: "Success" });
      }
    });
  });
};

module.exports = router;
