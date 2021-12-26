"use strict";

const fs = require("fs");
const path = require("path");
const Sequelize = require("sequelize");
const basename = path.basename(__filename);
const mysql = require("mysql");
const env = process.env.NODE_ENV || "development";
const config = require(__dirname + "/../config/config.json")[env];
const db = {};

let sequelize;
if (config.use_env_variable) {
  createDB();
  sequelize = new Sequelize(process.env[config.use_env_variable], config);
} else {
  createDB();
  sequelize = new Sequelize(
    config.database,
    config.username,
    config.password,
    config
  );
}

fs.readdirSync(__dirname)
  .filter((file) => {
    return (
      file.indexOf(".") !== 0 && file !== basename && file.slice(-3) === ".js"
    );
  })
  .forEach((file) => {
    const model = require(path.join(__dirname, file))(
      sequelize,
      Sequelize.DataTypes
    );
    db[model.name] = model;
  });

Object.keys(db).forEach((modelName) => {
  if (db[modelName].associate) {
    db[modelName].associate(db);
  }
});

db.sequelize = sequelize;
db.Sequelize = Sequelize;

function createDB() {
  const { host, username, password, database } = config;
  console.log(config);

  const dbUrl =
    process.env.NODE_ENV === "production"
      ? process.env.MYSQL_URL
      : "mysql://" + username + ":" + password + "@" + host + "/" + database;
  const db = mysql.createConnection(dbUrl);

  db.connect((err) => {
    if (err) {
      throw err;
    }
    const sql = `CREATE DATABASE IF NOT EXISTS ${database}`;
    db.query(sql, (err) => {
      if (err) throw err;
    });
  });
}

module.exports = db;
