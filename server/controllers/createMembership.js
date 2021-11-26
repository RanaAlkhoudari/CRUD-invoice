const Membership = require("../models/membership.model");

async function createMembership(req, res) {
  try {
    const membership = await new Membership(req.body);
    const savedMembership = await membership.save();
    res.status(201).json(savedMembership);
  } catch (error) {
    res.status(400).json(`An error occurred: ${error}`);
  }
}

module.exports = createMembership;
