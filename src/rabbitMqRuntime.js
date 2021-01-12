import CONFIG from "./config";
import socketServer from "./socketServer";
const { io } = socketServer;
import rethinkDb from "./db/rethinkDb";
const { rethinkORM , r } = rethinkDb;
const serverToLocalQueue ='server_local';
const localToServerQueue ='local_server';


// import rabbitMQService from "./services/rabbitMQService";


const run =() => {
  try {
    let openRabbitMqServer = require('amqplib').connect(CONFIG["RABBITMQ_SERVER_URL"]);
    let openRabbitMqLocal = require('amqplib').connect(CONFIG["RABBITMQ_LOCAL_URL"]);
    let connectRabbitMqServer =  openRabbitMqServer.then(function(conn) {
      return conn.createChannel();
    })
    
    let connectRabbitMqLocal =  openRabbitMqLocal.then(function(conn) {
      return conn.createChannel();
    })
    connectRabbitMqServer.then(function(ch) {
      console.log(ch);
      return ch.assertQueue(serverToLocalQueue).then(function(ok) {
        return ch.consume(serverToLocalQueue, async function(msg) {
          console.log(msg);
          if (msg !== null) {
            let content = msg.content.toString();
            content = JSON.parse(content);
            console.log(content);
            const { type } = content;
    
            if (type === 'device') {
              const option = content["deviceData"];
              let {roomId, type, deviceId, mode, h, t} = option;
              h = h || null;
              t = t || null;
              mode = mode || null;
              if (roomId && roomId && type && deviceId){
                const datetime = (new Date()).getTime();
                // console.log(mode, h, t)
                if (['automatic','remote'].indexOf(type) !== -1){
                  const deviceFound = await r.table("device").filter({deviceId}).run();
                  if (deviceFound.length === 0 ) {
                    r.table("device").insert({
                      datetime,deviceId,mode,h,t,type
                    }).run().catch((rethinkDbError)=>{
                      console.log({rethinkDbError});
                    })
    
                  } else {
                    r.table("device").filter({deviceId}).update({
                      datetime, deviceId,mode,h,t,type
                    }).run().catch((rethinkDbError)=>{
                      console.log({rethinkDbError});
                    })
                  }
                }
                if (type === 'warning' && mode !== null) {
                  r.table("device").insert({
                    datetime, deviceId,mode,type
                  }).run().catch((rethinkDbError)=>{
                    console.log({rethinkDbError});
                  })
                }
                //io.sockets.in(roomId).emit("update-device-info",{});
                io.to(roomId).emit("update-device-info",{});
              }
            }
            // console.log(msg.content.toString());
            // await axios({
            //   method:''
            // })
            ch.ack(msg);
    
          }
        });
      });
    
    }).catch(()=>{
      openRabbitMqServer = require('amqplib').connect(CONFIG["RABBITMQ_SERVER_URL"]);
      connectRabbitMqServer =  openRabbitMqServer.then(function(conn) {
        return conn.createChannel();
      })
    });
    
    connectRabbitMqLocal.then(function(ch) {
      // console.log(ch);
      return ch.assertQueue(localToServerQueue).then(function(ok) {
        return ch.consume(localToServerQueue, function(msg) {
          console.log(msg);
          if (msg !== null) {
            // console.log(msg.content.toString());
            ch.ack(msg);
            connectRabbitMqServer.then(function(ch) {
              return ch.assertQueue(localToServerQueue).then(function(ok) {
                return ch.sendToQueue(localToServerQueue, msg.content);
              });
            }).catch(()=>{
              openRabbitMqServer = require('amqplib').connect(CONFIG["RABBITMQ_SERVER_URL"]);
              connectRabbitMqServer =  openRabbitMqServer.then(function(conn) {
                return conn.createChannel();
              });
            });
          }
        });
      });
    
    }).catch(()=>{
      openRabbitMqLocal = require('amqplib').connect(CONFIG["RABBITMQ_LOCAL_URL"]);
      connectRabbitMqLocal =  openRabbitMqLocal.then(function(conn) {
        return conn.createChannel();
      })
    });
    
  } catch(error) {
    setTimeout(()=>{
      console.log({
        error
      })
      run();
    },3000)
  }
}