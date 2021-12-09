const Invoice = require("../models/invoiceModel");

/**
 * This method uses two parameters the request and the response and it returns an object with
 * a message: successfully deleted
 *
 * @param {Object} req
 * @param {Object} res
 * @returns {Object}
 */

async function deleteInvoice(req, res) {
  try {
    const deletedInvoice = await Invoice.findByIdAndDelete(req.params.id);
    // Checking if the invoice doesn't exist in the database
    if (!deletedInvoice)
      return res.status(404).json({
        message: `Invoice with the id ${req.params.id} does not exist in the database`,
      });
    return res.status(200).json({ message: `successfully deleted` });
  } catch (error) {
    res.status(500).send(`An error occurred: ${error}`);
  }
}

module.exports = deleteInvoice;
