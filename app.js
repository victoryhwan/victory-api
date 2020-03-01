require('dotenv').config()
const express = require('express')
const app = express()
const http = require('http')
const port = process.env.PORT || 3031

// app.get('/', (req, res) => res.send('Hello World!'))

app.set('port', process.env.PORT || 3031);

// app.listen(port, ()=> winston.info(`Listening on port ${port}...`));

http.createServer(app).listen(app.get('port'), function(){
//   winston.info(`Listening on port ${app.get('port')}...`)
  console.log('Express server listening on port ' + app.get('port'));
});



app.get('/', (req, res) => res.send('Hello World! zzzzdddd'))

