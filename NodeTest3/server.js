let dgram=require('dgram');
let socket=dgram.createSocket('udp4');
let sockets=[];

let port=13000;
let ip="230.185.192.108";
let ip2="127.0.0.1";
let ip3="229.1.1.229";

socket.bind(port,ip2,()=>{
    socket.setBroadcast(true);
    socket.setMulticastTTL(128);
    socket.addMembership(ip3);
});

socket.on('listening',function(){
    let address = socket.address();
    console.log(`UDP Server listening on ${address.address} : ${address.port}`);
});

socket.on('message',function(message,remote){

    if(message.toString()=="%FirstConnectToServerCHECKTPU5570001")
    {
        socket.send("누군가가 연결함",remote.port,remote.ip,()=>{
             for(let i=0; i<sockets.length; i++)
             {
                  socket.send("누군가가 연결함",sockets[i],remote.ip);
             }
            sockets.push(remote.port);
            console.log(message.toString());
        });
        return;
    }

    let msg=`${remote.address}:${remote.port}--${message}`;
    
    // socket.send(message,0,message.length,remote.port,remote.ip,()=>{
    //     console.log(message); 
    // });
    for(let i=0; i<sockets.length; i++)
    {
        socket.send(message,0,message.length,sockets[i],remote.ip);
    }

    process.stdout.write(msg);
});

socket.on('close',function(){
    console.log('close event');
});