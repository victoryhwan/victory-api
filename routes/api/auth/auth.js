var mysql_dbc   = require('../../config/db_con')();
var connection  = mysql_dbc.init();
var express     = require('express');
var router      = express.Router();
var async       = require('async');
// const winston   = require('../../config/winston');

router.post('/login', async function (req, res) {
    var {
        id,
        password
    } = req.body;

    console.log(`[login] - 로그인 Param ::: Login ID:${id}, PW:${password}`);

    try{
        var params = [id, password];
        var rs = await selectAdmin(params);
        if(rs.data.length == 1){
            console.log("로그인 성공");
            res.json({
                code:200,
                message:'로그인 성공'
            });
        }else{
            console.log("아이디와 비밀번호를 확인해 주세요.");
            res.json({
                code:201,
                message:'아이디와 비밀번호를 확인해 주세요.'
            });
        }
    }catch(err){
        console.log(err);
        res.json({
            code:500,
            message:'Server Error'
        });
    }
});

router.put('/insertMember', async function (req, res) {
    try{
        var member = {
            id : req.body.id,
            pw : req.body.pw
        }
        var rs = await insertMember(member);
        res.json({
            code:rs.code,
            message:rs.message,
            data:rs.data
        });
    }catch(err){
        console.log(err);
        res.json({
            code:500,
            message:'Server Error'
        });
    }
});

router.post('/getMember', async function (req, res) {
    try{
        var member = {
            id : req.body.id,
            pw : req.body.pw
        }
        var rs = await selectMember(member);
        res.json({
            code:rs.code,
            message:rs.message,
            data:rs.data
        });
    }catch(err){
        console.log(err);
        res.json({
            code:500,
            message:'Server Error'
        });
    }
});

async function selectAdmin(params){
    return new Promise(function (resolve, reject){
        var sql = `SELECT tm.id
                        , tm.pw
                        , DATE_FORMAT(tm.reg_date, '%Y-%c-%e %H:%i:%s') AS reg_date
                        , DATE_FORMAT(tm.update_date, '%Y-%c-%e %H:%i:%s') AS update_date
                     FROM tadmin tm 
                    WHERE tm.id = ?
                      AND tm.pw = ?`
        connection.query(sql, params, (err, result)=>{
            if(err){
                return reject({code:500, message:'Fail'});
            }else{
                return resolve({code:200, message:'Success', data:result});
            }
        })
    });
}

async function selectMember(member){
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
        connection.query(sql, [member.id, member.pw], (err, result)=>{
            if(err){
                return resolve({code:500, message:'Fail'});
            }else{
                if(result.length > 0){//로그인성공
                    return resolve({code:200, message:'로그인 성공', data:result});
                }else{
                    return resolve({code:200, message:'로그인 실패', data:result});
                }
            }
        })
    });
}

async function insertMember(member){
    return new Promise(resolve => {
        var sql = `INSERT INTO tmember (id, pw, reg_date, update_date) 
                                VALUES (?, ?, NOW(), NOW())`
        connection.query(sql, [member.id, member.pw], (err, result)=>{
            if(err){
                return resolve({code:500, message:'Fail'});
            }else{
                return resolve({code:200, message:'Success'});
            }
        })
    });
}


module.exports = router;