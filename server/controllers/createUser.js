const User = require("../models/userModel");

async function createUser(req, res) {
  try {
    const user = await new User(req.body);
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
