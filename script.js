var currentdate = new Date();
var id=currentdate.getDay() + currentdate.getMonth() + currentdate.getFullYear() + currentdate.getHours() + currentdate.getMinutes() + currentdate.getSeconds() + currentdate.getMilliseconds();
function send_data(text,cursor,id){
	var msg = {
		cursor: cursor,
		text: text,
		id:id,
		type:"usermsg"
		};
		if(text != undefined && cursor != undefined)
		websocket.send(JSON.stringify(msg));
};
$(document).ready(function(){
	var wsUri = "ws://localhost:9000/chat/server.php"; 	
	websocket = new WebSocket(wsUri); 
	websocket.onopen = function(ev) { 
		$('#messagebox').append("<div class=\"system_msg\">Connected!</div>"); //notify user
	}
	var cursor;
	$('textarea').keydown(function(e){
		cursor = $('textarea').prop("selectionStart");
		if(e.keyCode==8){
			send_data('*/**backspace**\\*',cursor,id);
		}
	});
	$('textarea').keypress(function(e){
		var text=String.fromCharCode(e.which);
		send_data(text,cursor,id);
	});

	//#### Message received from server?
	websocket.onmessage = function(ev) {
		var msg = JSON.parse(ev.data);
		var type = msg.type;
		var text = msg.text; 
		var tcursor = msg.cursor; 
		var tid = msg.id;
		if(type != "system")
			$('#messagebox').append(tid + "  " + type+"  "+tcursor+"  "+text+'<br>');
		else
			$('#messagebox').append(type+"  "+text+'<br>');
		if(tid!=id && type=="usermsg")
		{
			var finaltext;
			var input=$('textarea').val();
			var before=input.substr(0,tcursor);
			var after=input.substr(tcursor,input.length);
			if (text=="*/**backspace**\\*") {
				before=input.substr(0,tcursor-1);
				finaltext=before+after;
			}
			else
				finaltext=before+text+after;
			$('textarea').val(finaltext);
		}	
	};
	
	websocket.onerror	= function(ev){$('#messagebox').append("<div class=\"system_error\">Error Occurred - "+ev.data+"</div>");}; 
	websocket.onclose 	= function(ev){$('#messagebox').append("<div class=\"system_msg\">Connection Closed</div>");}; 
});