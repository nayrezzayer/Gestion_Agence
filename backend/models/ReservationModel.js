var mongoose = require("mongoose");

var Schema = mongoose.Schema;

var ReservationSchema = new Schema({
  useradmin:{type:String,},
 mark:{type: String,},
firstName:{type:String, },
lastName:{type:String, },
adresse:{type:String, },
tel:{type:String, },
  dateDebut:{type: String, },
  dateFin:{type: String, },
 // user: { type: Schema.ObjectId, ref: "User", },

}, { timestamps: true });

module.exports = mongoose.model("Reservation", ReservationSchema);
