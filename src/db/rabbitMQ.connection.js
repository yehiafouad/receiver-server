const ampq = require("amqplib/callback_api");
const UserHandler = require("../handler/UserHandler");

// Recieve from rabbitMQ queues and payloads
ampq.connect(
  process.env.NODE_ENV === "development"
    ? "amqp://localhost"
    : process.env.RABBITMQ_URL,
  (err, connection) => {
    if (err) {
      throw err;
    }

    // Create Channel
    connection.createChannel(async (chErr, channel) => {
      if (chErr) {
        throw chErr;
      }

      await createUserQueue("createUser", channel);

      process.on("beforeExit", () => {
        connection.close();
      });
    });
  }
);

// Create User
const createUserQueue = async (queueName, channel) => {
  // console.log(queueName, channel);
  channel.assertQueue(queueName, { durable: false });
  channel.consume(
    queueName,
    async (msg) => {
      await UserHandler.createUserHandler(JSON.parse(msg.content.toString()));
    },
    { autoAck: true }
  );
};
