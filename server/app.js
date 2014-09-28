var express = require('express');
var app = express();
var bodyParser = require('body-parser'); //bodyparser + json + urlencoder
var morgan  = require('morgan'); // logger
var db = require('./configs/database');

var multipart = require('connect-multiparty');
var multipartMiddleware = multipart();

//Configuration
app.set('port', 3014);
app.set('origin', 'http://localhost');


app.listen(app.get('port'));
app.use(bodyParser());
app.use(morgan());

app.all('*', function(req, res, next) {
	res.set('Access-Control-Allow-Origin', app.get('origin'));
	res.set('Access-Control-Allow-Credentials', true);
	res.set('Access-Control-Allow-Methods', 'GET, POST, DELETE, PUT');
	res.set('Access-Control-Allow-Headers', 'X-Requested-With, Content-Type');
	if ('OPTIONS' == req.method) return res.send(200);
	next();
});

//Routes
var routes = {};
routes.circles = require('./routes/circles.js');
routes.photos = require('./routes/photos.js');


//Routing URLs
app.get('/circles', routes.circles.getCircles); //Require authentication
app.get('/circles/:id', routes.circles.getCircle); //Require authentication
app.post('/circles', routes.circles.createCircle); //Require authentication
app.delete('/circles/:id', routes.circles.deleteCircle); //Require authentication
app.put('/circles/:id', routes.circles.editCircle); //Require authentication


app.put('/photos/:id', routes.photos.updatePhoto); //Require authentication
app.put('/photos/:id/circles', routes.photos.updateCircles); //Require authentication
app.delete('/photos/:id', routes.photos.deletePhoto); //Require authentication
app.get('/photos/all/offsets/:offset', routes.photos.getAllPhotos); //Require authentication

app.get('/photos/offsets/:offset', routes.photos.getPublicPhotos);
app.get('/photos/:circleKey/offsets/:offset', routes.photos.getPhotosByCircleKey);

app.post('/photos', multipartMiddleware, routes.photos.uploadPhotos); //Require authentication

console.log('[INFO] Circlr API started on port ' + app.get('port'));