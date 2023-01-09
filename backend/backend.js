import {sock} from './functions/socket/index.js';
import io from 'socket.io-client'
import {connection} from './functions/mysql/index.js';
import express from 'express'
import cors from 'cors'

sock.on("connect",async dados=>{
  console.log(sock.id)
});

const sockWhatsappBot = io("http://191.101.71.117:7777", {
  reconnectionDelayMax: 10000
});
sockWhatsappBot.on("connect",async dados=>{
  console.log(dados)
  await envioMensagemAgendada()
})

sock.on("disconnect",async dados=>{
    console.log(sock.id)  
});

export const  Get = async (query)=>{
   connection.query(query, async function (error, results, fields) {
  if (error) throw error;
  console.log(results)
  return  results
  });
};
const app = express()
app.use(express.json({limit:'50mb'}));

const corsOptions = {
	origin: 'http://*/',
	optionsSuccessStatus: 200
};
app.use(cors(corsOptions));

const port = 3535
app.use('/', express.static('public'))

app.post('/login', async (req, res) => {
   console.log(req.body)
   const {usuario,senha} = req.body
  let q = "SELECT * FROM `usuario` WHERE emailusuario = '"+usuario+"' and senhausuario = '"+senha+"'"
  connection.query(q, async function (error, results, fields) {
    if (error) throw error;
    res.send(results)
    });
})

app.post('/SalvarMessage', async (req, res) => {
  console.log(req.body)

  let q = "INSERT INTO `mensagens` (`mensagem_id`, `usuario_id`, `dataRegistro`, `recebedores`, `imagem`, `mensagem`, `status`, `data_disparo_previsto`, `dataTermino_disparo`, `delay`, `sessionname`) VALUES (NULL, '"+req.body.usuario_id+"', CURRENT_TIMESTAMP, '"+req.body.numero+"', '"+req.body.img+"', '"+req.body.texto+"', 'aguardando', '"+req.body.datahorainicio+"', '', '"+req.body.delay+"', '"+req.body.sessionName+"')"
  console.log(q)
  await Get(q).then(
    ()=>{res.send({"Response":'mensagem enviada '})}
  ).catch(
    (erro)=>{res.send({"Response":erro})}
  )
})

app.post('/GetMessage', async (req, res) => {
  console.log(req.body)
  const {sessionName} = req.body
  let query= "SELECT * FROM `mensagens` WHERE sessionname = '"+sessionName+"' and status = 'aguardando' "
  console.log(query)
  connection.query(query, async function (error, results, fields) {
    if (error) throw error;
    res.send(results)
  });
})

app.post('/CancelarMessage', async (req, res) => {
  console.log(req.body)
  const {messageID} = req.body
  let query= "DELETE  FROM `mensagens` WHERE `mensagem_id` = '"+messageID+"'"
  connection.query(query, async function (error, results, fields) {
    if (error) throw error;
    res.send(results)
    });
})

app.post('/GetAllMessage', async (req, res) => {
  console.log(req.body)
  const {sessionName} = req.body
  let query= "SELECT * FROM `mensagens` WHERE sessionname = '"+sessionName+"'"
  connection.query(query, async function (error, results, fields) {
    if (error) throw error;
    res.send(results)
    });
})

app.post('/GetStatusEnvioMensagem', async (req, res) => {
  console.log(req.body)
  const {sessionName} = req.body
  let query= "SELECT * FROM `mensagemenviada` INNER JOIN mensagens WHERE mensagens.mensagem_id = mensagemenviada.messagemID and mensagemenviada.sessionName = '"+sessionName+"'  ORDER BY mensagemenviada.dataEnvio DESC"
  connection.query(query, async function (error, results, fields) {
    if (error) throw error;
    res.send(results)
    });
})

app.post('/GetStatusEnvioMensagemIdMensagem', async (req, res) => {
  console.log(req.body)
  const {sessionName,idMensagem} = req.body
  let query= "SELECT * FROM `mensagemenviada` WHERE sessionName = '"+sessionName+"' and messagemID = '"+idMensagem+"'"
  connection.query(query, async function (error, results, fields) {
    if (error) throw error;
    res.send(results)
    });
})

app.post('/RegistroStatusEnvio', async (req, res) => {
  console.log(req.body)
  const {sessionName,messageID,recebedor,status} = req.body
  let query= "INSERT INTO `mensagemenviada` (`id_Mensagem`, `sessionName`, `messagemID`, `dataEnvio`, `recebedor`, `status`) VALUES (NULL, '"+sessionName+"', '"+messageID+"', CURRENT_TIMESTAMP, '"+recebedor+"', '"+status+"');"
  connection.query(query, async function (error, results, fields) {
    if (error) throw error;
    res.send(results)
  });
})

app.listen(port, () => {
  
  console.log(`Example app listening on port ${port}`)
})
function createAlphaString(length) {
  // Cria uma string vazia para armazenar o resultado
  let result = '';
  // Gera um número aleatório entre 65 e 90 para representar uma letra maiúscula
  // Gera um número aleatório entre 97 e 122 para representar uma letra minúscula
  for (let i = 0; i < length; i++) {
    let charCode = Math.floor(Math.random() * (90 - 65 + 1)) + 65;
    if (Math.random() < 0.5) {
      charCode = Math.floor(Math.random() * (122 - 97 + 1)) + 97;
    }
    result += String.fromCharCode(charCode);
  }
  return result;
}

async function createDelay(timeDelay){
  return new Promise(resolve => setTimeout(resolve, timeDelay*1000));
}

async function envioMensagemAgendada() {
  let query = "SELECT * FROM `mensagens` WHERE status = 'aguardando' and  data_disparo_previsto > CURDATE() ORDER BY RAND() LIMIT 1"
  console.log(query)
  connection.query(query, async function (error, results, fields) {
    if (error) throw error;
    if(results.length == 0){
      console.log('nada a enviar')
      setTimeout(() => {
        envioMensagemAgendada()
      }, 2000);
      return 
    }
    let mensagemParaEnviar =  results
    let mensagem  = mensagemParaEnviar[0].mensagem
    let base64img = mensagemParaEnviar[0].imagem
    let WhatsappID = mensagemParaEnviar[0].recebedores
    let imgName = createAlphaString(20)
    let messageID = mensagemParaEnviar[0].mensagem_id
    let sessionName = mensagemParaEnviar[0].sessionname
    let delay = mensagemParaEnviar[0].delay
    let data_disparo_previsto = mensagemParaEnviar[0].data_disparo_previsto
    console.log(WhatsappID)
    console.log(sessionName)
    console.log(WhatsappID.indexOf(','))
   await  startConexao(sessionName,'teste',sockWhatsappBot.id)
    .then(
     async (conectado)=>{
        console.log(conectado)

        if(conectado == 'INICIADA'){
          await createDelay(10)
        }
        if(conectado == 'QRCODE'){
          let query = "UPDATE `mensagens` SET `status` = 'Whatsapp não conectado' WHERE `mensagens`.`mensagem_id` = '"+results[0].mensagem_id+"' "
            connection.query(query, async function (error, results, fields) {
              console.log(results)
          })
          setTimeout(() => {
            envioMensagemAgendada()
          }, 2000);
          return
        }
        if(conectado?.id != undefined){
          console.log('CONECTADO')
          console.log(conectado.id)
          
        }
        if(WhatsappID.indexOf(',') != -1){
          let envios = 0
          WhatsappID = WhatsappID.split(',')
          for(let numero of WhatsappID){
            console.log(numero)
            await Enviando(mensagem,base64img,numero,imgName,sessionName,messageID)
            await createDelay(delay)
            console.log('enviado' + envios )
          }

          }else{
          
          await Enviando(mensagem,base64img,WhatsappID,imgName,sessionName,messageID)
          await createDelay(delay)
        }
          let query = "UPDATE `mensagens` SET `status` = 'Finalizada' WHERE `mensagens`.`mensagem_id` = '"+results[0].mensagem_id+"' "
            connection.query(query, async function (error, results, fields) {
              console.log(results)
              setTimeout(() => {
                envioMensagemAgendada()
              }, 2000);
          })
          
      }
    ).catch(
      (erro)=>{console.log(erro)}
      
    )
   
  });
}

async function startConexao(sessionName,browserName,soketID) {
  
  let d = {
    sessionName,
    browserName:'Windows', // nome que será exibido no dispositivo
    soketID:soketID,
    webhook:'' // caminho para notificações
    }

  //console.log(d)
   sockWhatsappBot.emit("startConexao",d,(ret)=>{
    console.log('------------')
    console.log(ret)
     return ret
      console.log('------------')
  }) 

}  

  const timer = (seconds) =>  {
  let time = seconds * 500
  return new Promise(res => setTimeout(res, time))
  }
  sockWhatsappBot.on("connect",async dados=>{
  console.log(sockWhatsappBot.id)
  
  })
  sockWhatsappBot.on("disconnect",async dados=>{
      console.log(sockWhatsappBot.id)
  })

async function Enviando(mensagem,base64img,WhatsappID,imgName,sessionName,messageID) {
console.log('iniciou o envio')
  let dados = {
      sessionName,
      soketID:sock.id,
      imgName,
      "id":WhatsappID,
      base64:base64img,
      message: {
          image: {url:'./upload/'+imgName}
      }
  }

  if(base64img != ''){
  sockWhatsappBot.emit("sendMessage",dados, (ret)=>{
    console.log('retorno----------------')
    console.log(ret)
      
        let queryConfirmarEnvio = "INSERT INTO `mensagemenviada` (`id_Mensagem`, `sessionName`, `messagemID`, `dataEnvio`, `recebedor`, `status`) VALUES (NULL, '"+sessionName+"', '"+messageID+"', CURRENT_TIMESTAMP, '"+WhatsappID+"', '200')"
        console.log(queryConfirmarEnvio)
        connection.query(queryConfirmarEnvio, async function (error, results, fields) {
          console.log(error)
          console.log(results)
        })
      if(mensagem != ''){
          let dados = {
              sessionName, //identificado da sessão
              soketID:sockWhatsappBot.id,
              "id":WhatsappID,
              message : {text: mensagem }
          }  
          sockWhatsappBot.emit("sendMessage",dados, (ret)=>{
              console.log(ret)

          })
      }
  })
  }else{
      
      if(mensagem != ''){
         
              let dados = {
                  sessionName, //identificado da sessão
                  soketID:sockWhatsappBot.id,
                  "id":WhatsappID,
                  message : {text: mensagem }
              }  
              sockWhatsappBot.emit("sendMessage",dados, (ret)=>{
                  console.log(ret)
                    let queryConfirmarEnvio = "INSERT INTO `mensagemenviada` (`id_Mensagem`, `sessionName`, `messagemID`, `dataEnvio`, `recebedor`, `status`) VALUES (NULL, '"+sessionName+"', '"+messageID+"', CURRENT_TIMESTAMP, '"+WhatsappID+"', '200')"
                    console.log(queryConfirmarEnvio)
                    connection.query(queryConfirmarEnvio, async function (error, results, fields) {
                      console.log(error)
                      console.log(results)
                    })
              })
          
      }
  }
 
}