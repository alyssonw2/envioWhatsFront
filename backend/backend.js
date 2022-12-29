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

export const  Get = async (query)=>{
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

app.post('/SalvarMessage', async (req, res) => {
  console.log(req.body)
  let q = "INSERT INTO `mensagens` (`mensagem_id`, `usuario_id`, `dataRegistro`, `recebedores`, `imagem`, `mensagem`, `status`, `data_disparo_previsto`, `dataTermino_disparo`, `delay`, `sessionname`) VALUES (NULL, '1', CURRENT_TIMESTAMP, '[]', 'data', 'mensagem', 'status', '2022-12-31 00:00:00', '', '20', 'willian.json')"
  await Get(q).then(
    ()=>{res.send({"Response":'mensagem enviada '})}
  ).catch(
    (erro)=>{res.send({"Response":erro})}
  )
})

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})