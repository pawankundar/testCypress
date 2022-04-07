
const amqp = require("amqplib/callback_api");
const MongoClient = require('mongodb').MongoClient;


amqp.connect('amqp://guest:guest@127.0.0.1:5672', function (err, conn) {
  conn.createChannel(function (err, ch) {
    ch.assertQueue('testQueue',{
      durable :true
    })
    ch.consume('testQueue',  async(msg) => {
        let message = await msg.content.toString()
      console.log('App :: Listening to Rabbit mq');
      console.log("Message:", message );
      MongoClient.connect('mongodb://127.0.0.1:27017', (err, client) => {
        if (err) {
          console.log(`MONGO CONNECTION ERROR: ${err}`)
          throw err;
        } else {
          const db = client.db('test');

          db.collection("categories").insertOne(JSON.parse(message),(error,data)=>{
            if (error) {
              console.log("Error while inserting data in db.");
              return;
            }
            console.log("App :: Data inserted in db",data);
          })
        }

      })
      },{ noAck: true }
    );
  });
});