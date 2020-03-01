require('dotenv').config()
const express = require('express')
const app = express()
const http = require('http')
var cors = require('cors');


app.set('port', process.env.PORT || 3031);

// app.listen(port, ()=> winston.info(`Listening on port ${port}...`));

http.createServer(app).listen(app.get('port'), function(){
//   winston.info(`Listening on port ${app.get('port')}...`)
  console.log('Express server listening on port ' + app.get('port'));
});

var allowCORS = function(req, res, next) {
  res.header('Acess-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Methods', 'GET, PUT, POST, DELETE, OPTIONS');
  res.header('Access-Control-Allow-Headers', 'Origin, Accecpt, Content-Type, Access-Control-Allow-Origin, Authorization, X-Requested-With, Access-Control-Request-Method, Access-Control-Request-Headers');
  res.header('Access-Control-Allow-Credentials', true);
  next();
};

app.use(allowCORS);
app.use(cors())
app.set('trust proxy', 1) // trust first proxy

app.get('/', (req, res) => res.send('Hello World! zzzzdddd'))
app.use('/api/member', require('./routes/api/member/member'));


