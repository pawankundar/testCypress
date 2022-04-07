
const amqp = require("amqplib/callback_api");
const MongoClient = require('mongodb').MongoClient;


amqp.connect('amqp://localhost', function (err, conn) {
  conn.createChannel(function (err, ch) {
    ch.consume('testQueue',  async(msg) => {
        let message = await msg.content.toString()
      console.log('.....');
      console.log("Message:", message );
      MongoClient.connect('mongodb://127.0.0.1:27017', (err, client) => {
        if (err) {
          console.log(`MONGO CONNECTION ERROR: ${err}`)
          throw err;
        } else {
          const db = client.db('test');

          db.collection("categories").insertOne(JSON.parse(message),(error,data)=>{
            if (error) {
              console.log("Error Inserting.");
              return;
            }
            console.log("Data inserted",data);
          })
        }

      })
      },{ noAck: true }
    );
  });
});