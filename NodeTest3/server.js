let dgram=require('dgram');
let socket=dgram.createSocket('udp4');
let sockets=[];
let disconnectedIndex=[];

let port=13000;
let ip="230.185.192.108";
let ip2="127.0.0.1";
let ip3="229.1.1.229";

const contCode="%FirstConnectToServerCHECKTPU5570001";
const contCode2="%FirstConnectToServerCHECKTPU55700012";
const posCode="%PlayerPositionAsyn677RTV_+";
const discnCode="%PlayerDisCnt5Y9O";
const otherCode="%YDOTHER-";

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

    if(message.toString()==contCode)
    {
        socket.send(`누군가가 연결함|${contCode}|${sockets.length}`,remote.port,remote.ip,()=>{
             for(let i=0; i<sockets.length; i++)
             {
                  socket.send(`누군가가 연결함|${contCode2}|${sockets.length}`,sockets[i],remote.ip);
             }
            sockets.push(remote.port);
            console.log(message.toString());
        });
        return;
    }
    else if(message.toString().split('|')[0]==discnCode)
    {
        for(let i=0; i<sockets.length; i++)
        {
            socket.send("누군가가 연결을 끊음",sockets[i],remote.ip);
        }
        for(let i=0; i<sockets.length; i++)
        {
            socket.send(message,sockets[i],remote.ip);
        }
        for(let i=0; i<sockets.length; i++)
        {
            if(sockets[i]==remote.port)
            {
                disconnectedIndex.push(i);
            }
        }
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