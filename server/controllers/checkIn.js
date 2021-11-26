const Membership = require("../models/membership.model");
const nearest = require("nearest-date");
const Invoice = require("../models/invoice.model");

async function checkIn(req, res) {
  try {
    const membership = await Membership.find({ user: req.params.id }).populate(
      "invoices"
    );
    let active = false;
    const currentDate = new Date().toJSON().slice(0, 10);
    const from = membership[0].start_date;
    const to = membership[0].end_date;
    const check = new Date(currentDate);
    const firstDayOfTheMonth = new Date().toISOString().slice(0, 8) + "01";

    if (check > from && check < to) {
      active = true;
    } else {
      active = false;
    }

    if (membership[0].credits <= 0) {
      res
        .status(400)
        .json(`Unfortunately, your credits are: ${membership[0].credits}`);
    } else if (active === false) {
      res.status(400).json(`Unfortunately, your membership is cancelled`);
    } else {
      const newCredit = (membership[0].credits = membership[0].credits - 1);
      const findMembership = await Membership.findById(membership[0]._id);
      Object.assign(findMembership, {
        credits: newCredit,
      });
      await findMembership.save();
      const data = {
        status: "Outstanding",
        description: "The first invoice",
        amount: newCredit,
        date: firstDayOfTheMonth,
        invoice_lines: [
          { amount: newCredit, description: "The first invoice line" },
        ],
      };

      if (membership[0].invoices.length === 0) {
        const newInvoice = await new Invoice(data);
        const savedInvoice = await newInvoice.save();
        Object.assign(findMembership, {
          invoices: savedInvoice,
        });

        await findMembership.save();
        return res.status(201).json(`Your first invoice is created`);
      } else {
        const arr = [];
        membership[0].invoices.forEach((invoice) => {
          arr.push(new Date(invoice.date));
        });
        const target = new Date(currentDate);
        const index = nearest(arr, target);
        const now = new Date();
        const filtered = membership[0].invoices.filter((invoice) => {
          return (
            JSON.stringify(new Date(invoice.date)) ===
            JSON.stringify(new Date(arr[index]))
          );
        });
        const invoice = await Invoice.findById(filtered[0]._id);
        if (
          arr[index].getFullYear() == now.getFullYear() &&
          arr[index].getMonth() == now.getMonth()
        ) {
          const nowInvoiceLine = {
            amount: newCredit,
            description: "pilates",
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
        } else {
          const newInvoice = await new Invoice(data);
          const savedInvoice = await newInvoice.save();
          Object.assign(findMembership, {
            invoices: [...membership[0].invoices, savedInvoice],
          });

          await findMembership.save();
          return res
            .status(201)
            .json(`Your first invoice for this month is created`);
        }
      }
    }
  } catch (error) {
    res.status(400).json(`An error occurred: ${error}`);
  }
}

module.exports = checkIn;
