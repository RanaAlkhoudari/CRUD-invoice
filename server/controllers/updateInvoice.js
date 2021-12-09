const Invoice = require("../models/invoiceModel");

/**
 * This method uses two parameters the request and the response and will either send a 200, 404 or 500 status response to the user.
 * - 404: if the id of the request doesn't match an invoice's id in the database
 * - 200: if the fields are correct
 * - 500: if an unexpected error occurs
 * @param {Object} req - The request of the user
 * @param {Object} res - The response to the user
 * @returns - nothing
 */

async function updateInvoice(req, res) {
  try {
    const invoice = await Invoice.findById(req.params.id);
    // Checking if the invoice doesn't exist in the database
    if (!invoice) {
      return res.status(404).json({
        message: `Invoice with the id ${req.params.id} does not exist in the database`,
      });
    }

    const data = {
      date: req.body.date || invoice.date,
      status: req.body.status || invoice.status,
      description: req.body.description || invoice.description,
      amount: req.body.amount || invoice.amount,
      invoice_lines: req.body.invoice_lines || invoice.invoice_lines,
    };
    Object.assign(invoice, data);
    await invoice.save();
    res.status(200).send(invoice);
  } catch (error) {
    res.status(500).json(`An error occurred: ${error}`);
  }
}

module.exports = updateInvoice;
