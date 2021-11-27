const User = require("../models/userModel");

async function createUser(req, res) {
  try {
    const user = await new User(req.body);
    const savedUser = await user.save();
    res.status(201).json(savedUser);
  } catch (error) {
    res.status(400).json(`An error occurred: ${error}`);
  }
}

module.exports = createUser;
