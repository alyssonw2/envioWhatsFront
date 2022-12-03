    let gerados = []
    let NumerosGerados = 0
    let confirmados = 0
    let falhawhatsapp = 0

    const sock = io("http://192.168.2.103:7777", {
    reconnectionDelayMax: 10000
    });
    const timer = (seconds) =>  {
    let time = seconds * 500
    return new Promise(res => setTimeout(res, time))
    }
    sock.on("connect",async dados=>{
    console.log(sock.id)
        
        if(document.querySelector("#closemodal")){
            document.querySelector("#closemodal").click()
        }
    })
    sock.on("disconnect",async dados=>{
        console.log(sock.id)
        document.querySelector("#openmodal").click()
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
        sessionName:'willian.json', //identificado da sessão
        browserName:'DEVTESTE', // nome que será exibido no dispositivo
        soketID:sock.id,
        webhook:'' // caminho para notificações
        }
        sock.emit("startConexao",d,(ret)=>{
            document.querySelector("#loading").hidden = false
        }) 
        localStorage.sessionName = d.sessionName

    }  
    async function validarNumero(numero){
        let WhatsappID = numero
        document.querySelector("#loading").hidden = false
          let d = {
              sessionName:'willian.json', //identificado da sessão
              soketID:sock.id,
              WhatsappID
          }
          await sock.emit("onWhatsApp",d,(ret)=>{
                 ret
                 document.querySelector("#loading").hidden = true
            })
        
    }
    async function onWhatsApp(){
      let WhatsappID = document.querySelector("#numero").value
      let pais = document.querySelector("#pais").value
      let ddd = document.querySelector("#ddd").value
      let numero = pais+ddd+WhatsappID
        let d = {
            sessionName:'willian.json', //identificado da sessão
            soketID:sock.id,
            WhatsappID:numero
        }
        sock.emit("checkWhatsapp",d,(ret)=>{
            document.querySelector("#RespostaPesquisa").innerHTML = ``
            console.log(ret)
            document.querySelector('#dados').innerHTML = ret[0].jid
            let d = {
                sessionName:'willian.json', //identificado da sessão
                soketID:sock.id,
                WhatsappID:ret[0].jid.replace('@s.whatsapp.net','@c.us')
            }

            /*sock.emit("getBusinessProfile",d,(ret)=>{
                console.log(ret)
                document.querySelector('#dadosempresa').innerHTML = ret.toString()
            })*/
            sock.emit("profilePictureUrl",d,(ret)=>{
                console.log(ret)
                document.querySelector("#RespostaPesquisa").innerHTML = `
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
    var myOffcanvas =  document.querySelector("#offcanvasExample")
    var bsOffcanvas = new bootstrap.Offcanvas(myOffcanvas)
    console.log(dados)
    if(dados.user == localStorage.sessionName){
        document.querySelector(".offcanvas-body").innerHTML = `
        <h3>Leia o qrcode</h3>
                    <img src="" id="qrcode" width="350px" alt="">
        `
        document.querySelector('#qrcode').src ='data:image/png;base64,'+dados.qrcode
        bsOffcanvas.show()
    }
    return
    })
    sock.on("Retorno_userConect",async dados=>{
        if(document.querySelector("#MensagemConexao")){
            document.querySelector("#MensagemConexao").innerHTML =` 
            Whatsapp ativo
            `
        }
        if(document.querySelector("#buttonConexao")){
            document.querySelector("#buttonConexao").innerHTML =`
            Conectado
            <span class="position-absolute top-0 start-100 translate-middle p-2 bg-success border border-light rounded-circle">
                            <span class="visually-hidden">Conectado</span>
                          </span>`
            setTimeout(() => {
                var myOffcanvas =  document.querySelector("#offcanvasExample")
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
            sessionName:'willian.json', //identificado da sessão
            soketID:sock.id,
            WhatsappID
        }
        
        console.log(d)
        sock.emit("profilePictureUrl",d,async(ret)=>{
            console.log(ret)
            if(ret != ''){
              gerados.push(WhatsappID)
            }
            if( document.querySelector(".offcanvas-body")){
                document.querySelector(".offcanvas-body").innerHTML = `
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
        document.querySelector("#loading").hidden = false
        let tel = ''
        let pais = document.querySelector("#pais").value
        let ddd = document.querySelector("#ddd").value
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
        document.querySelector('#imgconvertida').innerHTML = base64img
        let mensagem = document.querySelector("textarea").value
        document.querySelector("#imgconvertida").src = base64img 
        document.querySelector("#TextopreVisulizado").innerHTML = mensagem     
        document.querySelector("#previadata").innerHTML = 'Data e hora início de envio:'+ document.querySelector("#datahorainicio").value
        document.querySelector("#previa_delay").innerHTML = 'Delay:'+ document.querySelector("#delay").validar
    }
    
    async function Gerarwhatsapp() {
      let quantidade  = document.querySelector("#quantidade").value  
      let tentativas = 0
      let listasnumeroGerado = document.querySelector("#listasnumeroGerado")

      for (let index = 0; gerados.length -1 < quantidade ;  index++) {
        NumerosGerados ++
        document.querySelector("#gerados").innerHTML = NumerosGerados 
        if (tentativas >= 1000) {
            return
        }
         let numero  =  await Gerarnumero()
         
         await aplicandoNumero(numero)
         await timer(1)
      }
      document.querySelector("#loading").hidden = true
      
    }
    async function aplicandoNumero(numero) {
        let WhatsappID = numero
        let d = {
            sessionName:'willian.json', //identificado da sessão
            soketID:sock.id,
            WhatsappID
        }
        await sock.emit("checkWhatsapp",d,
               async (validar)=>{
                
                if( document.querySelector('#validando')){
                document.querySelector('#validando').innerHTML = validar
                }
                
                  if(validar[0]?.exists == undefined){
                    return 0
                   }else{
                    
                      let WhatsappID = validar[0].jid.replace('@s.whatsapp.net','@c.us')
                      let d = {
                          sessionName:'willian.json', //identificado da sessão
                          soketID:sock.id,
                          WhatsappID
                      }
                      console.log(d)
                      sock.emit("profilePictureUrl",d,async(ret)=>{
                          console.log(ret.data)
                          if(ret.data != 401){
                            gerados.push(WhatsappID)
                            confirmados++
                            document.querySelector("#confirmados").innerHTML = confirmados
                            falhawhatsapp = NumerosGerados - confirmados
                            document.querySelector("#falha").innerHTML = falhawhatsapp
                          }else{
                           return ''
                          }
                          
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
        document.querySelector('#imgbase64').innerHTML = base64img
        let mensagem = document.querySelector("textarea").value
        document.querySelector("#imgconvertida").src =base64img 
        console.log(mensagem)

    }
    async function Desabilitar(item){
        if(
            document.getElementById(item).classList.contains('opacity') == true
        ){
            document.getElementById(item).classList.remove('opacity')
            gerados.push(item+"@c.us")
            //console.log(gerados)
            document.querySelector("#confirmados").innerHTML = gerados.length-1
        }else{
            document.getElementById(item).classList.add('opacity')
            gerados.splice(gerados.indexOf(`${item}@c.us`),1);
            //console.log(gerados)
            document.querySelector("#confirmados").innerHTML = gerados.length-1
        }
    }
    async function CancelarBuscar(){
        if(document.getElementById('loading').hidden == false){
            document.getElementById('loading').hidden = true
        }else{
            document.getElementById('loading').hidden = false
        }
        
    }
    async function enviarComFoto() {
        if(document.querySelector('#enviarConFoto').hidden==false){
            document.querySelector('#enviarConFoto').hidden=true
            document.querySelector("#imgconvertida").hidden=true
            document.getElementById('FileImagem').value=''
        }
        else{
            document.querySelector('#enviarConFoto').hidden=false
            document.querySelector("#imgconvertida").hidden=false
        }

    }
    async function EnvioDeTezte() {
        document.querySelector("#loading").hidden = false
        alert('Será enviado para o número: '+localStorage.WhatsappID)
        const file = document.getElementById('FileImagem').files[0];
        let mensagem = document.querySelector("textarea").value
        
        let base64img = ''
        if(file?.name != undefined){
            base64img = await GetBase64IMG()
        }

        localStorage.mensagemImage_base64img =  base64img
        localStorage.mensagemText = mensagem
        localStorage.mensagemImgName = file?.name

        console.table([base64img,mensagem])
        let WhatsappID = localStorage.WhatsappID
        let imgName = file?.name
        let dados = {
            sessionName:'willian.json', //identificado da sessão
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
                    sessionName:'willian.json', //identificado da sessão
                    soketID:sock.id,
                    "id":WhatsappID,
                    message : {text: mensagem }
                }  
                sock.emit("sendMessage",dados, (ret)=>{
                    console.log(ret)
                    document.querySelector("#loading").hidden = true        
                })
            }
        })
        }else{
            if(mensagem != ''){
                let dados = {
                    sessionName:'willian.json', //identificado da sessão
                    soketID:sock.id,
                    "id":WhatsappID,
                    message : {text: mensagem }
                }  
                sock.emit("sendMessage",dados, (ret)=>{
                    console.log(ret)
                    document.querySelector("#loading").hidden = true        
                })
            }
        }
       
    }
    async function salvarCampanha() {
        let envio = {
       "img":  localStorage.mensagemImage_base64img ,
       "imgname": localStorage.mensagemImgName,
       "texto":localStorage.mensagemText ,
       "numero":gerados,
       "delay":localStorage.mensagemDelay,
       "sessionName":localStorage.sessionName
        }
        console.log(envio)
        axios.post('/SalvarMessage',envio)
        
    }