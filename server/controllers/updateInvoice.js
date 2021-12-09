const Invoice = require("../models/invoiceModel");

/**
 * This method uses two parameters the request and the response and it won't return anything
 *
 * @param {Object} req
 * @param {Object} res
 * @returns
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
