var controllers = require('./controllers');
var models = require('./models');
var Account = models.Account;
var passport = require('passport');
var mid = require('./middleware');
var router = function(app){
	app.get('/login', controllers.Account.loginPage);
	app.post('/login', controllers.Account.login);
	app.get('/logout', controllers.Account.logout);
	app.get('/', controllers.Account.loginPage);
    //app.get('/auth/twitchtv/callback', controllers.Account.accountPage);
    app.get('/auth/twitchtv', passport.authenticate('twitchtv', { 
        scope: [ 'user_read','user_follows_edit','channel_read','chat_login' ] }),
            function(req, res){});
    app.get('/auth/twitchtv/callback', passport.authenticate('twitchtv', { 
        failureRedirect: '/failure'}),
        function(req, res) {
            
            var accountData = {
                loginTime: req.user._json.updated_at,
                username: req.user.username,                
            };
            var account = new Account.AccountModel(accountData); 
            
        req.session.account = account.toAPI();
            //req.important = req.user;
        
           account.save(function(err) {
			     if(err){
				    console.log(err);
				    return res.status(400).json({ error: "AN ERROR HAS HAPPENED"});
			     }
			
			     //req.time = account.toAPI();
			
			     //res.json({redirect: '/account'});
           });
          //res.json({redirect: '/account'});
        req.app.user = req.user;
            res.render('account', {user: req.user});
        });
    
    app.get('/viewlogs', function(req,res){
        Account.AccountModel.findDate(req,    function(err,dates) {
            if(err) {
		  	console.log(err);
		  	return res.status(400).json({error: 'an error occured'});
		  }
		  console.log(req.app.user);
            console.log(dates);
		  res.render('viewlogs', {user: req.app.user, dates: dates, loginCount: dates.length}); 
        }); 
        }
    );
    //app.get('/auth/twitchtv', passport.authenticate('twitchtv'));
};

//var ensureAuthenticated = function(req, res, next) {
//    if (req.isAuthenticated()) 
//    { 
//        return next(); 
//        //res.render('account', { user: req.user });
//    }
//    res.redirect('/login')
//}

module.exports = router;