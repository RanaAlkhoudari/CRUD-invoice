const Membership = require("../models/membershipModel");
const Invoice = require("../models/invoiceModel");
const checkActivity = require("../helpers/checkActivity");

async function checkIn(req, res) {
  try {
    const membership = await Membership.findOne({
      user: req.params.id,
    }).populate("invoices");
    let active = false;
    const currentDate = new Date();
    active = checkActivity(membership.start_date, membership.end_date);

    if (membership.credits <= 0) {
      res
        .status(400)
        .json(`Unfortunately, your credits are: ${membership.credits}`);
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
        return res
          .status(201)
          .json(
            `Your first invoice for this month is created, your credits are: ${newCredit}`
          );
      } else {
        const invoice = await Invoice.findById(matchInvoice[0]._id);
        const nowInvoiceLine = {
          amount: newCredit,
          description: `You checked in on ${currentDate.toLocaleString()}`,
        };
        Object.assign(invoice, {
          invoice_lines: [...invoice.invoice_lines, nowInvoiceLine],
        });
        await invoice.save();
        return res
          .status(200)
          .json(
            `Your Invoice lines are updated, your credits are: ${newCredit}`
          );
      }
    }
  } catch (error) {
    res.status(400).json(`An error occurred: ${error}`);
  }
}

module.exports = checkIn;
