var mysql_dbc   = require('../../config/db_con')();
var connection  = mysql_dbc.init();
var express     = require('express');
var router      = express.Router();
var async       = require('async');
// const winston   = require('../../config/winston');

router.get('/getMemberList', async function (req, res) {
    console.log("@@@@@@");
    var rs = await getMemberList(req, res);
    if(rs.code == 200){
        res.json({
            code:200,
            data:rs.data
        });
    }else{
        res.json({
            code:200,
            message:`fail`
        });
    }
});

async function getMemberList(req, res){
    return new Promise(resolve => {
        var sql = `SELECT tm.* FROM tmember tm where 1=1 LIMIT 5`
        connection.query(sql, [], (err, result)=>{
            if(err){
                return resolve({code:500});
            }else{
                return resolve({code:200, data:result});
            }
        })
    });
}


module.exports = router;