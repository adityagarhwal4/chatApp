import express, { Request, Response } from 'express';
import amqp from 'amqplib/callback_api';

const app = express();
const port = 3000;
const queue = 'task_queue';

app.get('/send-message', (req: Request, res: Response) => {
  amqp.connect('amqp://localhost', (error0, connection) => {
    if (error0) {
      res.status(500).send('Failed to connect to RabbitMQ');
      return;
    }

    connection.createChannel((error1, channel) => {
      if (error1) {
        res.status(500).send('Failed to create channel');
        return;
      }

      const message = { text: 'Message from API Gateway' };

      channel.assertQueue(queue, {
        durable: true,
      });
      channel.sendToQueue(queue, Buffer.from(JSON.stringify(message)), {
        persistent: true,
      });

      console.log('Message sent to RabbitMQ from API Gateway');
      res.send('Message forwarded to RabbitMQ');
    });
  });
});

app.listen(port, () => {
  console.log(`API Gateway listening on port ${port}`);
});
