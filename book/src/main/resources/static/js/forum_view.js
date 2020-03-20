var commentNum = 0;//回复数
var forumid = 0;
$(function(){
	loadTopMenu("forum",function(data) {
		//console.log(data);//显示用户信息
		if(data.userid) {//如果登陆了
			$("#modal").append('<button type="button" class="btn btn-primary" data-toggle="modal" data-target=".bs-example-modal-lg">发篇帖子~?</button>');
		} else {//如果没登陆
			$("#modal").append('<a type="button" class="btn btn-primary" href="login.html">登陆才能发帖~</a>');
		}
	});
	forumid = GetQueryString("forumid");
	$.post("../../forum/getForumsReplyNum?forumid="+forumid,function(data) {
		//consol.log(data);//这篇帖子的回复数
		commentNum = data;
		getComment(1,10,commentNum);//获取回复
	});
	send();
})
function getComment(pageIndex,pageSize,commentNum) {//pageIndex为当前页,一页pageSize条,一共commentNum条
	var i=pageIndex,s=pageSize,n=commentNum;
	//↓操作#page-box
	var pageNum = Math.ceil(n/s);//一共pageNum页
	var b = $("#page-box");//插入页码的地方
	b.empty();
	if(i!=1) {
		bAppend(b,(i-1),s,n,"上一页");
		bAppend(b,1,s,n,"1");
	}
	if(i<=5) {
		for(var j=2;j<i;j++)
			bAppend(b,j,s,n,j);
		b.append('<span class="current">'+i+'</span>');
	} else {
		b.append('<span class="pages">...</span>');
		for(var j=i-2;j<i;j++)
			bAppend(b,j,s,n,j);
		b.append('<span class="current">'+i+'</span>');
	}
	if(pageNum-i<5) {
		for(var j=i+1;j<pageNum;j++)
			bAppend(b,j,s,n,j);
	} else {
		for(var j=i+1;j<i+3;j++)
			bAppend(b,j,s,n,j);
		b.append('<span class="pages">...</span>');
	}
	if(i!=pageNum&&pageNum!=0) {
		bAppend(b,pageNum,s,n,pageNum);
		bAppend(b,(i+1),s,n,"下一页");
	}
	//↓操作#comment
	var c = $("#comment");
	c.empty();
	$.post("../../forum/getReplys?forumid="+forumid+"&pageIndex="+pageIndex+"&pageSize="+pageSize,function(data) {
		//console.log(data);//帖子评论
		var di;
		for(var i=0;i<data.length;i++) {
			di = data[i];//0评论id,1评论人id,2评论人name,3评论人头像,4评论人自我介绍,5书的编号,6评论内容,7评论时间
			c.append('<div class="row" id="c'+di[0]+'"><div class="col-md-2 col-xs-2"><a href="../htmls/userinfo.html?userid='+di[1]+'"><img class="center-block head" src="../data/head/'+di[3]+'" onerror="loseImg(this)"></a><p class="text-center">'+di[2]+'</p></div><div class="col-md-7 col-xs-8"><p class="lead">'+di[6]+'</p><p>'+toTime(di[7])+'</p></div></div>');
		}
		if(pageIndex!=1) {
			$("#forumBox").html("");//清空主题栏
			c.append('<a class="pages" href="javascript:getComment('+(pageIndex-1)+','+s+','+n+')">上一页</a>');
		} else {//获取主题
			$.post("../../forum/getForum?forumid="+forumid,function(data) {
				var di = data[0];//0主题id,1发帖人id,2发帖人name,3发帖人头像,4发帖人自我介绍,5帖子主题,6帖子内容,7帖子评论数,8发帖时间
				//console.log(di);//打印主题信息
				$("#forumBox").html('<div class="row" id="c'+di[0]+'"><h2 class="text-center">'+di[5]+'</h2><div class="col-md-2 col-xs-2"><a href="../htmls/userinfo.html?userid='+di[1]+'"><img class="center-block head" src="../data/head/'+di[3]+'" onerror="loseImg(this)"></a><p class="text-center">'+di[2]+'</p></div><div class="col-md-7 col-xs-8"><p class="lead">'+di[6]+'</p><p>'+toTime(di[8])+'</p></div></div>');
			});
		}	
		if(pageIndex!=pageNum&&pageNum!=0)
			c.append('<a class="pages" href="javascript:getComment('+(pageIndex+1)+','+s+','+n+')">下一页</a>');
		var h = $("#comment").height();
		//$("#comment").attr("style","min-height:"+h+"px;");//保持仍处在末尾
	});
};
function send() {
	$("#send").click(function() {//发送新回复
		var fd = new FormData();
		var text = $("#text").val();
		fd.set("comment",text);//回复的内容
		fd.set("forumid",forumid);//帖子id
		//console.log(text);
		$.ajax({
			url: "../../forum/reply",
			type: "POST",
			processData: false,
			contentType: false,
			data: fd,
			success: function(data) {
				//console.log(data);//评论后返回的信息
				alert(data);
				getComment(1,10,commentNum);//刷新回复
			}
		});
	});
};
function bAppend(b,i,s,n,text) {//偷懒函数,添加标签用的
	b.append('<a class="pages" href="javascript:getComment('+i+','+s+','+n+')">'+text+'</a>');
};
function loseImg(img) {//图片加载失败
	img.src="../img/errorhead.jpg";  
	img.onerror=null;//控制不要一直跳动 
};
function toTime(nS) {//时间戳转化为时间
	return new Date(parseInt(nS)).toLocaleString().replace(/年|月/g,"-").replace(/日/g," ");
};
function GetQueryString(name) {//地址栏获取参数
	var reg = new RegExp("(^|&)"+ name +"=([^&]*)(&|$)");
	var r = window.location.search.substr(1).match(reg);
	if(r!=null)return unescape(r[2]); return null;
};