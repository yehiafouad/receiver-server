const UserHandler = require("../handler/UserHandler");

// Get All Users on MySQL
const getUsers = async (req, res) => {
  try {
    const users = await UserHandler.getAllUsersHandler();

    return res.json({ success: true, data: users });
  } catch (e) {
    console.log(e);
    return res.status(400).json({ success: false, ...e });
  }
};

module.exports = { getUsers };
