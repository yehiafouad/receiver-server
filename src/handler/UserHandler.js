const { User } = require("../../models");

class UserHandler {
  static async createUserHandler(userContent) {
    const { name, email, phoneNumber } = JSON.parse(userContent);
    console.log(name, email, phoneNumber);
    const newUser = await User.create({
      name,
      email,
      phoneNumber,
    });

    console.log(newUser.dataValues);
    return newUser;
  }

  // Get All Users
  static async getAllUsersHandler(userContent) {
    const users = await User.findAll();

    return users;
  }
}

module.exports = UserHandler;
