const Invoice = require("../models/invoiceModel");

async function deleteInvoice(req, res) {
  try {
    const deletedInvoice = await Invoice.findByIdAndDelete(req.params.id);
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
