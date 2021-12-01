const Invoice = require("../models/invoiceModel");

async function createInvoice(req, res) {
  try {
    const invoice = await new Invoice(req.body);
    if (
      !req.body.date ||
      !req.body.amount ||
      !req.body.status ||
      !req.body.description ||
      !req.body.invoice_lines
    ) {
      return res.status(400).json({ message: "please check your details" });
    }
    const savedInvoice = await invoice.save();
    res.status(201).json(savedInvoice);
  } catch (error) {
    res.status(500).send(`An error occurred: ${error}`);
  }
}

module.exports = createInvoice;
