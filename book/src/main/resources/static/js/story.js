var group = ["页漫","条漫","四格多格","绘本"];
var text=$("#text");
var focus = false;//自己定义的临时变量,评论框是否处于选中状态
var bookid = 0;
var love = false;//表示用户是否收藏了
$(function (){
	loadTopMenu();//加载顶端菜单
	getBook();//获取书籍信息(包含获取评论列表)
	newComment();//关于评论功能的准备工作
	aboutlove();//关于是否收藏与添加/取消收藏的绑定工作
});
function aboutlove() {
	var fd = new FormData();
	fd.set("bookid",bookid);
	$.ajax({
		url: "../../story/getLove",
		type: "POST",
		processData: false,
		contentType: false,
		data: fd,
		success: function(data) {
			//console.log(data);//评论后返回的信息(客观未登录,表示已经收藏的1,表示未收藏的0)
			if(data==1) {
				love=true;
				$("#love").attr("class","glyphicon glyphicon-heart");
			} else if(data==0) {
				love=false;
			} else if(data=="客官未登录") {
				//The quick brown fox jumps over a lazy dog.
			}
			else {
				alert(data);
			}
		}
	});
	$("#love").click(function() {
		var fd = new FormData();
		var loveflag = love?0:1;
		//console.log(loveflag+"~"+bookid);//收藏或者取消收藏时发送的信息
		fd.set("loveflag",loveflag);//1添加收藏,0取消收藏
		fd.set("bookid",bookid);
		fd.set("display",0);//1展示,0隐藏,为了避免麻烦先默认隐藏
		$.ajax({
			url: "../../story/love",
			type: "POST",
			processData: false,
			contentType: false,
			data: fd,
			success: function(data) {
				//console.log(data);//评论后返回的信息
				alert(data);
				if(data=="收藏成功,默认不展示~") {
					love=true;
					$("#love").attr("class","glyphicon glyphicon-heart");
					freshLove();
				} else if(data=="已取消收藏~") {
					love=false;
					$("#love").attr("class","glyphicon glyphicon-heart-empty");
					freshLove();
				}
			}
		});
	});
};
function getBook() {
	bookid = GetQueryString("bookid");
	var commentNum = $.post("../../story/getBook?bookid="+bookid,function(data) {
		//console.log(data);//书籍信息
		$("#introduce img").attr("src","../data/bookimg/"+data.img);
		$("#message").append('<h1 style="color: #fff;">'+data.bookname+'</h1>');
		$("#message").append('<p>作者:</p><p></p> <p>分类:</p><p>'+group[data.groupnameid-1]+'</p> <p>收藏:</p><p>'+data.love+'</p> <p>评论:</p><p>'+data.comment+'</p>');
		$("#message").append('<p class="lead" style="display: block;margin: 20px 0px;">'+data.introduce+'</p>');
		getOtherinfo(data.userid);//获取作者信息
		getComment(1,10,data.comment);//获取评论
	});
};
function freshLove() {
	var loveP = $("#message>p:nth-child(7)");
	var val = love?1:-1;
	loveP.text(parseInt(loveP.text())+val);
};
function getOtherinfo(userid) {
	$.post("../../story/getWriterinfo?userid="+userid,function(data) {
		//console.log(data);//作者信息
		$("#message>p:nth-child(3)").replaceWith('<p>'+data.username+'</p>');
	});
};
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
	if(i!=pageNum) {
		bAppend(b,pageNum,s,n,pageNum);
		bAppend(b,(i+1),s,n,"下一页");
	}
	//↓操作#comment
	var c = $("#comment");
	c.empty();
	var bookid = GetQueryString("bookid");
	$.post("../../story/getComment?bookid="+bookid+"&pageIndex="+pageIndex+"&pageSize="+pageSize,function(data) {
		//console.log(data);//书籍评论
		var di;
		for(var i=0;i<data.length;i++) {
			di = data[i];//0评论id,1评论人id,2评论人name,3评论人头像,4评论人自我介绍,5书的编号,6评论内容,7评论时间
			c.append('<div class="row" id="c'+di[0]+'"><div class="col-md-2 col-xs-2"><a href="../htmls/userinfo.html?userid='+di[1]+'"><img class="head" src="../data/head/'+di[3]+'" onerror="loseImg(this)"></a></div><div class="col-md-7 col-xs-8"><p>'+di[2]+'</p><p class="lead">'+di[6]+'</p><p>'+toTime(di[7])+'</p></div></div>');
		}
		if(pageIndex!=1)
			c.append('<a class="pages" href="javascript:getComment('+(pageIndex-1)+','+s+','+n+')">上一页</a>');
		if(pageIndex!=pageNum)
			c.append('<a class="pages" href="javascript:getComment('+(pageIndex+1)+','+s+','+n+')">下一页</a>');
		var h = $("#comment").height();
		$("#comment").attr("style","min-height:"+h+"px;");
	});
};
function newComment() {
	$("input").focus(function(){//被选中的时候
		focus=true;
	});
	$("input").blur(function(){//不再选中的时候
		focus=false;
	});
	$("#send").click(function() {//点击发送按钮
		if(text.val()!="") {
			sendComment();
		} else {
			$("input").focus();
		}
	});
	$(document).keydown(function (event) {//按键盘的事件
		if (event.keyCode == 13) {
			if(text.val()!=""&&focus==true) {
				sendComment();
			} else {
				$("input").focus();
			}
		};
	});
}
function sendComment() {
	var fd = new FormData();
	var comment = $("#text").val();
	fd.set("comment",comment);
	fd.set("bookid",bookid);
	$.ajax({
		url: "../../story/comment",
		type: "POST",
		processData: false,
		contentType: false,
		data: fd,
		success: function(data) {
			//console.log(data);//评论后返回的信息
			alert(data);
			text.val("");
			var commentNum = freshComment();//只刷新条数,返回总的评论条数
			getComment(1,10,commentNum);//刷新评论列表
		}
	});
}
function freshComment() {
	var commentP = $("#message>p:nth-child(9)");
	commentP.text(parseInt(commentP.text())+1);
	return commentP.text();
};
function bAppend(b,i,s,n,text) {//偷懒函数,添加标签用的
	b.append('<a class="pages" href="javascript:getComment('+i+','+s+','+n+')">'+text+'</a>');
}
function loseImg(img) {//图片加载失败
	img.src="../img/errorhead.jpg";  
	img.onerror=null;//控制不要一直跳动 
}
function GetQueryString(name) {//地址栏获取参数
	var reg = new RegExp("(^|&)"+ name +"=([^&]*)(&|$)");
	var r = window.location.search.substr(1).match(reg);
	if(r!=null)return unescape(r[2]); return null;
};
function toTime(nS) {//时间戳转化为时间
	return new Date(parseInt(nS)).toLocaleString().replace(/年|月/g,"-").replace(/日/g," ");
};