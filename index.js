require("dotenv").config();

const express = require("express");

const app = express();
const http = require("http").Server(app);
const io = require("socket.io")(http, {
	cors: {
		origins: ["localhost:8080"],
	},
});

const consign = require("consign");
const db = require("./config/db");

app.db = db;

consign()
	.include("./config/passport.js")
	.then("./config/middlewares.js")
	.then("./api/validation.js")
	.then("./api")
	.then("./config/routes.js")
	.into(app);

io.on("connection", function (socket) {
	socket.on("creator-data", async function (data) {
		const a = await app.db("item_apoio").select("*");
		io.emit("updated-stats", a);
	});
});

app.set("port", process.env.PORT || 3000);
http.listen(app.get("port"), () => {
	console.log("Server is running in port ==3000== ...");
});
