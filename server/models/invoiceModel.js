const mongoose = require("mongoose");
const { Schema } = mongoose;

const invoiceSchema = new Schema({
  date: { type: Date, required: true },
  status: {
    type: String,
    enum: ["Outstanding", "Void", "Paid"],
  },
  description: { type: String, required: true },
  amount: { type: Number, required: true },
  invoice_lines: [],
});

const Invoice = mongoose.model("invoice", invoiceSchema);

module.exports = Invoice;
