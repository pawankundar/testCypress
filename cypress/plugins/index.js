/// <reference types="cypress" />
// ***********************************************************
// This example plugins/index.js can be used to load plugins
//
// You can change the location of this file or turn off loading
// the plugins file with the 'pluginsFile' configuration option.
//
// You can read more here:
// https://on.cypress.io/plugins-guide
// ***********************************************************

// This function is called when a project is opened or re-opened (e.g. due to
// the project's config changing)

/**
 * @type {Cypress.PluginConfig}
 */
// eslint-disable-next-line no-unused-vars

const MongoClient = require('mongodb').MongoClient;
const amqp = require('amqplib/callback_api')
fs = require('fs')

module.exports = (on, config) => {
  on('task', {
    getDataFromDb({ collection, filter }) {
      return new Promise((resolve) => {
        MongoClient.connect('mongodb://127.0.0.1:27017', (err, client) => {
          if (err) {
            console.log(`MONGO CONNECTION ERROR: ${err}`)
            throw err;
          } else {
            const db = client.db('test');
            console.log("Collection --- " + collection + "   --- filter --- " + JSON.stringify(filter));
            let i = 0;
            try {
              fs.unlinkSync('cypress/fixtures/responses.json');
            }
            catch (err) {
              console.log("Error while deleting the responses.json file." + err);
            }
            db.collection(collection).find(filter).toArray(function (error, docs) {
              if (error) {
                console.log("Error while fetching documents from collection.");
                return;
              }
              console.log("data from docs",docs);

              // docs = docs.reduce((docs, e) => ({ ...docs, [e.key]: e }), {});

              // console.log("doc after reduce",docs)

              fs.appendFile('cypress/fixtures/responses.json', JSON.stringify(docs[0]), 'utf8',
                function (err) {
                  if (err) throw err;
                  console.log("Data is appended to file successfully.")
                  resolve('');
                  client.close();

                });

            })
          }

        })
      });
    } ,
    sendMessageToQueue({ message }) {
      return new Promise((resolve) => {

        amqp.connect("amqp://localhost",(err,connection)=>{
          if(err){
            console.log("error while connection",err)
            throw err
          }
          connection.createChannel((err,channel)=>{
            if(err){
              throw err
            }
            let queueName = "testQueue"
            channel.assertQueue(queueName,{
              durable :true
            })

            channel.sendToQueue(queueName,Buffer.from(message))
            setTimeout(()=>{
              connection.close()
            },10000)
            resolve('');
          })
        })
      });
    }
  }) 
};

