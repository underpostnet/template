//------------------------------------------------------------------------------
//
//      Ywork NodeJS Express Server
//
//      Developed By Francisco Verdugo <fcoverdugoa@underpost.net>
//      https://github.com/underpostnet/express-ywork
//
//------------------------------------------------------------------------------

let fs = require('fs');
var charset = 'utf8';
var data = JSON.parse(fs.readFileSync('C:/dd/global_data/json/template/template.json', charset));
var microdata = JSON.parse(fs.readFileSync(data.dataPath+'microdata.json', charset));
eval(fs.readFileSync(data.underpostClientPath+'util.js', charset));
var dev = process.argv.slice(2)[0]=='d' ? true: false;
dev ? (data.url = 'http://'+data.http_host_dev+':'+data.http_port):null;
var serverToken = getHash();
var usersToken = [];

var loadUnderpostMod = (name, type) =>{return fs.readFileSync(data.underpostServerPath+type+'/'+name, charset)};
var UnderpostMods = JSON.parse(fs.readFileSync(data.dataPath+'underpostMods.json', charset));
for(let mod of UnderpostMods.server){
  console.log('Load server module -> '+mod);
  eval(loadUnderpostMod(mod, 'server'));
}

var loadServerMod = (name) =>{return fs.readFileSync(data.serverPath+name, charset)};
var ServerMods = JSON.parse(fs.readFileSync(data.dataPath+'serverMods.json', charset));
for(let mod of ServerMods){
  console.log('Load server module -> '+mod);
  eval(loadServerMod(mod));
}

app.listen(data.http_port, () => {
  console.log('argv', process.argv);
  log('progress', 'yWork v1.5');
  log('info', 'set server token -> '+serverToken);
  let mode = dev ? 'DEV MODE' : 'PROD MODE';
  log('warn','HTTP '+mode+' SERVER ONLINE -> PORT:'+data.http_port);
});

//------------------------------------------------------------------------------
//------------------------------------------------------------------------------
