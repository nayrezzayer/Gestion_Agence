var mongoose = require("mongoose");

var UserSchema = new mongoose.Schema({
	firstName: {type: String, required: true},
	lastName: {type: String, required: true},
	email: {type: String, required: true},
	password: {type: String, required: true},
	admin: {
        type: Boolean,
        default: false
           },
	access :{
		type: String,
        default: "Refused",	
	      },
		  locataire:{
	type: Boolean,
	default: false
		  }
}, {timestamps: true});



module.exports = mongoose.model("user", UserSchema);