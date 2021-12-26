const { User } = require("../../models");

class UserHandler {
  // Create User Handler
  static async createUserHandler(userContent) {
    const { name, email, phoneNumber } = JSON.parse(userContent);

    const newUser = await User.create({
      name,
      email,
      phoneNumber,
    });

    return newUser;
  }
  // Get All Users
  static async getAllUsersHandler(userContent) {
    const users = await User.findAll({
      order: [["createdAt", "DESC"]],
    });

    return users;
  }
}

module.exports = UserHandler;
