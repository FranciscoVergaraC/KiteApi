// status, quede viendo como implementar CORS aca: https://www.youtube.com/watch?v=woXBXJgGQvQ
// No estoy logrando que responda, desde la web que conecta, probar con Postman? 
// Se instalo CORS via NPM https://www.npmjs.com/package/cors
// Import the express library here
const express = require('express');
// Instantiate the app nodehere
const app = express();

const cors = require('cors'); //Import cors library, para poder hacer pruebas en DEV
const bodyParser = require('body-parser'); // Permite parsear el body de una peticion, necesita instalacion via NPM https://www.npmjs.com/package/body-parser
const countries = require('./countries.js'); // Importamos el archivo countries.js

app.use(cors()); /* NEW */
app.use(bodyParser.json()); // Uso de body parser

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

/*Middleware test, aca podria ir haciendo llamadas a un dashboard para medir analiticas de solicitudes*/
app.use((req, res, next) => {
  console.log(`${req.method} Request received to ${req.url}`);
  next();
});

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