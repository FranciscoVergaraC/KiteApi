const sqlite3 = require('sqlite3').verbose(); // Importamos sqlite para trabajar con la base de datos. Ojo que hay que instalar via NPM sqlite3 https://www.npmjs.com/package/sqlite3
const db = new sqlite3.Database('./kiteApiDB.db', (err) => {
  if (err){
    console.log(err.message)
    throw err
  } else {
    console.log('Connected to the database');
  }
}); // creamos la conexion con la base de datos de la DB


module.exports = db