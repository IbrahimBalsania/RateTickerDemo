var redis = require('redis');
var pub = redis.createClient();
var redisClient = redis.createClient({host: process.env.REDIS_HOST || '127.0.0.1'});
var randomNum = "";
var a = true;
var vCnt = 0;

var USDINR = 64.13

// Location : India
var EURINR = 76.63
var AEDINR = 17.46

// Location : Singapore
var USDSGD = 1.35
var EURSGD = 1.61

// Location : Dubai
var USDAED = 3.67
var EURAED = 4.39

var vBuy = 0;
var vSell = 0;
var SellMrg = 0.3;

redisClient.on('error',function(error)
{
	console.log("START : "+error);
});
pub.on('error',function(error)
{
	console.log("Error while creating the rate feed connection : "+error);
});
redisClient.on('ready',function(error)
{
	while(a)
	{
		console.log("##############################	START	##############################");
		vCnt+=1;
		
		if(vCnt > 5)
		{
			redisClient.ltrim('USDINR',0,1, function(error, value){});
			redisClient.ltrim('EURINR',0,1, function(error, value){});
			redisClient.ltrim('AEDINR',0,1, function(error, value){});
			redisClient.ltrim('USDSGD',0,1, function(error, value){});
			redisClient.ltrim('EURSGD',0,1, function(error, value){});
			redisClient.ltrim('USDAED',0,1, function(error, value){});
			redisClient.ltrim('EURAED',0,1, function(error, value){});
		}
		
		randomNum = "0."+Math.floor(1000 + Math.random() * 9000);
		randomNum = randomNum.substr(0,6);
		vBuy = parseFloat(USDINR) + parseFloat(randomNum);
		vBuy = vBuy.toString();
		vBuy = vBuy.substr(0,7);
		vSell = parseFloat(USDINR) + parseFloat(randomNum) + parseFloat(SellMrg);
		vSell = vSell.toString();
		vSell = vSell.substr(0,7);
		pub.publish("USDINR", vBuy+"#"+vSell);
		redisClient.lpush(['USDINR',vBuy+"#"+vSell], function(error, value){});
		
		vBuy = parseFloat(EURINR) + parseFloat(randomNum);
		vBuy = vBuy.toString();
		vBuy = vBuy.substr(0,7);
		vSell = parseFloat(EURINR) + parseFloat(randomNum) + parseFloat(SellMrg);
		vSell = vSell.toString();
		vSell = vSell.substr(0,7);
		pub.publish("EURINR", vBuy+"#"+vSell);
		redisClient.lpush(['EURINR',vBuy+"#"+vSell], function(error, value){});
		
		vBuy = parseFloat(AEDINR) + parseFloat(randomNum);
		vBuy = vBuy.toString();
		vBuy = vBuy.substr(0,7);
		vSell = parseFloat(AEDINR) + parseFloat(randomNum) + parseFloat(SellMrg);
		vSell = vSell.toString();
		vSell = vSell.substr(0,7);
		pub.publish("AEDINR", vBuy+"#"+vSell);
		redisClient.lpush(['AEDINR',vBuy+"#"+vSell], function(error, value){});
		
		vBuy = parseFloat(USDSGD) + parseFloat(randomNum);
		vBuy = vBuy.toString();
		vBuy = vBuy.substr(0,7);
		vSell = parseFloat(USDSGD) + parseFloat(randomNum) + parseFloat(SellMrg);
		vSell = vSell.toString();
		vSell = vSell.substr(0,7);
		pub.publish("USDSGD", vBuy+"#"+vSell);
		redisClient.lpush(['USDSGD',vBuy+"#"+vSell], function(error, value){});
		
		vBuy = parseFloat(EURSGD) + parseFloat(randomNum);
		vBuy = vBuy.toString();
		vBuy = vBuy.substr(0,7);
		vSell = parseFloat(EURSGD) + parseFloat(randomNum) + parseFloat(SellMrg);
		vSell = vSell.toString();
		vSell = vSell.substr(0,7);
		pub.publish("EURSGD", vBuy+"#"+vSell);
		redisClient.lpush(['EURSGD',vBuy+"#"+vSell], function(error, value){});
		
		vBuy = parseFloat(USDAED) + parseFloat(randomNum);
		vBuy = vBuy.toString();
		vBuy = vBuy.substr(0,7);
		vSell = parseFloat(USDAED) + parseFloat(randomNum) + parseFloat(SellMrg);
		vSell = vSell.toString();
		vSell = vSell.substr(0,7);
		pub.publish("USDAED", vBuy+"#"+vSell);
		redisClient.lpush(['USDAED',vBuy+"#"+vSell], function(error, value){});
		
		vBuy = parseFloat(EURAED) + parseFloat(randomNum);
		vBuy = vBuy.toString();
		vBuy = vBuy.substr(0,7);
		vSell = parseFloat(EURAED) + parseFloat(randomNum) + parseFloat(SellMrg);
		vSell = vSell.toString();
		vSell = vSell.substr(0,7);
		pub.publish("EURAED", vBuy+"#"+vSell);
		redisClient.lpush(['EURAED',vBuy+"#"+vSell], function(error, value){});
		
		for(var i=0; i<1500000000; i++){}
		console.log("##############################	END	##############################");
	}
});
// redisClient.on('error',function(error)
// {
	// console.log("redisClient : "+error);
// });