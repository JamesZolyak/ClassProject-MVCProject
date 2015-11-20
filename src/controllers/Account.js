var _ = require('underscore');
var passport = require('passport');
var models = require('../models');

var Account = models.Account;



var loginPage = function(req, res){
	res.render('login', { user: req.user });
};

var logout = function(req, res){
    req.logout();
    console.log(req);
	res.redirect('/');
};

var login = function(req, res){
	if(!req.body.username || !req.body.pass){
		return res.status(400).json({error: "RAWR! ALL FIELDS ARE REQUIRED!"});
	}
};

//var twitchAuth = function(req, res) {
//    passport.authenticate('twitchtv', { scope: [ 'user_read','user_follows_edit','channel_read','chat_login' ] }),
//            function(req, res){}
//};

//var accountPage = function(req, res) {
//    passport.authenticate('twitchtv', { failureRedirect: '/failure'}),
//        function(req, res) {
//            //models.AccountModel.findDate(req.user.username, function(req,res) {
//                //console.log(req);
//                //res.render('account', {user: res.user});
//            //});
//            var accountData = {
//                data: req.user
//            };
//            var newAccount = new 
//            res.render('account', {user: req.user});
//    };
//}
//

var logging = function(req, res) {
    //console.log(res);
  Account.AccountModel.findDate(req, function(err,dates) {
        if(err) {
			console.log(err);
			return res.status(400).json({error: 'an error occured'});
		}
		
		res.render('viewlogs', {user: req.user, dates: dates}); 
  });  
};
module.exports.loginPage = loginPage;
module.exports.login = login;
module.exports.logout = logout;
module.exports.logging = logging;