var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
	


/*****************************************
 * NOTIFICATION SYSTEM, WORK IN PROGRESS
 *****************************************/
// var nodemailer = require('nodemailer');
// 	//classEnroll = '';
// var mailOptions
// var transport = {
//   service: 'gmail',
//   auth: {
//     user: 'haordoxingbuxing@gmail.com',
//     pass: 'fa6f48b9d5'
//   }
// };
// var transporter = nodemailer.createTransport(transport);
// function sendMail(input){
// 	mailOptions = {
// 	  from: 'haordoxingbuxing@gmail.com',
// 	  to: 'yosonodio@gmail.com',
// 	  subject: ' Class Registered!',
// 	  text: `You have been enrolled for ${input}`
// 	};
// 	transporter.sendMail(mailOptions, function(error, info){
// 			if (error) {
// 				console.log(error);
// 			} else {
// 			console.log('Email sent: ' + info.response);
// 			}
// 	});
// }

/*****************************************
 * MODIFY THE FOLLOWING VARS
 *****************************************/

//Link to shopping cart for specified term
//Current Link is Fall 2019
var termLink = 'https://hrsa.cunyfirst.cuny.edu/psc/cnyhcprd/EMPLOYEE/HRMS/c/SA_LEARNER_SERVICES_2.SSR_SSENRL_CART.GBL?Page=SSR_SSENRL_CART&Action=A&ACAD_CAREER=UGRD&EMPLID=23177617&INSTITUTION=QNS01&STRM=1199&TargetFrameName=None';
//Enter First.Last## Here
var userName = '';
//Enter Password Here
var pass = '';

/*****************************************
* ONLY MODIFY NIGHTMARE INSTANCE BELOW
******************************************/

var indexRouter = require('./routes/index');
var app = express();
var classEnroll = 'none';

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', indexRouter);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

function classStatus (){
const Nightmare = require('nightmare')
//Window Settings
//Modify x & y for positioning
const nightmare = new Nightmare({ show: true, alwaysOnTop: false, x: 270, y: 100, frame: false, height: 200, width: 350, typeInterval: 20, waitTimeout: 5000});
	setTimeout(function (){
	nightmare
	  .goto('https://home.cunyfirst.cuny.edu')
	  .type('#CUNYfirstUsernameH', userName)
	  .type('#CUNYfirstPassword', pass)
	  .click('#submit')
	  .wait('#ptpgltlbl_CU_CUNYFIRST_NOTICES_HMPG')
	  .goto(termLink)
	  .wait('#win0divDERIVED_REGFRM1_GROUP6GP')
	  .evaluate(() => {
		  	//while(classEnroll.length == 0){
		  		var table = document.getElementById('SSR_REGFORM_VW$scroll$0');
		  		var classNum = document.getElementById('SSR_REGFORM_VW$scroll$0').getElementsByClassName('PSLEVEL3GRIDWBO');
		  		var classArr = new Array;
		  		var classItm = new Array;
		  		var temp = '';
		  		classEnroll = 'none';
				for (var i = 2; i < table.rows.length; i++) {
				   var status = table.rows[i].cells[6].getElementsByTagName('img')[0].alt;
				   var classNo = table.rows[i].cells[1].getElementsByTagName('a')[0].innerHTML;
				   var select = table.rows[i].cells[0].getElementsByClassName('PSCHECKBOX')[0];
				   temp = classNo.split('<br>\n ');
				   if(status == 'Open'){
				   		classEnroll = [temp[0],temp[1].replace(/[()]/g,""), status];
				   		table.rows[i].cells[0].getElementsByClassName('PSCHECKBOX')[0].click();
				   }
				   classArr.push([temp[0],temp[1].replace(/[()]/g,""), status]);
				}
		  		return classEnroll; 
		})
	//  .then(function(ret){if (classEnroll != 'none')sendMail(value)})
	  .click('#DERIVED_REGFRM1_LINK_ADD_ENRL')
	  .wait('#DERIVED_REGFRM1_SSR_PB_SUBMIT')
	  .click('#DERIVED_REGFRM1_SSR_PB_SUBMIT')
	  .wait('#DERIVED_REGFRM1_DESCR2')
	  .end()
	  .catch(error => {
	    console.error('Search failed:', error)
	  });
	  if(classEnroll == 'none')
	  	classStatus()
	},20000)
}
classStatus();
module.exports = app;