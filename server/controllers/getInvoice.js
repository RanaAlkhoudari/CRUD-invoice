const Invoice = require("../models/invoiceModel");

/**
 * This method uses two parameters the request and the response and it won't return anything
 *
 * @param {Object} req
 * @param {Object} res
 * @returns
 */

async function getInvoice(req, res) {
  try {
    const invoice = await Invoice.findById(req.params.id);
    // Checking if the invoice doesn't exist in the database
    if (!invoice) {
      return res.status(404).json({
        message: `Invoice with the id ${req.params.id} does not exist in the database`,
      });
    }
    res.status(200).json(invoice);
  } catch (error) {
    res
      .status(500)
      .send(
        `Invoice with the id ${req.params.id} does not exist in the database`
      );
  }
}

module.exports = getInvoice;
