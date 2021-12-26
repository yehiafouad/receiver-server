const express = require("express");
const app = express();
const port = process.env.PORT || 4000;
const cors = require("cors");
const helmet = require("helmet");

// App Usage
app.use(express.json());
app.use(helmet());
app.use(
  cors({
    origin: "*",
  })
);

// Import Connections
require("./src/db/rabbitMQ.connection");
const db = require("./models");

// Routes Usage
const usersRoutes = require("./src/routes/users.routes");

app.use("/users", usersRoutes);

// 404 For Invalid Routes Handling
app.use((req, res, next) => {
  console.info(
    `404 - NotFound - ${req.originalUrl} - ${req.method} - ${req.ip}`
  );
  res.status(404).send({
    success: false,
    errors: [
      {
        message: "NotFound: there is no handler for this url",
      },
    ],
  });
});

db.sequelize.sync().then((req) => {
  // Start Server function
  app.listen(port, () => console.info(`listen to port ${port}`));
});
