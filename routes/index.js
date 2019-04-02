var express = require('express');
var router = express.Router();
const fs = require('fs');
var trackedClasses; 
/* GET home page. */
router.get('/', function(req, res, next) {
 	res.render('index', { title: 'Express' });
});

/* GET tracked class list */
router.get('/tracked', function(req, res, next) {
	readJSON();
	var classList = "<table>";
	var dltBtn = "<input type='button' value='Remove'>"
	for(var key in trackedClasses){
		console.log(trackedClasses[key].cname);
		classList += "<tr><td>" + trackedClasses[key].cname + "</td><td>" +  trackedClasses[key].classID + "</td><td>" + dltBtn + "</tr>";
	}
	classList += "</table>"
  	res.render('index', { title: 'Express', classList: classList});
});
function readJSON(){
	fs.readFile('trackedClasses.json', (err, data) => {  
	    if (err) throw err;
	    trackedClasses = JSON.parse(data);
	    console.log(trackedClasses);
	});
}
module.exports = router;
