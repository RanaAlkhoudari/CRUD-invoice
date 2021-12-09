const Membership = require("../models/membershipModel");

/**
 * This method uses two parameters the request and the response and will either send a 201, 400 or 500 status response to the user.
 * - 400: if the body of the request contains invalid fields
 * - 201: if the fields are correct
 * - 500: if an unexpected error occurs
 * @param {Object} req - The request of the user
 * @param {Object} res - The response to the user
 * @returns - nothing
 */

async function createMembership(req, res) {
  try {
    const membership = await new Membership(req.body);
    // Checking if the request doesn't have all the required fields
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
