import amqp from 'amqplib/callback_api';

const queue = 'task_queue';

amqp.connect('amqp://localhost', (error0, connection) => {
  if (error0) {
    console.error('Failed to connect to RabbitMQ');
    process.exit(1);
  }

  connection.createChannel((error1, channel) => {
    if (error1) {
      console.error('Failed to create channel');
      process.exit(1);
    }

    channel.assertQueue(queue, {
      durable: true,
    });

    console.log('Waiting for messages in', queue);
    channel.consume(queue, (msg) => {
      if (msg !== null) {
        const content = JSON.parse(msg.content.toString());
        console.log('Received:', content);
        channel.ack(msg); // Acknowledge the message
      }
    }, {
      noAck: false,
    });
  });
});
