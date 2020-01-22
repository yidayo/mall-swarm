var userid = 0;
var myid = 0;
$(function (){
	userid = GetQueryString("userid");
	loadTopMenu(function(data) {
		myid = data.userid;//发消息用的
	});
	loadIntroduce();
	loadLihui();
	loadBook();
	loadLove();
	loadComment(1);
});
function loadIntroduce() {
	$.post("../userinfo/getOtherinfo",{
		userid: userid
	},function(data) {
		//console.log(data);//显示个人信息
		var introduce = $("#introduce");
		introduce.find("div:first>div>img").attr("src","../data/head/"+data.img);
		introduce.find("div:nth-child(2)>h1").text(data.username);
		var idp = introduce.find("p:nth-child(2)").text("用户id:"+addZero(data.userid));
		introduce.find("p:nth-child(3)").text(data.introduce);
		console.log(myid);
		if(myid!=undefined&&userid!=myid) {//如果登陆了,且不是同一个人
			receiverid = userid;//发消息用的
			receivername = data.username;//发消息用的
			idp.after('<a class="btn btn-default btn-xs" style="margin-left:20px;" onclick="sendMessageModal()">发消息</a>');//不是同一个人就允许发消息
		}
	});
};
function loadLihui() {
	//先预留
};
function loadBook() {
	$.post("../userinfo/getOthersBook",{
		userid: userid
	},function(data) {
		//console.log(data);//显示该用户的作品
		var book = $("#book");
		if(data.length==0) {
			book.append('<div><h4 class="text-center">还没有发布作品</h4></div>');
			return;
		}
		var di;
		for(var i=0;i<data.length;i++) {
			di = data[i];
			book.append('<div class="col-md-3 col-xs-6"><a href="story.html?bookid='+di.bookid+'"><img src="../data/bookimg/'+di.img+'"></a><p>'+di.bookname+'</p></div>');
		}
	});
};
function loadLove() {
	$.post("../userinfo/getOthersLove",{
		userid: userid
	},function(data) {
		//console.log(data);//显示该用户收藏的作品(公开的作品)
		var love = $("#love");
		if(data.length==0) {
			love.append('<div><h4 class="text-center">还没有公开收藏的作品</h4></div>');
			return;
		}
		var di;
		for(var i=0;i<data.length;i++) {
			di = data[i];
			love.append('<div class="col-md-3 col-xs-6"><a href="story.html?bookid='+di.bookid+'"><img src="../data/bookimg/'+di.img+'"></a><p>'+di.bookname+'</p></div>');
		}
	});
};
function loadComment(pageIndex) {//每页五条
	$.post("../userinfo/getOthersComment",{
		userid: userid,
		pageIndex: pageIndex,
		pageSize: 5
	},function(data) {
		//console.log(data);//显示评论
		var comment = $("#comment");
		if(data.length==0) {
			comment.append('<div><h4 class="text-center">ta不曾发表过评论</h4></div>');
			return;
		}
		var di;
		for(var i=0;i<data.length;i++) {
			di = data[i];
			comment.append('<div class="row"><div class="col-md-2 col-xs-4"><a href="story.html?bookid='+di[0]+'"><img src="../data/bookimg/'+di[8]+'"></a></div><div class="col-md-7 col-xs-8"><p>'+di[1]+'</p><p class="lead">'+di[11]+'</p><p>'+toTime(di[12])+'</p></div></div>');
		}
	});
};
function addZero(num) {
	var longNum = "00000000"+num;
	return longNum.slice(-8);
}
function GetQueryString(name) {//地址栏获取参数
	var reg = new RegExp("(^|&)"+ name +"=([^&]*)(&|$)");
	var r = window.location.search.substr(1).match(reg);
	if(r!=null)return unescape(r[2]); return null;
};
function loseImg(img) {//图片加载失败
	img.src="../img/errorhead.jpg";  
	img.onerror=null;//控制不要一直跳动 
}
function toTime(nS) {//时间戳转化为时间
	return new Date(parseInt(nS)).toLocaleString().replace(/年|月/g,"-").replace(/日/g," ");
};