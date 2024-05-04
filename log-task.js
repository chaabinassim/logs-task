const http = require('http');
const fs = require('fs');
const _ = require('lodash')

const server = http.createServer((req,res)=>{
    console.log("request made");
    const num = _.random(0,20);
    console.log(num);
    res.setHeader('Content-Type','text/html');
    let path = './templates/'
    switch(req.url){
        case '/':
            path += 'home.html';
            break;
        case '/about':
            path += 'about.html';
            break;
        default:
            path += '404.html';

    }
    fs.readFile(path,(err,data)=>{
        if(err){
            console.log(err)
            res.end();
        }else{
            res.write(data);
            res.end();
        }

    })
    
})

server.listen(3000,'localhost',()=>{
    console.log("listing on port 3000")
})