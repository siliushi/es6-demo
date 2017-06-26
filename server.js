/**
 * 描述: 静态服务
 * 时间：2016年12月
 */
const ip = process.argv.splice(3).toString();
const portEnv = process.argv.splice(2).toString();
const 
	path = require("path"),
	express = require('express'),
	compress = require('compression'),
	app = express(),
	fs = require('fs'),
	ejs = require('ejs'),
	config = JSON.parse(fs.readFileSync('package.json', 'utf8')),
	projectName = config.projectName,
	port = portEnv|| process.env.PORT || '9091',
	serverIP = ip || '0.0.0.0';
// GZIP压缩
app.use(compress());
app.set('views', path.join(__dirname, "views"));
app.set('view engine', 'ejs');
app.engine('.html', ejs.__express);
app.use('/', express.static(__dirname));

app.get('/', function(req, res, next) {
	res.render("index.html");
});

app.listen(port, serverIP, function() {
	console.log('static server running at ' + serverIP + ':' + port);
});
