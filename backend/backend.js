import {sock} from './functions/socket/index.js';
import {connection} from './functions/mysql/index.js';
import express from 'express'
import cors from 'cors'

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
const app = express()
app.use(express.json());

const corsOptions = {
	origin: 'http://*/',
	optionsSuccessStatus: 200
};
app.use(cors(corsOptions));

const port = 3535
app.use('/', express.static('public'))

app.post('/SalvarMessage', (req, res) => {
  console.log(req.body)
  res.send('Hello World!')
})

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})