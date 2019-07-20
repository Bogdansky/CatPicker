import http from 'http'
import { NOTFOUND } from 'dns';

let server = http.createServer(listener);
let port = process.PORT || 3000;

const handlers = {
    "/read": "",
    "/read-all": "",
    "/pick": ""
}

server.listen(port, () => {
    console.log(`server is executing on ${port} port`);
})

let listener = (req, res) => {
    parseBodyJson(req, (err, payload) => {
        const handler = getHandler(req.url);
        handler(req, res, (err, result) => {
            res.setHeader('Content-Type', 'application/json');
            if (err){
                res.statusCode = err.code;
                res.end(JSON.stringify(err));

                return;
            }

            res.statusCode = result.code;
            res.end(JSON.stringify(result));
        })
    }
)}

function getHandler(url){
    return handlers[url].split('?')[0] || NOTFOUND;
}

function parseBodyJson(req, cb) {
    let body = [];
  
    req.on('data', function(chunk) {
      body.push(chunk);
    }).on('end', function() {
      body = Buffer.concat(body).toString();
  
      let params = JSON.parse(body);
  
      cb(null, params);
    });
  }