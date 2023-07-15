const fs=require('fs');
const path=require('path');
const jst2js=require('./jst2js');
const net=require('net');
const mimeTypes=require("mime-types");
const configuration=require('./configuration');
const errors=require('./errors');
const requestParser=require("./requestParser");
var mappings=configuration.getConfiguration();
function Response(socket)
{
this.responseInitiated=false;
this.contentType="text/html";
this.isClosed=false;
this.$$$socket=socket;
this.setContentType=function(str)
{
this.contentType=str;
}
this.close=function()
{
if(this.isClosed)return;
socket.end();
this.isClosed=true;
}
this.write=function(data)
{
if(this.responseInitiated==false)
{
this.$$$socket.write("HTTP/1.1 200 OK\n");
this.$$$socket.write(new Date().toGMTString()+"\n");
this.$$$socket.write("Server: TMWebProjector\n");
this.$$$socket.write("Content-Type: "+this.contentType+"\n");
this.$$$socket.write("Connection: close\n");
this.$$$socket.write("\n");
this.responseInitiated=true;
}
this.$$$socket.write(data);
}
}

function serveResource(socket,resource)
{
console.log("Resource to server : "+resource);
if(!fs.existsSync(resource))
{
errors.send404(socket,resource);
return;
}
var data=fs.readFileSync(resource,"utf-8");
var header="HTTP/1.1 200 OK\n";
header=header+`Content-Type: ${mimeTypes.lookup(resource)}\n`;
header=header+`Content-Length: ${data.length}\n`;
header=header+"\n";
var response=header+data;
socket.write(response);
}

var httpServer=net.createServer(function(socket){
socket.on('data',function(data){
var request=requestParser.parseRequest(data,mappings);
console.log(JSON.stringify(request));
while(true)
{
request.forwardTo=null;
if(request.error!=0) 
{
errors.processError(request.error,socket,request.resource);
return;
}
if(request.isClientSideTechnologyResource)
{
serveResource(socket,request.resource);
return;
}
else
{
console.log("Server side technology "+request.resource+" will be processed");
var absolutePath=path.resolve("./private/"+request.resource);
delete require.cache[absolutePath];
const service=require('./private/'+request.resource);

if(request.isClassMapping)
{
var resultJSON;
var requestData=request.data;
var obj=new service();    //creating object of class
resultJSON=obj[request.serviceMethod](requestData);
if(resultJSON)
{
if(resultJSON.forward)
{
request.isClientSideTechnologyResource=true;
if(resultJSON.forward=='/private' || resultJSON.forward=='/private/')
{
request.error=500;
}
else if(resultJSON.forward=='/')
{
request.resource="index.html";
}
else if(resultJSON.forward.toUpperCase().endsWith(".JST"))
{
if(fs.existsSync(resultJSON.forward.substring(1)))
{
request.resource=jst2js.prepareJS(resultJSON.forward.substring(1),request);
request.isClientSideTechnologyResource=false;
}
else
{
request.error=404;
request.resource=resultJSON.forward;
}
}
else
{
var secondSlashIndex;
var methodKey;
var e=0;
while(e<mappings.paths.length)
{
console.log("1");
if(mappings.paths[e].path==resultJSON.forward && mappings.paths[e].resource)
{
request.isClientSideTechnologyResource=false;
request.resource=mappings.paths[e].resource;
break;
}
if(mappings.paths[e].module && (resultJSON.forward.startsWith(mappings.paths[e].path+"/") || resultJSON.forward==mappings.paths[e].path))
{
if(mappings.paths[e].methods)
{
secondSlashIndex=resultJSON.forward.indexOf("/",1);
if(secondSlashIndex==-1)
{
methodKey="/";
}
else
{
methodKey=resultJSON.forward.substring(secondSlashIndex);
}
if(mappings.paths[e].methods[methodKey])
{
if(mappings.paths[e].module)
{
console.log("++++++++++++++++++++++++++++++");
request.isClientSideTechnologyResource=false;
request.isClassMapping=true;
request.resource=mappings.paths[e].module+".js";
request.serviceMethod=mappings.paths[e].methods[methodKey];
break;
}
}
}
}
e++;
}
}
if(request.isClientSideTechnologyResource)
{
// some codee
request.resource=resultJSON.forward.substring(1);
}
continue;
}
var response=new Response(socket);
response.setContentType("application/json");
response.write(JSON.stringify(resultJSON));
response.close();
} //resultJSON processing part ends
// some code here
break;
}


service.processRequest(request,new Response(socket));
if(request.isForwarded()==false) return;
var forwardTo=request.forwardTo;
request.isClientSideTechnologyResource=true;
if(forwardTo=="/private"||forwardTo.startsWith("/private/")||forwardTo.startsWith("private/"))
{
request.error=500;
}
else if(forwardTo=="/")
{
request.resource="index.html";
}else
if(forwardTo.toUpperCase().endsWith(".JST"))
{
if(fs.existsSync(forwardTo))
{
request.resource=jst2js.prepareJS(forwardTo,request);
request.isClientSideTechnologyResource=false;
}
else
{
request.error=404;
request.resource=forwardTo;
}
}
else
{
var e=0;
while(e<mappings.paths.length)
{
if(mappings.paths[e].path=="/"+forwardTo)
{
request.resource=mappings.paths[e].resource;
request.isClientSideTechnologyResource=false;
break;
}
e++;
}
} //else part ends here
if(request.isClientSideTechnologyResource)
{
request.resource=forwardTo;
}
}
}// infinite loop ends here
});
socket.on('end',function(){
console.log("Connection closed by client");
});
socket.on('error',function(){
console.log("Some error on client side");
});
});
httpServer.listen(8080,'localhost');
console.log("Server is ready to listen at port number : 8080");
