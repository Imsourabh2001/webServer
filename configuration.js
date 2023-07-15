const fs=require('fs');
exports.getConfiguration=function(){
if(fs.existsSync("conf.json"))
{
var JSONString=fs.readFileSync("conf.json");
return JSON.parse(JSONString)
}
else
{
return JSON.parse('{"paths":[]}');
}

}