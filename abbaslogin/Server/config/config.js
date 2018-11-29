var path = require('path')
var rootPath = path.resolve(__dirname + '../../..')

module.exports = {
  development: {
    port: 3005,
    root: rootPath,
    db:{
       host     : 'localhost',
       port:3306,
       user     : 'root',
       password : 'password',
       database : 'sys',
       requestTimeout: 30000
     }
   
   }
 }
