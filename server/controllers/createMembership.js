const Membership = require("../models/membershipModel");

async function createMembership(req, res) {
  try {
    const membership = await new Membership(req.body);
    if (
      typeof req.body.credits === "undefined" ||
      !req.body.start_date ||
      !req.body.end_date ||
      !req.body.invoices ||
      !req.body.user
    ) {
      return res.status(400).json({ message: "please check your details" });
    }
    const savedMembership = await membership.save();
    res.status(201).json(savedMembership);
  } catch (error) {
    res.status(500).json(`An error occurred: ${error}`);
  }
}

module.exports = createMembership;
