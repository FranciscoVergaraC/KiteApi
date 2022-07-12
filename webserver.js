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

let countryAndCode = countries.map(country => {
  let countryAndCode = {"country": country.countryName, "code": country.countryShortCode};
  return countryAndCode
});

/*Middleware test, aca podria ir haciendo llamadas a un dashboard para medir analiticas de solicitudes
app.use((req, res, next) => {
  console.log(`${req.method} Request received to ${req.url}`);
  next();
});*/

/* Obtener ciudades de un pais */

let getCities = (countryCode) => {
  let cities = countries.filter(country => country.countryShortCode === countryCode);
  return cities[0].regions;
}

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