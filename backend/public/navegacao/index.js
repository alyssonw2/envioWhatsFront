const $ = (a)=>{
    return document.querySelector(a)
}
const getHTML = async (url)=>{
    let h = await axios.get(url)
    return h.data
}

const nav = {
    async login(){
        $("app").innerHTML = await getHTML('./assets/paginas/logout')  
    },
    async logout(){
      localStorage.clear()
        $("app").innerHTML = await getHTML('./assets/paginas/logout')
    },
    async conexao(){
        $("app").innerHTML = await getHTML('./assets/componentes/navbar')
        $("app").innerHTML += await getHTML('./assets/componentes/offcanvasModalLoading')
        $("app").innerHTML += await getHTML('./assets/paginas/conexao')
        if(localStorage.usuarioID == '1' ){
          document.querySelector('#navbarScroll > ul').innerHTML += `
          <li class="nav-item text-light">
                    <a class="nav-link text-light" href="#" onclick="nav.novousuario()"> Admini - Usuários </a>
                </li>
          `
        }
        start()
           
        setTimeout(() => {
            var data = JSON.stringify({
                "sessionName": localStorage.sessionName
              });
              
              var config = {
                method: 'post',
                url: './GetAllMessage',
                headers: { 
                  'Content-Type': 'application/json'
                },
                data : data
              };
              
              axios(config)
              .then(function (response) {
                console.log(response.data);
                if(response.length == 0){
                    $('tbody').innerHTML += `
                    <tr>
                        <th></th>
                        <td></td>
                        <td></td>
                        <td></td>
                        <td></td>
                    </tr>
                    `
                    return
                }
                for(mensagem of response.data){
                    $('tbody').innerHTML += `
                    <tr>
                        <th><img src='${mensagem.imagem}' style="width: 100px;"></th>
                        <td>${mensagem.mensagem}</td>
                        <td>${mensagem.status}</td>
                        <td>${mensagem.data_disparo_previsto}</td>
                        <td><button onclick="cancelarMessage(${mensagem.mensagem_id})">Remover</button>
                        <button onclick="nav.enviados(${mensagem.mensagem_id})">Relatôrio de saida</button>
                        </td>
                    </tr>
                    `
                }
                CancelarBuscar()

                const meuInput = document.getElementById('filtro');
                  meuInput.oninput = function() {
                    let linhas = document.querySelectorAll('tr')
                    for(let linha of linhas){
                      if(linha.textContent.indexOf('imagem') == -1){
                        if(linha.textContent.indexOf(meuInput.value) == -1){
                          linha.style.display='none'
                        }else{
                          linha.style.display='block'
                        }
                      }
                    }
                  }

              })
              .catch(function (error) {
                console.log(error);
              });
              CancelarBuscar()
              
        }, 2000);   
    },
    async enviados(idMensagem){
        $("app").innerHTML = await getHTML('./assets/componentes/navbar')
        $("app").innerHTML += await getHTML('./assets/componentes/offcanvasModalLoading')
        $("app").innerHTML += await getHTML('./assets/paginas/enviados')
        setTimeout(() => {
            var data = JSON.stringify({
                "sessionName": localStorage.sessionName,
                "idMensagem":idMensagem
              });
              
              var config = {
                method: 'post',
                url: './GetStatusEnvioMensagemIdMensagem',
                headers: { 
                  'Content-Type': 'application/json'
                },
                data : data
              };
              
              axios(config)
              .then(function (response) {
                console.log(response.data)
                
                for(let relat of response.data){
                    $('ol').innerHTML += `<li class="list-group-item d-flex justify-content-between align-items-start">
                    <div class="ms-2 me-auto">
                    <div class="fw-bold">Sucesso</div>
                      <div class="fw-bold">${relat.recebedor}</div>
                    </div>
                    <span class="badge bg-success rounded-pill">${relat.dataEnvio}</span>
                  </li>`
                }
              })
              .catch(function (error) {
                console.log(error);
              });
              
        }, 2000);
    },
    async relatorio(){
        $("app").innerHTML = await getHTML('./assets/componentes/navbar')
        $("app").innerHTML += await getHTML('./assets/componentes/offcanvasModalLoading')
        $("app").innerHTML += await getHTML('./assets/paginas/relatorio')
        setTimeout(() => {
            var data = JSON.stringify({
                "sessionName": localStorage.sessionName
              });
              
              var config = {
                method: 'post',
                url: './GetStatusEnvioMensagem',
                headers: { 
                  'Content-Type': 'application/json'
                },
                data : data
              };
              
              axios(config)
              .then(function (response) {
                console.log(response.data)

                for(let relat of response.data){
                    $('ol').innerHTML += `<li class="list-group-item d-flex justify-content-between align-items-start">
                    <div class="ms-2 me-auto">
                    <div class="fw-bold">Sucesso</div>
                      <div class="fw-bold">${relat.mensagem}</div>
                      <div class="fw-bold">Status da mensagem: ${relat.status}</div>
                      <div class="fw-bold">${relat.recebedor}</div>
                    </div>
                    <span class="badge bg-success rounded-pill">${relat.dataEnvio}</span>
                  </li>`
                }
              })
              .catch(function (error) {
                console.log(error);
              });
              
        }, 2000);
    },
    async whatsappvalidos(){

        const file = document.getElementById('FileImagem').files[0];
        let mensagem = $("textarea").value
        localStorage.mensagemText = mensagem
        let delayMessage = $("#delaymessage").value 
        let datahorainicio = $("#datahorainicio").value
        
        let base64img = ''
        if(file?.name != undefined){
            base64img = await GetBase64IMG()
        }
        localStorage.datahorainicio = datahorainicio
        localStorage.mensagemImage_base64img =  base64img
        localStorage.mensagemImgName = file?.name
        localStorage.mensagemDelay = delayMessage

        $("app").innerHTML = await getHTML('./assets/componentes/navbar')
        $("app").innerHTML += await getHTML('./assets/componentes/offcanvasModalLoading')
        $("app").innerHTML += await getHTML('./assets/paginas/whatsValidos')
    },
    async validarWhatsapp(){
        $("app").innerHTML = await getHTML('./assets/componentes/navbar')
        $("app").innerHTML += await getHTML('./assets/componentes/offcanvasModalLoading')
        $("app").innerHTML += await getHTML('./assets/paginas/validarWhatsapp')
    },
    async novousuario(){
      $("app").innerHTML = await getHTML('./assets/componentes/navbar')
      $("app").innerHTML += await getHTML('./assets/componentes/offcanvasModalLoading')
      $("app").innerHTML += await getHTML('./assets/paginas/novousuario')

      setTimeout(() => {
        //Carregando lista de usuarios 
        var data = '';
        var config = {
          method: 'post',
          url: './getusuarios',
          headers: { },
          data : data
        };

        axios(config)
        .then(function (response) {
          let table = document.querySelectorAll('tbody')[0]
          for(let usuario of response.data){
            const date = new Date(usuario.dataCadastrousuario);
            
            //renderizazndo usuarios
            table.innerHTML += `
            <tr>
            <th>${usuario.nomeusuario}</th>
            <td>${usuario.emailusuario}</td>
            <td>${formatDate(date)}</td>
            <td>
                <button onclick="removerusuario('${usuario.idusaurio}')" type="button" class="btn btn-light">remover</button>
            </td>
          </tr>
            `
          }
        })
        .catch(function (error) {
          console.log(error);
        });
      }, 1000);

    },

    async criarMensagem(){
        $("app").innerHTML = await getHTML('./assets/componentes/navbar')
        $("app").innerHTML += await getHTML('./assets/componentes/offcanvasModalLoading')
        $("app").innerHTML += await getHTML('./assets/paginas/criarMensagem')
         gerados = []
         NumerosGerados = 0
         confirmados = 1
         falhawhatsapp = 0
    }

}

if(localStorage.sessionName != undefined){
  nav.conexao()
}else{
  nav.logout()
}

function formatDate(date) {
  const options = {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit"
  };

  return new Intl.DateTimeFormat("pt-BR", options).format(date);
}

function novousuaario(){
  var data = JSON.stringify({
    "nome" : document.querySelectorAll('input')[0].value,
    "emaail": document.querySelectorAll('input')[1].value ,
    "senha": document.querySelectorAll('input')[2].value,
  });

        var config = {
          method: 'post',
          url: './novousuaario',
          headers: {'Content-Type': 'application/json'},
          data : data
        };

        axios(config)
        .then(function (response) {
          nav.novousuario()
          
        })
        .catch(function (error) {
          console.log(error);
        });

}

function removerusuario(id){
  var data = JSON.stringify({
    "idusuario" : id    
  });

        var config = {
          method: 'post',
          url: './removerusuario',
          headers: {'Content-Type': 'application/json'},
          data : data
        };

        axios(config)
        .then(function (response) {
          nav.novousuario()
          
        })
        .catch(function (error) {
          console.log(error);
        });
}