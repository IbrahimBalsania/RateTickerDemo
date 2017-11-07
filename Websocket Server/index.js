var server = require('ws').Server;
var s = new server({port:5001});
var redis = require('redis');
var sub = redis.createClient();
var pub = redis.createClient();
var redisClient = redis.createClient({host: process.env.REDIS_HOST || '127.0.0.1'});
var count = 0;
var vChatHistory = ""
var express = require('express');
var app = express();
var ser = app.listen(4000,function(){
	console.log('Listening to request at port 4000');
	app.use(express.static('Client'));

	s.on('connection',function(ws)
	{
		ws.on('message',function(message)
		{
			message = JSON.parse(message);
			if(message.type == "name")
			{
				ws.personName = message.data;
				ws.subscribe = message.subscribe;
				if(message.subscribe == "Yes")
				{
					if(ws.personName == message.data)
					{						
						sub.subscribe("msgWithIDPub");
					}
					
				}
				sub.subscribe("USDINR");
				if(message.location == "India")
				{
					sub.subscribe("EURINR");
					sub.subscribe("AEDINR");
					ws.curr1 = "EURINR";
					ws.curr2 = "AEDINR";
				}
				else if(message.location == "Dubai")
				{
					sub.subscribe("USDAED");
					sub.subscribe("EURAED");
					ws.curr1 = "USDAED";
					ws.curr2 = "EURAED";
				}
				else if(message.location == "Singapore")
				{
					sub.subscribe("USDSGD");
					sub.subscribe("EURSGD");
					ws.curr1 = "USDSGD";
					ws.curr2 = "EURSGD";
				}
				if(ws.personName == message.data)
				{
					redisClient.lrange('msgWithID', 0, 10, function(error, value) 
					{
						vChatHistory = "";
						console.log("History : "+value)
						vChatHistory = value;
						console.log("vChatHistory : "+vChatHistory)
						ws.send(JSON.stringify({type:"setup",curr1:ws.curr1,curr2:ws.curr2,chatHistory:vChatHistory}));
					});
					return;
				}
			}
			s.clients.forEach(function e(client)
			{
				if(client == ws)
				{
					redisClient.lpush(['msg',message.data], function(error, value)
					{
						console.log("List set : "+value);
					});
					redisClient.lpush(['msgWithID',ws.personName+": "+message.data], function(error, value)
					{
						console.log("List with ID : "+value);
					});
					pub.publish("msgWithIDPub",ws.personName+": "+message.data);
					pub.on("error", function(e) {
						console.log("PUB CATCH : "+e);
					});
				}
				else
				{
					if(client.subscribe == "Yes")
					{
						redisClient.lrange('msg', 0, 0, function(error, value) 
						{
							console.log("List get : "+value);
						});
					}				
				}
			});
		});
		sub.on("message", function(curr, rate) {
			try
			{
				// if(ws.connStatus != "InActive")
				if(ws.readyState === ws.OPEN)
				{
					if(curr == "USDINR")
					{
						ws.send(JSON.stringify({type:"rate",name:curr,data:rate}));
					}
					else if(curr == ws.curr1)
					{
						ws.send(JSON.stringify({type:"rate",name:curr,data:rate,curr_place:"curr1"}));
					}
					else if(curr == ws.curr2)
					{
						ws.send(JSON.stringify({type:"rate",name:curr,data:rate,curr_place:"curr2"}));
					}
					else if(curr == "msgWithIDPub")
					{
						if(ws.subscribe == "Yes")
						{
							ws.send(JSON.stringify({type:"chat",name:curr,data:rate}));
						}
					}
				}
			}
			catch(e)
			{
				ws.connStatus = "InActive";
				ws.close();
				console.log("CATCH : "+ws.personName)
			}		
		});
		sub.on("error", function(error) {
			console.log("SUB CATCH : "+error);
		});
		ws.on("close",function(){
			ws.connStatus = "InActive";
			count--;
			console.log("I lost a Client.");
			if(count <= 0)
			{
				sub.unsubscribe("msgWithIDPub");
				sub.unsubscribe("USDINR");
				sub.unsubscribe(ws.curr1);
				sub.unsubscribe(ws.curr2);
				
				console.log("No Active User.");
			}
		});
		ws.on("error",function(error){
			console.log("WS ERROR.");
		});
		count++;
		console.log("One more client connected.");
		
		// sub.on("message", function(curr, rate) {
			// // console.log("Rate : '" + rate + "' - curr '" + curr + "'")
			// s.clients.forEach(function e(client){
				// if(curr == "USDINR")
				// {
					// client.send(JSON.stringify({type:"rate",name:curr,data:rate}));
				// }
				// else if(curr == client.curr1)
				// {
					// client.send(JSON.stringify({type:"rate",name:curr,data:rate,curr_place:"curr1"}));
				// }
				// else if(curr == client.curr2)
				// {
					// client.send(JSON.stringify({type:"rate",name:curr,data:rate,curr_place:"curr2"}));
				// }
				// else if(curr == "msgWithIDPub")
				// {
					// if(client.subscribe == "Yes")
					// {
						// client.send(JSON.stringify({type:"chat",name:curr,data:rate}));
					// }
				// }		
			// });
		// });
	});
	
	s.on('error',function(error)
	{
		console.log("Errror Server : "+error);
		if (error.code !== 'ECONNRESET') {
        // Ignore ECONNRESET and re throw anything else
        throw error
		}
	});
	sub.on('error',function(error)
	{
		console.log("SUB : "+error);
	});
	pub.on('error',function(error)
	{
		console.log("PUB : "+error);
	});
	redisClient.on('error',function(error)
	{
		console.log("RedisClient 222222222222222222222222: "+error);
	});
	redisClient.on('ready',function(error)
	{
		console.log("Redis server connected.");
	});
});

ser.on('error',function(error)
{
	console.log("Errror Server : "+error);
	if (error.code !== 'ECONNRESET') {
	console.log("SER : "+error);
	throw error
	}
});
