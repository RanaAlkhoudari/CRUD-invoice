const Invoice = require("../models/invoice.model");

async function updateInvoice(req, res) {
  try {
    const invoice = await Invoice.findById(req.params.id);
    Object.assign(invoice, req.body);
    await invoice.save();
    res.status(200).send(invoice);
  } catch {
    res
      .status(404)
      .json(
        `Invoice with the id ${req.params.id} does not exist in the database`
      );
  }
}

module.exports = updateInvoice;
