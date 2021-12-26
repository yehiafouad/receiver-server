const { User } = require("../../models");

class UserHandler {
  // Get All Users
  static async getAllUsersHandler(userContent) {
    const users = await User.findAll({
      order: [["createdAt", "DESC"]],
    });

    return users;
  }
}

module.exports = UserHandler;
