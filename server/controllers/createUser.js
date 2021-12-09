const User = require("../models/userModel");

/**
 * This method uses two parameters the request and the response and it won't return anything
 *
 * @param {Object} req
 * @param {Object} res
 * @returns
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
