
// CONFIG
var express = require('express');
var app = express();
var port = 91;
var path = 'C:/dd/underpost.net/src/node/src/template/src';
var client_path = 'C:/dd/deploy_area/client';
var static_path = '/static';
var charset = 'utf8';
var fs = require('fs');
var var_dump = require('var_dump');
var bodyParser = require('body-parser');
app.use(bodyParser.urlencoded({extended: false}));
app.use(bodyParser.json());

// LIB
eval(fs.readFileSync('c:/dd/underpost.net/src/node/lib/util.js', charset));
var util = fs.readFileSync('c:/dd/underpost.net/src/node/lib/util.js', charset);
var vanillajs = fs.readFileSync((client_path+'/vanilla.js'), charset);
var ws_client = fs.readFileSync((client_path+'/websocket.js'), charset);

// STATIC
app.use(express.static(static_path));
app.use(static_path, express.static((path+static_path)));

// VIEW
eval(fs.readFileSync((path+'/api/view.js'), charset));
view('/', 'home');

// API
eval(fs.readFileSync((path+'/api/test.js'), charset));

// INIT SERVER
app.listen(port, () => {
  console.log('server on port -> '+port);
});
