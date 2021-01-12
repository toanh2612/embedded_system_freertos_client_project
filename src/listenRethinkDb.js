import rethinkDb from "./db/rethinkDb";
import socketServer from "./socketServer";
const { io } = socketServer;
const {  r } = rethinkDb;
//
r.table("warning").filter({deviceId:"s-01-22a810ca-bef3-41cf-9247-3b725a9c926d"}).changes({includeInitial: true}).run().then((res)=>{
  // console.log(res.connection.r.row);
  // console.log(Object.keys(res));
}).catch((e=>{
  console.log(e);
}))
