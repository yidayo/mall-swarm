$(function(){
	loadTopMenu("forum",function(data) {
		//console.log(data);//显示用户信息
		if(data.userid) {//如果登陆了
			$("#modal").append('<button type="button" class="btn btn-primary" data-toggle="modal" data-target=".bs-example-modal-lg">发篇帖子~?</button>');
		} else {//如果没登陆
			$("#modal").append('<a type="button" class="btn btn-primary" href="login.html">登陆才能发帖~</a>');
		}
	});
	$.post("../../forum/getForumsNum",function(data) {
		//console.log(data);//打印帖子的数量
		getComment(1,10,data);//获取帖子
	});
	send();
})
function getComment(pageIndex,pageSize,commentNum) {//pageIndex为当前页,一页pageSize条,一共commentNum篇
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
	//↓操作#forum(为了避免出错所以还用c作为变量名尽量减少修改)
	var c = $("#comment");
	c.empty();
	$.post("../../forum/getForums?pageIndex="+i+"&pageSize="+s,function(data) {
		//console.log(data);//打印帖子主题
		data = data.content;
		var di;
		for(var i=0;i<data.length;i++) {
			di = data[i];
			c.append('<div class="row" id="c'+di.forumid+'"><a href="forum_view.html?forumid='+di.forumid+'"><p class="lead">'+di.topic+'</p></a><p>'+di.text+'</p><p>'+toTime(di.time)+'</p></div>');
		}
		if(pageIndex!=1)
			c.append('<a class="pages" href="javascript:getComment('+(pageIndex-1)+','+s+','+n+')">上一页</a>');
		if(pageIndex!=pageNum)
			c.append('<a class="pages" href="javascript:getComment('+(pageIndex+1)+','+s+','+n+')">下一页</a>');
		var h = $("#comment").height();
	});
};
function send() {
	$("#send").click(function() {//发送新帖子
		var fd = new FormData();
		var topic = $("#topic").val();
		var text = $("#text").val();
		fd.set("topic",topic);
		fd.set("text",text);
		console.log(topic,text);
		$.ajax({
			url: "../../forum/forum",
			type: "POST",
			processData: false,
			contentType: false,
			data: fd,
			success: function(data) {
				//console.log(data);//评论后返回的信息
				alert(data);
				$.post("../../forum/getForumsNum",function(data) {
					//console.log(data);//打印帖子的数量
					getComment(1,10,data);//获取帖子
				});
			}
		});
	});
};
function bAppend(b,i,s,n,text) {//偷懒函数,添加标签用的
	b.append('<a class="pages" href="javascript:getComment('+i+','+s+','+n+')">'+text+'</a>');
};
function toTime(nS) {//时间戳转化为时间
	return new Date(parseInt(nS)).toLocaleString().replace(/年|月/g,"-").replace(/日/g," ");
};