var nowChatId=0,nowChat=null;//当前显示的聊天
var text = $("#text");
var messagesMap = new Map();//储存消息内容的map
var friendsMap = new Map();//储存联系人列表的arrray
$(function (){
	loadTopMenu(function(data){
		if(data.userid)//如果登陆了
			loadMessages(data.userid);//执行下面加载消息的函数
	});
	loadSendButton();
});
function loadMessages(userid) {//加载消息
	$.post("../message/getMessages",function(data) {
		//console.log(data);//显示消息列表
		//console.log(userid);//显示登陆用户id
		var key,value;//分别是map的key和value,
		var di;//临时变量data[i]
		var messages = $("#messages");//id为messages的div
		var friends = $("#friends");//id为friends的div
		var userlist = new Array();//即将请求的头像-昵称id列表
		userlist.push(userid);//先把当前登陆用户id塞进去
		//↓把收到的消息处理了
		for(var i=0;i<data.length;i++) {
			di = data[i];
			key = di.senderid==userid?di.receiverid:di.senderid;
			nowChatId = key;//同步为最后一个聊天的id
			value = messagesMap.get(key);
			//↓如果还没有和这个人的聊天记录
			var friend;
			if(!value) {
				value = messages.append('<div id="m'+key+'" style="display:none;"></div>').find("#m"+key);//创建新的div
				info = friends.prepend('<tr id="f'+key+'" title="biu~一下"><th><div class="head"><img alt="'+key+'"></a></div><div class="info"><div class="sender"></div><div class="message"></div></div><div class="x-span" title="暂且别过"><span class="glyphicon glyphicon-remove-circle"></span></div></th></tr>').find("#f"+key+">th>.info");
				friends.find("#f"+key).click(function(){openChat(this.id.substr(1))});//绑上打开聊天框的函数
				friends.find("#f"+key+">th>.x-span").click(function(){deleteTalk(this.parentNode.parentNode.id.substr(1))});//绑上删除该对话的函数
				userlist.push(key);//将需要请求头像和用户名的id存进userlist
				friend = {
					sender: info.find(".sender"),
					message: info.find(".message")
				};
				friendsMap.set(key,friend);
			}
			//↑如果还没有和这个人的聊天记录
			//↓在聊天框内添加信息
			value.append('<div class="time">'+toTime(di.time)+'</div>');//插入时间
			if(userid==di.senderid) {//靠右的
				value.append('<div class="piece"><div class="head pull-right"><a href="userinfo.html?userid='+di.senderid+'"><img alt="'+di.senderid+'"></a></div><div class="pull-right"><div class="message">'+di.text+'</div></div></div>');
			} else {//靠左的
				value.append('<div class="piece"><div class="head"><a href="userinfo.html?userid='+di.senderid+'"><img alt="'+di.senderid+'"></a></div><div class="message">'+di.text+'</div></div>');
			}
			//↑在聊天框内添加信息
			//↓好友列表中添加信息
			friendsMap.get(key).message.text(di.text);//更新聊天列表
			//↑好友列表中添加信息
			messagesMap.set(key,value);//刷新map
		}
		//↑把收到的消息处理了
		//console.log(friendsMap);//打印friendsMap
		//console.log(messagesMap);//打印messagesMap
		nowChat = $("#m"+nowChatId);//最初显示的
		nowChat.show();
		//↓把用户名和头像整上
		var fd = new FormData();//创建FormData
		fd.set("userlist",userlist);
		$.ajax({
			url: "../message/getHeadsAndUsernames",
			type: "POST",
			processData: false,
			contentType: false,
			data: fd,
			success: function(data) {
				//console.log(data);//显示用户id,用户名,对应的头像文件名
				//↓把头像整上
				$("img").attr("src",function(){
					var a = data[this.alt];//alt是userid
					return "../data/head/"+a[2];
				});
				//↑把头像整上
				//↓把用户名整上
				friendsMap.forEach(function(value,key) {//循环遍历联系人列表
					//console.log("key",key,"value",value);//输出联系人列表
					var a = data[key];
					value.sender.text(a[1]);//a[1]是用户名
				});
				//↑把用户名整上
			}
		});
		//↑把用户名和头像整上
	});
};
function openChat(userid) {//展开消息
	nowChat.hide();
	nowChatId = userid;//更新消息
	nowChat = $("#m"+userid);
	nowChat.show();
};
function loadSendButton() {//给发送按钮绑定
	$("#send").click(function() {
		var fd = new FormData();//创建FormData
		fd.set("receiverid",nowChatId);
		fd.set("text",text.val());
		$.ajax({
			url: "../message/sendMessage",
			type: "POST",
			processData: false,
			contentType: false,
			data: fd,
			success: function(data) {
				//console.log(data);//显示消息id
				alert("发送成功");
				text.val("");
				location.reload();
			}
		});
	});
}
function deleteTalk(theotherid) {//删除消息
	var fd = new FormData();//创建FormData
	fd.set("theotherid",theotherid);
	$.ajax({
		url: "../message/deleteMessage",
		type: "POST",
		processData: false,
		contentType: false,
		data: fd,
		success: function(data) {
			//console.log(data);//显示修改的条数
			$("#f"+theotherid+",#m"+theotherid).remove();//同时匹配两个,然后删除
		}
	});
}
function toTime(nS) {//时间戳转化为时间
	return new Date(parseInt(nS)).toLocaleString().replace(/年|月/g,"-").replace(/日/g," ");
};