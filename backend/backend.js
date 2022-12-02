import {sock} from './functions/socket/index.js';
import {connection} from './functions/mysql/index.js';

sock.on("connect",async dados=>{
  console.log(sock.id)
});

sock.on("disconnect",async dados=>{
    console.log(sock.id)  
});

connection.getConnection(function(err) {
  if (err) {
    console.error('error connecting: ' + err.stack);
    return;
  }
  console.log('connected as id ' + connection.threadId);
});

export const  Get = (query)=>{
  connection.query(query, async function (error, results, fields) {
  if (error) throw error;
  console.log(results)
  return  results
  });
};