const querystring=require("querystring");
const fs=require('fs');
const jst2js=require('./jst2js');
exports.parseRequest=function(data,mappings)
{
var request={};
request.isClassMapping=false;
request.forwardTo=null;
request.forward=function(forwardToResource)
{
this.forwardTo=forwardToResource;
}
request.isForwarded=function()
{
return this.forwardTo!=null;
}

var str=data.toString();
console.log("--------------------");
console.log(str);
console.log("--------------------");
var splits=str.split('\n');
var firstLine=splits[0];
var w=firstLine.split(" ");
request.error=0;
request.method=w[0].toUpperCase();
request.queryString=null;
request.data={};
if(request.method=="GET")
{
var i=w[1].indexOf("?");
if(i!=-1)
{
request.queryString=w[1].substring(i+1);
request.data=JSON.parse(JSON.stringify(querystring.decode(request.queryString)));
w[1]=w[1].substring(0,i);
}
}
if(request.method=="POST")
{
var lastLine=splits[splits.length-1];
request.queryString=lastLine;
request.data=JSON.parse(JSON.stringify(querystring.decode(request.queryString)));
}

 
if(w[1].startsWith("/private/")||w[1]=="/private")    //checking if accessing private
{
request.error=404;
request.resource=words[1].substring(1);
request.isClientSideTechnologyResource=true;
return request;
}
if(w[1]=="/")
{
request.resource="index.html";
request.isClientSideTechnologyResource=true;
return request;
}
if(w[1].toUpperCase().endsWith(".JST"))
{
if(fs.existsSync(w[1].substring(1)))
{
request.resource=jst2js.prepareJS(w[1].substring(1),request);
request.isClientSideTechnologyResource=false;
}
else
{
request.error=404;
request.resource=w[1];
request.isClientSideTechnologyResource=true;
}
return request;
}
else
{
var secondSlashIndex;
var methodKey;
var e=0;
while(e<mappings.paths.length)
{
if(mappings.paths[e].path==w[1] && mappings.paths[e].resource)
{
request.isClientSideTechnologyResource=false;
request.resource=mappings.paths[e].resource;
return request;
}
if(mappings.paths[e].module && (w[1].startsWith(mappings.paths[e].path+"/") || w[1]==mappings.paths[e].path))
{
console.log("1"); 
if(mappings.paths[e].methods)
{
console.log("2"); 
secondSlashIndex=w[1].indexOf("/",1);
if(secondSlashIndex==-1)
{
methodKey="/";
}
else
{
methodKey=w[1].substring(secondSlashIndex);
console.log(methodKey);
}
if(mappings.paths[e].methods[methodKey])
{
console.log("3"); 

if(mappings.paths[e].module)
{
console.log("4"); 

request.isClientSideTechnologyResource=false;
request.isClassMapping=true;
request.resource=mappings.paths[e].module+".js";
request.serviceMethod=mappings.paths[e].methods[methodKey];
return request;
}
}
}

}


e++;
}
var res=w[1].split("?");
request.resource=res[0].substring(1);
request.isClientSideTechnologyResource=true;
return request;
}
}