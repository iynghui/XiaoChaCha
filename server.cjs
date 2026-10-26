const http = require('node:http');
const fs = require('node:fs');
const path = require('node:path');
const root=__dirname,port=Number(process.env.PORT)||4173;
const mime={'.html':'text/html; charset=utf-8','.css':'text/css; charset=utf-8','.js':'text/javascript; charset=utf-8','.json':'application/json; charset=utf-8','.svg':'image/svg+xml'};
const allowed=new Set(['index.html','style.css','app.js','data.json','icon.svg']);
const server=http.createServer((req,res)=>{let name;try{name=decodeURIComponent(new URL(req.url,'http://localhost').pathname).replace(/^\//,'')||'index.html';}catch{res.writeHead(400);res.end('Bad request');return;}if(!allowed.has(name)){res.writeHead(404);res.end('Not found');return;}fs.readFile(path.join(root,name),(err,body)=>{if(err){res.writeHead(500);res.end('Unable to read asset');return;}res.writeHead(200,{'Content-Type':mime[path.extname(name)]||'text/plain','Cache-Control':'no-cache','X-Content-Type-Options':'nosniff'});res.end(req.method==='HEAD'?undefined:body);});});
server.listen(port,'127.0.0.1',()=>console.log(`Local: http://localhost:${port}`));
server.on('error',e=>{console.error(e.message);process.exitCode=1;});
