    let gerados = []
    let NumerosGerados = 0
    let confirmados = 1
    let falhawhatsapp = 0

    const sock = io(":7777", {
        reconnectionDelayMax: 10000
    });
    const timer = (seconds) =>  {
    let time = seconds * 500
    return new Promise(res => setTimeout(res, time))
    }
    sock.on("connect",async dados=>{
    console.log(sock.id)
    
        if($("#closemodal")){
            $("#closemodal").click()
        }
    })
    sock.on("disconnect",async dados=>{
        console.log(sock.id)
        $("#openmodal").click()
    })
    const toBase64 = file => new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.readAsDataURL(file);
        reader.onload = () => resolve(reader.result);
        reader.onerror = error => reject(error);
    });
    async function GetBase64IMG() {
        const file = document.getElementById('FileImagem').files[0];
        if(file == undefined){
            return 'https://th.bing.com/th/id/OIP.uE-t0OHQf3dIo6jA6X7MnwHaEo?pid=ImgDet&rs=1'
        }
       return (await toBase64(file));
    }
    async function donwloadNumeros() {
        let csvContent = "data:text/csv;charset=utf-8,";

        gerados.forEach(function(a) {
            let row =  Array.from(a).join(",");
            row = row.replaceAll(',','')
            row = row.replaceAll('@c.us','')
            csvContent += row + "\r\n";
        });
        var encodedUri = encodeURI(csvContent);
        window.open(encodedUri);
    }
    async function start() {
        let d = {
        sessionName: localStorage.sessionName, //identificado da sessão
        browserName:'Windows', // nome que será exibido no dispositivo
        soketID:sock.id,
        webhook:'' // caminho para notificações
        }
        sock.emit("startConexao",d,(ret)=>{
            console.log(ret)
            CancelarBuscar()
        }) 
        localStorage.sessionName = d.sessionName
        CancelarBuscar()
    }  
    async function validarNumero(numero){
        let WhatsappID = numero
        $("#loading").hidden = false
          let d = {
              sessionName: localStorage.sessionName, //identificado da sessão
              soketID:sock.id,
              WhatsappID
          }
          await sock.emit("onWhatsApp",d,(ret)=>{
                 ret
                 $("#loading").hidden = true
            })
        
    }
    async function onWhatsApp(){
      let WhatsappID = $("#numero").value
      let pais = $("#pais").value
      let ddd = $("#ddd").value
      let numero = pais+ddd+WhatsappID
        let d = {
            sessionName: localStorage.sessionName, //identificado da sessão
            soketID:sock.id,
            WhatsappID:numero
        }
        console.log(d)
        sock.emit("checkWhatsapp",d,(ret)=>{
            $("#RespostaPesquisa").innerHTML = ``
            console.log(ret)
            
            $('#dados').innerHTML = ret[0].jid
            let d = {
                sessionName: localStorage.sessionName, //identificado da sessão
                soketID:sock.id,
                WhatsappID:ret[0].jid.replace('@s.whatsapp.net','@c.us')
            }

            /*sock.emit("getBusinessProfile",d,(ret)=>{
                console.log(ret)
                $('#dadosempresa').innerHTML = ret.toString()
            })*/
            sock.emit("profilePictureUrl",d,(ret)=>{
                console.log(ret)
                if(ret == "[object Object]"){
                    ret = "https://th.bing.com/th/id/OIP.Ff4OsUAvE1lbsfibnk8AQAAAAA?pid=ImgDet&rs=1"
                  }
                $("#RespostaPesquisa").innerHTML = `
                <div class="card mb-3" style="max-width: 540px;">
            <div class="row g-0">
                <div class="col-md-4">
                <img src="${ret}" class="img-fluid rounded-start" alt="${dados.sessionName}">
                </div>
                <div class="col-md-8">
                <div class="card-body">
                    <h5 class="card-title">Válido</h5>
                    <p class="card-text">${numero}</p>
                </div>
                </div>
            </div>
            </div>
                `
                
            })

        })
    }
    sock.on("Qrcode", async dados=>{
    var myOffcanvas =  $("#offcanvasExample")
    var bsOffcanvas = new bootstrap.Offcanvas(myOffcanvas)
    console.log(dados)
    if(dados.user == localStorage.sessionName){
        $(".offcanvas-body").innerHTML = `
        <h3>Leia o qrcode</h3>
                    <img src="" id="qrcode" width="350px" alt="">
        `
        $('#qrcode').src ='data:image/png;base64,'+dados.qrcode
        bsOffcanvas.show()
    }
    return
    })
    sock.on("Retorno_userConect",async dados=>{
        $('#loading > div > div > div.col-8 > div > button').click()

        if($("#MensagemConexao")){
            $("#MensagemConexao").innerHTML =` 
            Whatsapp ativo
            `
        }
        if($("#buttonConexao")){
            $("#buttonConexao").innerHTML =`
            Conectado
            <span class="position-absolute top-0 start-100 translate-middle p-2 bg-success border border-light rounded-circle">
                            <span class="visually-hidden">Conectado</span>
                          </span>`
            setTimeout(() => {
                var myOffcanvas =  $("#offcanvasExample")
                var bsOffcanvas = new bootstrap.Offcanvas(myOffcanvas)
                bsOffcanvas.hide()
            }, 5000);                          
        }
        
        console.log(dados)
        if(dados.numero == undefined){
            return
        }
        let n =  dados.numero.split(':')
        let WhatsappID =  n[0]+'@c.us'
        localStorage.WhatsappID = n[0]+'@c.us'
        let d = {
            sessionName: localStorage.sessionName, //identificado da sessão
            soketID:sock.id,
            WhatsappID
        }
        
        console.log(d)
        sock.emit("profilePictureUrl",d,async(ret)=>{
            console.log(ret)
            if(ret != ''){
              gerados.push(WhatsappID)
            }
            if(ret == "[object Object]"){
                ret = "https://th.bing.com/th/id/OIP.Ff4OsUAvE1lbsfibnk8AQAAAAA?pid=ImgDet&rs=1"
              }
            if( $(".offcanvas-body")){
                $(".offcanvas-body").innerHTML = `
                <div class="card mb-3" style="max-width: 540px;">
                <div class="row g-0">
                    <div class="col-md-4">
                    <img src="${ret}" class="img-fluid rounded-start" alt="${dados.sessionName}">
                    </div>
                    <div class="col-md-8">
                    <div class="card-body">
                        <h5 class="card-title">${dados.sessionName}</h5>
                        <p class="card-text">${n[0]}</p>
                    </div>
                    </div>
                </div>
                </div>`
            }
        })
    })
    async function randomnumber(min,max) {
        return Math.floor(Math.random() * max + min)
    }
    async function Gerarnumero() {

        $("#loading").hidden = false
        let tel = ''
        let pais = $("#pais").value
        let ddd = $("#ddd").value
        for (let index = 0; index < 6; index++) {
            if(index == 0){
                let sort = parseInt(Math.random()*3)
                switch (sort) {
                    case 0:
                        tel+= 9
                        break;
                        case 1:
                        tel+= 8
                        break;
                        case 2:
                        tel+= 7
                        break;
                    default:
                        break;
                }
                tel+= await randomnumber(0,9)
            }
            if(index == 1){
                tel+= await randomnumber(0,9)
            }else{
                tel+= await randomnumber(0,9)
            }
        }
        tel = pais+''+''+ddd+''+tel
        console.log(tel)
        return tel
    }
    async function previsulização() {
        let base64img = await GetBase64IMG()
        $('#imgconvertida').innerHTML = base64img
        let mensagem = $("textarea").value
        $("#imgconvertida").src = base64img 
        $("#TextopreVisulizado").innerHTML = mensagem     
        $("#previadata").innerHTML = 'Data e hora início de envio:'+ $("#datahorainicio").value
        $("#previa_delay").innerHTML = 'Delay:'+ $("#delaymessage").validar
    }
    
    async function Gerarwhatsapp() {
        
      let quantidade  = $("#quantidade").value  
      quantidade = parseInt(quantidade)
      let tentativas = 0

      let listasnumeroGerado = $("#listasnumeroGerado")
     
      for (let index = 0; gerados.length -1 < quantidade ;  index++) {
        NumerosGerados ++
        $("#gerados").innerHTML = NumerosGerados 
        if (tentativas >= 10000) {
            return
        }
         let numero  =  await Gerarnumero()
         
         await aplicandoNumero(numero)
         await timer(1)
      }
      $("#loading").hidden = true
      
    }
    async function aplicandoNumero(numero) {
        let WhatsappID = numero
        let d = {
            sessionName: localStorage.sessionName, //identificado da sessão
            soketID:sock.id,
            WhatsappID
        }
        await sock.emit("checkWhatsapp",d,
               async (validar)=>{
                if( $('#validando')){
                $('#validando').innerHTML = validar
                }
                if(validar[0]?.exists == undefined){
                    return 0
                   }else{
                    
                      let WhatsappID = validar[0].jid.replace('@s.whatsapp.net','@c.us')
                      let d = {
                          sessionName: localStorage.sessionName, //identificado da sessão
                          soketID:sock.id,
                          WhatsappID
                      }
                      console.log(d)
                      sock.emit("profilePictureUrl",d,async(ret)=>{
                          console.log(ret.data)
                          if(ret.data != 401){
                            gerados.push(WhatsappID)
                            $("#confirmados").innerHTML = confirmados
                            falhawhatsapp = NumerosGerados - confirmados
                            $("#falha").innerHTML = falhawhatsapp

                          }else{
                           return ''
                          }
                          confirmados++
                          if(ret == "[object Object]"){
                            ret = "https://th.bing.com/th/id/OIP.Ff4OsUAvE1lbsfibnk8AQAAAAA?pid=ImgDet&rs=1"
                          }
                          
                          listasnumeroGerado.innerHTML += `
                          <div id="${numero}" class="card mb-3 col-sm-12 col-md-4">
                          <div class="row g-0">
                              <div class="col-4">
                              <img src="${ret}" class="img-fluid rounded-start" alt="${numero}">
                              </div>
                              <div class="col-8">
                              <div class="card-body">
                                  <h5 class="card-title">Válido</h5>
                                  <p class="card-text">${numero}</p>
                                  <div class="form-check form-switch">
                                <input class="form-check-input" type="checkbox" role="switch" id="enviarpara_${numero}" checked>
                                <label onclick='Desabilitar("${numero}")' class="form-check-label" for="enviarpara_${numero}">Enviar para </label>
                                </div>
                              </div>
                              </div>
                          </div>
                          </div>
              
                          `
                          return
                      })
                   }
          })
        return  
        
    }
    async function enviar(){
        let base64img = await GetBase64IMG()
        $('#imgbase64').innerHTML = base64img
        let mensagem = $("textarea").value
        $("#imgconvertida").src =base64img 
        console.log(mensagem)

    }
    async function Desabilitar(item){
        if(
            document.getElementById(item).classList.contains('opacity') == true
        ){
            document.getElementById(item).classList.remove('opacity')
            gerados.push(item+"@c.us")
            //console.log(gerados)
            $("#confirmados").innerHTML = gerados.length-1
        }else{
            document.getElementById(item).classList.add('opacity')
            gerados.splice(gerados.indexOf(`${item}@c.us`),1);
            //console.log(gerados)
            $("#confirmados").innerHTML = gerados.length-1
        }
    }
    async function CancelarBuscar(){
        
            document.getElementById('loading').hidden = true
        
    }
    async function enviarComFoto() {
        if($('#enviarConFoto').hidden==false){
            $('#enviarConFoto').hidden=true
            $("#imgconvertida").hidden=true
            document.getElementById('FileImagem').value=''
        }
        else{
            $('#enviarConFoto').hidden=false
            $("#imgconvertida").hidden=false
        }

    }
    async function EnvioDeTezte() {
        $("#loading").hidden = false
        alert('Será enviado para o número: '+localStorage.WhatsappID)
        const file = document.getElementById('FileImagem').files[0];
        let mensagem = $("textarea").value
        localStorage.mensagemText = mensagem
        
        let base64img = ''
        if(file?.name != undefined){
            base64img = await GetBase64IMG()
        }

        localStorage.mensagemImage_base64img =  base64img
        localStorage.mensagemText = mensagem
        localStorage.mensagemImgName = file?.name
        localStorage.datahorainicio = $('#delaymessage').value

        console.table([base64img,mensagem])
        let WhatsappID = localStorage.WhatsappID
        let imgName = file?.name
        let dados = {
            sessionName: localStorage.sessionName, //identificado da sessão
            soketID:sock.id,
            imgName,
            "id":WhatsappID,
            base64:base64img,
            message: {
                image: {url:'./upload/'+imgName}
            }
        }
        if(base64img != ''){
        sock.emit("sendMessage",dados, (ret)=>{
            if(mensagem != ''){
                let dados = {
                    sessionName: localStorage.sessionName, //identificado da sessão
                    soketID:sock.id,
                    "id":WhatsappID,
                    message : {text: mensagem }
                }  
                sock.emit("sendMessage",dados, (ret)=>{
                    console.log(ret)
                    $("#loading").hidden = true        
                })
            }
        })
        }else{
            
            if(mensagem != ''){
               
                    let dados = {
                        sessionName: localStorage.sessionName, //identificado da sessão
                        soketID:sock.id,
                        "id":WhatsappID,
                        message : {text: mensagem }
                    }  
                    sock.emit("sendMessage",dados, (ret)=>{
                        console.log(ret)
                        $("#loading").hidden = true        
                    })
                
            }
        }
       
    }
    async function salvarCampanha() {
        $('#modalGetWhats > div > div > div.modal-header > button').click()
        let envio = {
       "img":  localStorage.mensagemImage_base64img ,
       "imgname": localStorage.mensagemImgName,
       "texto":localStorage.mensagemText ,
       "numero":gerados,
       "delay":localStorage.mensagemDelay,
       "datahorainicio":localStorage.datahorainicio,
       "sessionName":localStorage.sessionName,
       "usuario_id":localStorage.usuarioID
        }
        console.log(envio)
        axios.post('/SalvarMessage',envio)
        //alert('Estou finalizando esta parte ')
        await nav.conexao()

    }

    function cancelarMessage(messagemID) {
        var data = JSON.stringify({
            "messageID": messagemID
          });
          
          var config = {
            method: 'post',
            url: './CancelarMessage',
            headers: { 
              'Content-Type': 'application/json'
            },
            data : data
          };
          
          axios(config)
          .then(function (response) {
            nav.conexao()
          })
          .catch(function (error) {
            console.log(error);
          });
          
    }

    function login(){
        var data = JSON.stringify({
            "usuario": $('#usuario').value,
            "senha": $('#senha').value
          });
          
          var config = {
            method: 'post',
            url: './login',
            headers: { 
              'Content-Type': 'application/json'
            },
            data : data
          };
          
          axios(config)
          .then(function (response) {
            console.log(response.data);
            if(response.length != 0){
                localStorage.sessionName = response.data[0].whatsappusuario
                localStorage.usuarioEmail = response.data[0].emailusuario
                localStorage.usuarioID = response.data[0].idusaurio
                nav.conexao()
                
            }else{
                alert('usuário ou senha incorretos')
            }
          })
          .catch(function (error) {
            console.log(error);
          });
          
    }
