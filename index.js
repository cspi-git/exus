"use strict";

// Dependencies
const { runJobs } = require("parallel-park")
const commander = require("commander")
const fs = require("fs")

// Variables
const services = fs.readdirSync("./services").map((service)=> service.replace(".js", ""))
const args = process.argv.slice(2)

// Main
if(!args.length) return console.log("usage: node index.js <service> --help")
if(services.indexOf(args[0]) === -1) return console.log("Invalid service.")

const program = new commander.Command()

require(`./services/${args[0]}.js`)(args.slice(1), program)