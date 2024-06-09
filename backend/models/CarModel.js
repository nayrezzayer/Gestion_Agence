var mongoose = require("mongoose");

var Schema = mongoose.Schema;

var CarSchema = new Schema({

	mark: {type: String},
	description: {type: String},
	imm: {type: String},
	price:{type:Number, },
	imageCar:{type:String},
	location:{type:String },
	user: { type: Schema.ObjectId, ref: "User", },
}, {timestamps: true}); 


module.exports = mongoose.model("Car", CarSchema);