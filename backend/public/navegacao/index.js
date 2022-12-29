const getHTML = async (url)=>{
    let h = await axios.get(url)
    return h.data
}

const nav = {
    async login(){
        document.querySelector("app").innerHTML = await getHTML('./assets/paginas/login')
    },
    async logout(){
        document.querySelector("app").innerHTML = await getHTML('./assets/paginas/logout')
    },
    async conexao(){
        document.querySelector("app").innerHTML = await getHTML('./assets/componentes/navbar')
        document.querySelector("app").innerHTML += await getHTML('./assets/componentes/offcanvasModalLoading')
        document.querySelector("app").innerHTML += await getHTML('./assets/paginas/conexao')
        setTimeout(() => {
            start()
            if(document.querySelector("#closemodal")){
                document.querySelector("#closemodal").click()
            }
           }, 1000);
    },
    async enviados(){
        document.querySelector("app").innerHTML = await getHTML('./assets/componentes/navbar')
        document.querySelector("app").innerHTML += await getHTML('./assets/componentes/offcanvasModalLoading')
        document.querySelector("app").innerHTML += await getHTML('./assets/paginas/enviados')
    },
    async relatorio(){
        document.querySelector("app").innerHTML = await getHTML('./assets/componentes/navbar')
        document.querySelector("app").innerHTML += await getHTML('./assets/componentes/offcanvasModalLoading')
        document.querySelector("app").innerHTML += await getHTML('./assets/paginas/relatorio')
    },
    async whatsappvalidos(){

        const file = document.getElementById('FileImagem').files[0];
        let mensagem = document.querySelector("textarea").value
        let delayMessage = document.querySelector("#delaymessage").value 
        let datahorainicio = document.querySelector("#datahorainicio").value
        
        let base64img = ''
        if(file?.name != undefined){
            base64img = await GetBase64IMG()
        }
        localStorage.datahorainicio = datahorainicio
        localStorage.mensagemImage_base64img =  base64img
        localStorage.mensagemText = mensagem
        localStorage.mensagemImgName = file?.name
        localStorage.mensagemDelay = delayMessage

        document.querySelector("app").innerHTML = await getHTML('./assets/componentes/navbar')
        document.querySelector("app").innerHTML += await getHTML('./assets/componentes/offcanvasModalLoading')
        document.querySelector("app").innerHTML += await getHTML('./assets/paginas/whatsValidos')
    },
    async validarWhatsapp(){
        document.querySelector("app").innerHTML = await getHTML('./assets/componentes/navbar')
        document.querySelector("app").innerHTML += await getHTML('./assets/componentes/offcanvasModalLoading')
        document.querySelector("app").innerHTML += await getHTML('./assets/paginas/validarWhatsapp')
    },
    async criarMensagem(){
        document.querySelector("app").innerHTML = await getHTML('./assets/componentes/navbar')
        document.querySelector("app").innerHTML += await getHTML('./assets/componentes/offcanvasModalLoading')
        document.querySelector("app").innerHTML += await getHTML('./assets/paginas/criarMensagem')
    }

}

nav.logout()
