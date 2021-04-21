let net=require('net');
let sockets=[];
let port=12000;
let remoteHost="127.0.0.1";
let remotePort=12000;

let server=net.createServer(function(socket){
    socket.name=socket.remoteAddress+":"+socket.remotePort;
    
    sockets.push(socket);

    console.log(socket.name+ " joined to broadcasr.");

    //socket.write("HI");

    socket.on('end',function(){
        sockets.splice(sockets.indexOf(socket),1);
    });

    socket.on('error',function(error){
        console.log('Socket got problems: ',error.message);
    });

    socket.on('data',function(data){
        for(let i=0; i<sockets.length; i++)
        {
            sockets[i].write(data.toString());
        }
        process.stdout.write(data.toString());
    })
    
});

server.on('error',function(error){
    console.log("So we got problems!",error.message);
});

let serviceSocket=net.connect(parseInt(remotePort),remoteHost,()=>{
    console.log("Connected to remote");
});

serviceSocket.on("data",function(data){
    if(sockets.length===0)
       return;
});


server.listen(port,function(){
    console.log("Server listening at localhost:"+port);
})