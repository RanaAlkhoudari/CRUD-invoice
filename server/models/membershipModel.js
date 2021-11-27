const mongoose = require("mongoose");
const { Schema } = mongoose;

const membershipSchema = new Schema({
  credits: { type: Number, required: true },
  start_date: { type: Date, required: true },
  end_date: { type: Date, required: true },
  invoices: [{ type: Schema.Types.ObjectId, ref: "invoice" }],
  user: { type: Schema.Types.ObjectId, ref: "user" },
});

const Membership = mongoose.model("membership", membershipSchema);

module.exports = Membership;
