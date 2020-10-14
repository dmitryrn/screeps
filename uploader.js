require('dotenv').config()

const assert = require('assert')

assert.ok(process.env.SCREEPS_EMAIL)
assert.ok(process.env.SCREEPS_PASSWORD)

const path = require('path')
const fs = require('fs')

const mainjs = fs.readFileSync(path.resolve('.', 'dist', 'main.js')).toString()

var https = require('https');

var email = process.env.SCREEPS_EMAIL,
    password = process.env.SCREEPS_PASSWORD,
    data = {
        branch: 'default',         
        modules: {
            main: mainjs,
        }
    };

var req = https.request({
    hostname: 'screeps.com',
    port: 443,
    path: '/api/user/code',
    method: 'POST',
    auth: email + ':' + password,
    headers: {
        'Content-Type': 'application/json; charset=utf-8'
    }
});

req.write(JSON.stringify(data));
req.end();