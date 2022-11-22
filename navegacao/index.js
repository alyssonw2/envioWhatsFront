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

nav.conexao()
