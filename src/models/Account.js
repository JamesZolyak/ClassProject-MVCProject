var mongoose = require('mongoose');
var _ = require('underscore');

var AccountModel;

var setDate = function(date) {
    return _.escape(date).trim();
}

var AccountSchema = new mongoose.Schema({
    
    loginTime: {
        type: Date,
        set: setDate
    },
    
    username: {
        type: String,
        trim: true
    },
    
    createdData: {
        type: Date,
        default: Date.now
    }

});

AccountSchema.methods.toAPI = function() {
    //_id is built into your mongo document and is guaranteed to be unique
    return {
        username: this.username,
        loginTime: this.loginTime,
        _id: this._id
    };
};

AccountSchema.statics.findDate = function(req, callback) {
    //console.log(username);
	var search = {
		username: req.app.user.username,
	};
	
	return AccountModel.find(search).distinct("loginTime").exec(callback);
};



AccountModel = mongoose.model('Account', AccountSchema);


module.exports.AccountModel = AccountModel;
module.exports.AccountSchema = AccountSchema;