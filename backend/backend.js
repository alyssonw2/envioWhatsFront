import {sock} from './functions/socket/index.js'
sock.on("connect",async dados=>{
console.log(sock.id)
})

sock.on("disconnect",async dados=>{
    console.log(sock.id)
    
})