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

    // Send a message every 5 seconds to RabbitMQ
    setInterval(() => {
      const message = { text: 'Hello from Service A' };

      channel.assertQueue(queue, {
        durable: true,
      });
      channel.sendToQueue(queue, Buffer.from(JSON.stringify(message)), {
        persistent: true,
      });

      console.log('Sent:', message);
    }, 5000);
  });
});

console.log('Service A is producing messages...');
