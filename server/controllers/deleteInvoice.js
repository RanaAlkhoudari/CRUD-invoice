const Invoice = require("../models/invoiceModel");

async function deleteInvoice(req, res) {
  try {
    await Invoice.findByIdAndDelete(req.params.id);
    res.status(200).json({ message: "Successful, invoice is deleted" });
  } catch (error) {
    res
      .status(404)
      .send(
        `Invoice with the id ${req.params.id} does not exist in the database`
      );
  }
}

module.exports = deleteInvoice;
