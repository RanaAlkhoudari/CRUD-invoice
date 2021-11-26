const Invoice = require("../models/invoice.model");

async function createInvoice(req, res) {
  try {
    const invoice = await new Invoice(req.body);
    const savedInvoice = await invoice.save();
    res.status(201).json(savedInvoice);
  } catch (error) {
    res.status(400).send(`An error occurred: ${error}`);
  }
}

module.exports = createInvoice;
