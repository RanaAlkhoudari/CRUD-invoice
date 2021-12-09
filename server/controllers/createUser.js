const User = require("../models/userModel");

/**
 * This method uses two parameters the request and the response and will either send a 201, 400 or 500 status response to the user.
 * - 400: if the body of the request contains invalid fields
 * - 201: if the fields are correct
 * - 500: if an unexpected error occurs
 * @param {Object} req - The request of the user
 * @param {Object} res - The response to the user
 * @returns - nothing
 */

async function createUser(req, res) {
  try {
    const user = await new User(req.body);
    // Checking if the request doesn't have all the required fields
    if (!req.body.name) {
      return res.status(400).json({ message: "please enter a name" });
    }
    const savedUser = await user.save();

    res.status(201).json(savedUser);
  } catch (error) {
    res.status(500).json(`An error occurred: ${error}`);
  }
}

module.exports = createUser;
