const Invoice = require("../models/invoiceModel");

/**
 * This method uses two parameters the request and the response and it won't return anything
 *
 * @param {Object} req
 * @param {Object} res
 * @returns
 */

async function createInvoice(req, res) {
  try {
    const invoice = await new Invoice(req.body);
    // Checking if the request doesn't have all the required fields
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
