const Membership = require("../models/membershipModel");
const Invoice = require("../models/invoiceModel");
const checkActivity = require("../helpers/checkActivity");

/**
 * This method uses two parameters the request and the response and it won't return anything
 *
 * @param {Object} req
 * @param {Object} res
 * @returns
 */

async function checkIn(req, res) {
  try {
    const membership = await Membership.findOne({
      user: req.params.id,
    }).populate("invoices");
    let active = false;
    const currentDate = new Date();
    active = checkActivity(membership.start_date, membership.end_date);
    //Checking if the membership's credits less than or equals 0
    if (membership.credits <= 0) {
      res
        .status(400)
        .json(`Unfortunately, your credits are: ${membership.credits}`);
      //Checking if the membership is cancelled
    } else if (active === false) {
      res.status(400).json(`Unfortunately, your membership is cancelled`);
    } else {
      const newCredit = (membership.credits = membership.credits - 1);
      Object.assign(membership, {
        credits: newCredit,
      });
      await membership.save();
      const firstDayOfTheMonth = new Date().toISOString().slice(0, 8) + "01";

      const matchInvoice = membership.invoices.filter((invoice) => {
        return (
          JSON.stringify(new Date(invoice.date)).substring(0, 8) ===
          JSON.stringify(new Date(currentDate)).substring(0, 8)
        );
      });
      //Checking if there isn't any invoice at all
      // or if there is an invoice but not for the month of the checking in
      if (membership.invoices.length === 0 || matchInvoice.length === 0) {
        const data = {
          status: "Outstanding",
          description: "The first invoice",
          amount: newCredit,
          date: firstDayOfTheMonth,
          invoice_lines: [
            {
              amount: newCredit,
              description: `You checked in on ${currentDate.toLocaleString()}`,
            },
          ],
        };
        const newInvoice = await new Invoice(data);
        const savedInvoice = await newInvoice.save();
        Object.assign(membership, {
          invoices: [...membership.invoices, savedInvoice],
        });
        await membership.save();
        return res.status(201).json(savedInvoice);
      } else {
        const invoice = await Invoice.findById(matchInvoice[0]._id);
        const newInvoiceLine = {
          amount: newCredit,
          description: `You checked in on ${currentDate.toLocaleString()}`,
        };
        Object.assign(invoice, {
          invoice_lines: [...invoice.invoice_lines, newInvoiceLine],
        });
        await invoice.save();
        return res.status(200).json(invoice);
      }
    }
  } catch (error) {
    res.status(500).json(`An error occurred: ${error}`);
  }
}

module.exports = checkIn;
