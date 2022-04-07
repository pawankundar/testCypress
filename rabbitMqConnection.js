const amqp = require("amqplib")

export const createRabbitMqConnection = async () => {
    try {
        const connection = await amqp.connect(await getBaseURL());
        const channel = await connection.createChannel();
        channel.prefetch(1);
        channel.assertQueue(queueName,{
            durable : true
        });
        return channel;
    } catch (error) {
        logger.error(`Error while creating rabbitmq connection : ${error}`);
    }
   };
