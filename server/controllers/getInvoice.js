const Invoice = require("../models/invoice.model");

async function getInvoice(req, res) {
  try {
    const invoice = await Invoice.findById(req.params.id);
    res.status(200).json(invoice);
  } catch (error) {
    res
      .status(404)
      .send(
        `Invoice with the id ${req.params.id} does not exist in the database`
      );
  }
}

module.exports = getInvoice;
