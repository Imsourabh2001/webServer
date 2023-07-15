# webServer
34 TMWebProjector
I have created web server for Node JS as per the http protocol. Along with web server also created framework which will help website developers. Web server is binded at port number 8080. 
So, to access our server one need to write in Browser
http://localhost:8080
The response that server will generate should also be protocol specific. As on line 3 we are talking about responseLength. So we should know already about response that we want to send. 
We need to send header whose formate is already decided.
1.	Line 1:- var a=” HTTP/1.1 200 OK\n ”;
	HTTP is a protocol. 
	1.1 is a version.
	200 OK is Response Code
	On every line we need to write \n

2.	Line 2:- a=a+” Content-Type : text/html\n ”; 
	Specifying Content-type (mime-type)

3.	Line 3:- a=a+` Content-Type : ${responseLength}\n `;
	Specifying Content length

4.	Line 4:- a+” \n ”;
	We have mentioned all as per protocol, hence one line gap after actual response.

5.	Line 5:- a+response;
	Actual response

35 Q. Http server is already there then why you have created?
If in future new programming language comes which only contains core functionality and some functions for network programming. We might be one of the first to create http server for that programming language, as we know all aspect and only syntaxtical changes are required.
Http server will be used by web application. 
Web application:- Web application can be defined as a set of programs and data files.
Set of programs:- Some programs runs on client side and some programs get executed on server side.
Data files:- Contains data, images, videos, sound, configuration etc.
Example of facebook login:- 

36
Mime -type :- Not for all the content mime-type will be text/html.
Mime- type for image is different from mime-type of html,css.
To solve that problem there is predefined module that we have used to find mime- type.
For that we run-    npm install mime-types
37. Some analysis has been done and conclusion is that for data transfer we will use figure 1024/4096.
As there are some resource whose processing is to be done on server side. Let request for /abc comes then server should know which resource is to processed. For that we will do url mapping and create conf.json. And all the resource which to be execute on server side are must be in private folder. We will specify same in documentation.
Behaviour of our server is like that, while starting it will load the contents of the conf.json in DS.
First of all data coming from client side is to be parsed. And some how we have to make is available to the server side resource. Which in turn send particular response. 
The one which will use our web server for web development does not need to do parsing and other stuffs.
38
1.	Initially we will load the contents of conf.json for that we have created configuration.js
2.	When request arrives, to process the header of request we have created requestParser.js, which will return the object of type request which contains all necessary details.
3.	Now if the resource for which request came is not available, to handle such cases we need to create errors.js, which will contain function to generate error responses
If client side technology resource we will serve resource, if server side technology we will process resource.











55.
Problems faced by user of web server/flaws in our server(TMWebProjector)

•	User is not being able to send pure html, he always has to wrap html content inside response.write().
•	While trying to access file the path we are specifying is platform specific (./private\\data\\xyz), used only in windows.
•	Even without login, by directly specifying url we are able to access any page.
•	After changing contents in file, show see changes on browser we have to start our server everytime.
•	Browser does not know amount of data that will come, hence it is always staying in wait mode.(response.close()). We need to provide close method to user and specify in documentation after completing their work they need to call close method.
