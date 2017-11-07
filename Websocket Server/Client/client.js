var userName = localStorage.getItem("userName");
var vSubscribe = localStorage.getItem("chat");
var vLocation = localStorage.getItem("location");
var log = "";
var vURL = window.location.href
vURL = vURL.substr(vURL.indexOf("://")+3,vURL.length);
vURL = vURL.substr(0,vURL.indexOf(":"));
var sock = new WebSocket("ws://"+vURL+":5001");
// var sock = new WebSocket("ws://192.168.2.129:5001");

function joinDemo()
{
	userName = document.getElementById("txtUserName").value;
	vLocation = document.getElementById("DDLocation").value;
	vSubscribe = document.getElementById("DDChat").value;
	if(userName == "" || userName == "null" || userName == null || userName == "undefined" || userName == undefined)
	{
		alert("Please Enter Username.")
		return;
	}
	window.location.href = "/home.html";
}
sock.onerror = function()
{
}
sock.onopen = function()
{
	if(sock.readyState === sock.OPEN)
	{
		sock.send(JSON.stringify({type:"name",data:userName,subscribe:vSubscribe,location:vLocation}));
	}
}
sock.onmessage = function(event)
{
	var json = JSON.parse(event.data);
	// if(json.type == "chat")
	// {
		// log.innerHTML += "<b>"+json.name+":</b> <i>"+json.data+"</i><br>";
		// log.scrollTop = log.scrollHeight;
	// }
	if(json.type == "chat")
	{
		var usr = json.data.substr(0,json.data.indexOf(":"));
		if(usr == userName)
		{
			usr = "You";
		}
		var msg = json.data.substr(json.data.indexOf(":")+2,json.data.length);
		log.innerHTML += "<b>"+usr+":</b> <i>"+msg+"</i><br>";
		log.scrollTop = log.scrollHeight;	
	}
	else if(json.type == "setup")
	{
		document.querySelector("button").onclick = function(){
			if(sock.readyState === sock.CLOSING || sock.readyState === sock.CLOSED)
			{
				log.innerHTML += "<i style='color: red;'>Connection to server lost...trying to reconnect.</i><br>";
				return;
			}
			var text = document.getElementById("txt").value;
			if(text == "")
				return;
			sock.send(JSON.stringify({type:"message",data:text}));
			
			// log.innerHTML += "<b>You: </b><i>"+text+"</i><br>";
			log.scrollTop = log.scrollHeight;
			document.getElementById("txt").value = "";
		};
		
		document.getElementById("txt").addEventListener("keyup", function(event) 
		{
			event.preventDefault();
			if (event.keyCode == 13)
			{
				document.getElementById("btnSend").click();
			}
		});
		log = document.getElementById("log");
		if(vSubscribe == "No")
		{
			document.getElementById("btnSend").style.visibility = "hidden";
			document.getElementById("txt").style.visibility = "hidden";
		}
		userNm.innerHTML = "<center><h3><b>User Name : "+userName+"</b></h3></center>";
	
		document.getElementById("curr1_lbl").innerHTML = json.curr1;
		document.getElementById("curr2_lbl").innerHTML = json.curr2;
		
		if(vSubscribe == "Yes")
		{
			var msgArr = ""+json.chatHistory;
			msgArr = msgArr.split(",");
			for(var i=msgArr.length-1 ; i>=0 ; i--)
			{
				var singleMsg = msgArr[i].split(":");
				if(singleMsg[0] == userName)
				{
					singleMsg[0] = "You"
				}
				log.innerHTML += "<b>"+singleMsg[0]+": </b><i>"+singleMsg[1]+"</i><br>";
				log.scrollTop = log.scrollHeight;
			}
		}		
	}
	else
	{
		var vRate = json.data.split("#");
		if(json.name == "USDINR")
		{
			document.getElementById("usdinr_buy").innerHTML = vRate[0]||"NA";
			document.getElementById("usdinr_sell").innerHTML = vRate[1]||"NA";
		}
		else
		{
			document.getElementById(json.curr_place+"_buy").innerHTML = vRate[0]||"NA";
			document.getElementById(json.curr_place+"_sell").innerHTML = vRate[1]||"NA";			
		}	
	}
};