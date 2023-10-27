require("dotenv").config(); // Get env vars

const dbgmsg = require("./other/dbgmsg.js");

const express = require("express");

const app = express(); // Define the express app

app.set("view engine", "ejs"); // Set ejs as templating engine

app.use(express.json()); // Use express's engine to handle json payloads in posts

app.use(express.urlencoded({extended:true})); // Use express's URL encoded data handling engine

app.use(express.static('public')); // Serve static files fm public directory. Served before route resolution

// app.use(cors());

const stdport = 3000; // HTTP port

/////////////////////

// VIEWS

/////////////////////

// Index

app.get("/", (req, res) => {

	dbgmsg.log("Page GET: index.");

	res.render("pages/index");

})

///////////////////////

// INTERFACES

///////////////////////

const pathAPI = "/i";

// Ping

const apiPing = require("./api/ping.js");

app.get(`${pathAPI}/ping`, (req, res) => {

	dbgmsg.log("API GET: ping.");

	apiPing.get(req, res);

})

// DB Test

const apiTestDB = require("./api/testdb.js");

app.get(`${pathAPI}/testdb`, (req, res) => {

	dbgmsg.log("API GET: testdb.");

	apiTestDB.get(req, res);

})

/*app.post(`${pathAPI}/test`, (req, res) => {

	dbgmsg.log("API POST: test.");

	apiTest.post(req, res);

})*/

/////////////////////

// STARTUP

/////////////////////

app.listen(stdport, () => {

	console.log(`Listening on port ${stdport}.`);

});