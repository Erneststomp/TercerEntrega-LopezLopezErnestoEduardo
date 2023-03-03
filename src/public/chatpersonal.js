const socket=io(
    {autoConnect:false}
);
var userDataLabel = document.getElementById('namelabel'); // selecciona el elemento label
var userData = userDataLabel.getAttribute('value');

    userName=userData
    socket.connect();
    socket.emit('messagereq')
    socket.emit('Charreq')


  
let user;
let messagechat=[]

const ChatBox = document.getElementById('mymessage')
ChatBox.addEventListener('keyup',evt=>{ 
    if(evt.key==="Enter"){
        if(ChatBox.value.trim().length>0){
            const currentDate =new Date().toLocaleString()
            socket.emit('message',{user:userName,message:ChatBox.value, date:currentDate})
            ChatBox.value=''
        }
    }
})

socket.on('log',data=>{
    let log=document.getElementById('log_chat')
    let messages=''
    for(let i=0;i<data.length;i++){
        messages=messages+`<div style="display:inline-flex"><p style="color:brown"> ${data[i].date} </p> <p style="color:blue; font-weight:bold"> ${data[i].user} </p> <p style="font-style: italic;color:green"> ${data[i].message}</p></div><br>`
    }

    log.innerHTML=messages;
    
})

