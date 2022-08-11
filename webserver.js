// status, quede viendo como implementar CORS aca: https://www.youtube.com/watch?v=woXBXJgGQvQ
// No estoy logrando que responda, desde la web que conecta, probar con Postman? 
// Se instalo CORS via NPM https://www.npmjs.com/package/cors
// Import the express library here
const express = require('express');
// Instantiate the app nodehere
const app = express();

const morgan = require('morgan'); /*Usamos morgan como middleware para registrar las solicitudes.  */
morgan.token('body', req => JSON.stringify(req.body));

const { printQueryResults } = require('./utils');
const cors = require('cors'); //Import cors library, para poder hacer pruebas en DEV
const bodyParser = require('body-parser'); // Permite parsear el body de una peticion, necesita instalacion via NPM https://www.npmjs.com/package/body-parser
const countries = require('./countries.js'); // Importamos el archivo countries.js
const geoDb = require('./countries+states+cities.js') // Nueva DB
var db = require("./database.js")

/* --> Esta funcion me permite crear un registro en la DB, ya esta probada y funcional , para que se pueda usar en el futuro.
db.run("INSERT INTO spot (id, name, countryCode) VALUES ('2', 'Desembocadura', 'CL');");
*/
/*
db.all("SELECT * FROM spot", (error, rows) => {
  printQueryResults(rows);
});
*/

app.use(cors()); /* NEW */
app.use(bodyParser.json()); // Uso de body parser
app.use(morgan('dev')); // Usamos morgan como middleware para registrar las solicitudes.

const PORT = process.env.PORT || 4001;
const allowedOrigins = ['http://localhost:4001'];

// Invoke the app's `.listen()` method below:
app.listen(PORT, () =>{
  console.log(`The server is listening on ${PORT}`);
});

let countryAndCode = geoDb.map(country => {
  let countryAndCode = {"country": country.name, "code": country.id};
  return countryAndCode
}); /*Probado y funcional */


/*Middleware test, aca podria ir haciendo llamadas a un dashboard para medir analiticas de solicitudes
app.use((req, res, next) => {
  console.log(`${req.method} Request received to ${req.url}`);
  next();
});*/

/* Obtener ciudades de un pais */

let getCities = (countryCode) => {
  let cities = countries.filter(country => country.countryShortCode === countryCode);
  return cities[0].regions;
} /*Esta funcion esta deprecada, se deberia eliminar, hay que reemplazar el codigo de getCities por getRegions */

let getRegions = (countryCode) => {
  let states = geoDb.filter(country => country.id == countryCode);
  return states[0].states;
} /*Funcional */


//req es el objeto solicitado al servidor
//res es el objeto que se envía al cliente

app.get('/countries', cors(allowedOrigins), (req,res, next) =>{
  res.send(countryAndCode);
});

app.get('/:code/cities', cors(allowedOrigins), (req,res, next) =>{
  res.send(getCities(req.params.code))
});

app.get('/spot', (req, res, next) => {
  var sql = "select * from spot"
  var params = []
  db.all(sql, params, (err, rows) => {
      if (err) {
        res.status(400).json({"error":err.message});
        return;
      }
      res.json({
        "rows": rows
      })
    });
});

/*La funcionalidad POST ya esta probada en DB, ahora hay que agregar los parametros adicionales*/

app.post('/spotEdit', cors(allowedOrigins), (req, res, next) => {
  var sql = `UPDATE spot SET name = "${req.body.name}", countryCode = "${req.body.countryCode}", regionCode= "${req.body.regionCode}", windDirection= "${req.body.windDirection}"  WHERE id = ${req.body.id}`
  console.log(sql)
  db.run(sql, function(err, result) {
    if (err) {
      res.status(400).json({"error":err.message});
      return;
    }
    res.json({
      "message": "success",
      "id": this.lastID
    })
  })
});

app.post('/newspot', cors(allowedOrigins), (req, res, next) => {
  var sql = `INSERT INTO spot (name, countryCode, regionCode, windDirection) VALUES ("${req.body.name}", "${req.body.countryCode}", "${req.body.regionCode}", "${req.body.windDirection}")`
  console.log(sql)
  db.run(sql, function(err, result) {
    if (err) {
      res.status(400).json({"error":err.message});
      return;
    }
    res.json({
      "message": "success",
      "id": this.lastID
    })
  })
})

app.post('/deletespot', cors(allowedOrigins), (req, res, next) => {
  var sql = `DELETE FROM spot WHERE id = ${req.body.id}`
  console.log(sql)
  db.run(sql, function(err, result) {
    if (err) {
      res.status(400).json({"error":err.message});
      return;
    }
    res.json({
      "message": "success",
      "id": this.lastID
    })
  })
})

/*
app.post('/route', cors(allowedOrigins) , (req, res, next) => {
  console.log(req.body.user);
  if (req.body.user === 'francisco' && req.body.password === '123') {
    res.send({ success: true});
  } else {
    res.send({ success: false});
  }
});
*/
// test