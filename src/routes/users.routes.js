const { getUsers } = require("../controller/users.controller");

const router = require("express").Router();

// Get All Users
router.get("/", getUsers);

module.exports = router;
