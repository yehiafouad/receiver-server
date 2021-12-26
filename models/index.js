const fs = require("fs");
const path = require("path");
const Sequelize = require("sequelize");
const basename = path.basename(__filename);
const mysql = require("mysql");
const env = process.env.NODE_ENV || "development";
const config = require(__dirname + "/../config/config.json")[env];
const db = {};

const dbConfig =
  process.env.NODE_ENV !== "production"
    ? {
        host: process.env.MYSQL_DEV_HOST,
        user: process.env.MYSQL_DEV_USERNAME,
        password: process.env.MYSQL_DEV_PASSWORD,
        database: process.env.MYSQL_DEV_DATABASE,
        dialect: "mysql",
      }
    : {
        host: process.env.MYSQL_PROD_HOST,
        user: process.env.MYSQL_PROD_USERNAME,
        password: process.env.MYSQL_PROD_PASSWORD,
        database: process.env.MYSQL_PROD_DATABASE,
        dialect: "mysql",
      };

console.log(dbConfig);

let sequelize;
if (config.use_env_variable) {
  process.env.NODE_ENV !== "production" && createDB();
  sequelize = new Sequelize(process.env[config.use_env_variable], config);
} else {
  process.env.NODE_ENV !== "production" && createDB();
  sequelize = new Sequelize(
    dbConfig.database,
    dbConfig.user,
    dbConfig.password,
    dbConfig
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
  const db = mysql.createConnection(dbConfig);

  db.connect((err) => {
    if (err) {
      throw err;
    }
    const sql = `CREATE DATABASE IF NOT EXISTS ${dbConfig.database}`;
    db.query(sql, (err) => {
      if (err) throw err;
    });
  });
}

module.exports = db;
