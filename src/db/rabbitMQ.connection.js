const ampq = require("amqplib/callback_api");
const UserHandler = require("../handler/UserHandler");

// Recieve from rabbitMQ queues and payloads
ampq.connect("amqp://localhost", (err, connection) => {
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
});

// Send To Queue
const sendToQueue = (queueName, data) => {
  ampq.connect("amqp://localhost", (err, connection) => {
    if (err) {
      throw err;
    }

    // Create Channel
    connection.createChannel((chErr, channel) => {
      if (chErr) {
        throw chErr;
      }

      // Assert Queue
      const QUEUE = queueName;
      channel.assertQueue(QUEUE, { durable: false });

      // Send Message to queue
      channel.sendToQueue(QUEUE, Buffer.from(JSON.stringify(data)));
      console.log("Message Send");
    });

    // process.on("beforeExit", () => {
    //   connection.close();
    // });
  });
};

// Create User
const createUserQueue = async (queueName, channel) => {
  // console.log(queueName, channel);
  channel.assertQueue(queueName, { durable: false });
  channel.consume(
    queueName,
    async (msg) => {
      const newUser = await UserHandler.createUserHandler(
        JSON.parse(msg.content.toString())
      );
      // sendToQueue(queueName + "-recieve", newUser);
    },
    { noAck: true }
  );
};
