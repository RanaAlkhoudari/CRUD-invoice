const Invoice = require("../models/invoiceModel");

/**
 * This method uses two parameters the request and the response and will either send a 200, 404 or 500 status response to the user.
 * - 404: if the id of the request doesn't match an invoice's id in the database
 * - 200: if the id of the request matches an invoice's id in the database and has been deleted
 * - 500: if an unexpected error occurs
 * @param {Object} req - The request of the user
 * @param {Object} res - The response to the user
 * @returns {Object}  - nothing
 */

async function deleteInvoice(req, res) {
  try {
    const deletedInvoice = await Invoice.findByIdAndDelete(req.params.id);
    // Checking if the invoice doesn't exist in the database
    if (!deletedInvoice)
      return res.status(404).json({
        message: `Invoice with the id ${req.params.id} does not exist in the database`,
      });
    res.status(200).json({ message: `successfully deleted` });
  } catch (error) {
    res.status(500).send(`An error occurred: ${error}`);
  }
}

module.exports = deleteInvoice;
