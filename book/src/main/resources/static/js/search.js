var text=$("#text");
var focus = false;//自己定义的临时变量,表示input是否处于选中状态
var bookname = "";
var pageIndex = 1;//当前页码
var pageSize = 10;//每页的条数
var bookNum = 0;//符合条件的书的总条数
var pageNum = 1;//总页数
$(function() {
	bookname = GetQueryString("bookname");
	console.log(bookname);
	text.val(bookname);
	newSearch();
	loadTopMenu();
	getBooks(pageIndex,pageSize);
});
function getBooks(i,s) {
	var bdiv = $("#book");
	bdiv.empty();
	$.post("../../search/searchBook?bookname="+bookname+"&pageIndex="+i+"&pageSize="+s,function(data) {
		//console.log(data);//打印搜索到的书籍
		var di,dc=data.content;
		pageIndex = data.number+1;//当前页
		bookNum = data.totalElements;//符合条件书的总条数
		pageNum = data.totalPages;//页数
		if(data.numberOfElements==0) {
			bdiv.append('<div class="row"><div class="col-md-5 col-xs-8 col-md-offset-3 col-xs-offset-1"><h2>啥~都没找到</h2></div></div>');
			return;
		}
		for(var i=0;i<data.numberOfElements;i++) {//当前页有多少条
			di = dc[i];
			bdiv.append('<div class="row introduce"><div class="col-md-3 col-md-offset-1"><div class="imgdiv"><img src="../data/bookimg/'+di.img+'"></div></div><div class="col-md-7 message"><h1>'+di.bookname+'<a class="small" href="story.html?bookid='+di.bookid+'">点击阅读</a></h1><p>作者:'+di.userid+'</p> <p>分类:'+di.groupnameid+'</p> <p>收藏:'+di.love+'</p> <p>评论:'+di.comment+'</p><p class="lead" style="display: block;">'+di.introduce+'</p></div></div>');
		}
		if(pageIndex!=1)
			bdiv.append('<a class="pages" href="javascript:getBooks('+(pageIndex-1)+','+s+')">上一页</a>');
		if(pageIndex!=pageNum)
			bdiv.append('<a class="pages" href="javascript:getBooks('+(pageIndex+1)+','+s+')">下一页</a>');
		var h = $("#book").height();
		$("#book").attr("style","min-height:"+h+"px;");
		loadPagebox();
	});
}
function loadPagebox() {
	var i=pageIndex,s=pageSize;//当前页,每页的条数,总条数
	//console.log("当前页:"+i+",每页条数:"+s);
	var b = $("#page-box");//插入页码的地方
	b.empty();
	if(i!=1) {
		bAppend(b,(i-1),s,"上一页");
		bAppend(b,1,s,"1");
	}
	if(i<=5) {
		for(var j=2;j<i;j++)
			bAppend(b,j,s,j);
		b.append('<span class="current">'+i+'</span>');
	} else {
		b.append('<span class="pages">...</span>');
		for(var j=i-2;j<i;j++)
			bAppend(b,j,s,j);
		b.append('<span class="current">'+i+'</span>');
	}
	if(pageNum-i<5) {
		for(var j=i+1;j<pageNum;j++)
			bAppend(b,j,s,j);
	} else {
		for(var j=i+1;j<i+3;j++)
			bAppend(b,j,s,j);
		b.append('<span class="pages">...</span>');
	}
	if(i!=pageNum) {
		bAppend(b,pageNum,s,pageNum);
		bAppend(b,(i+1),s,"下一页");
	}
}
function bAppend(b,i,s,text) {//偷懒函数,添加标签用的
	b.append('<a class="pages" href="javascript:getBooks('+i+','+s+')">'+text+'</a>');
}
function newSearch() {
	$("input").focus(function(){//被选中的时候
		focus=true;
	});
	$("input").blur(function(){//不再选中的时候
		focus=false;
	});
	$("#send").click(function() {//点击发送按钮
		if(text.val()!="") {
			$(location).attr("href","search.html?bookname="+escape(text.val()));
		} else {
			$("input").focus();
		}
	});
	$(document).keydown(function (event) {//按键盘的事件
		if (event.keyCode == 13) {
			if(text.val()!=""&&focus==true) {
				$(location).attr("href","search.html?bookname="+escape(text.val()));
			} else {
				$("input").focus();
			}
		};
	});
};
function GetQueryString(name) {//地址栏获取参数
	var reg = new RegExp("(^|&)"+ name +"=([^&]*)(&|$)");
	var r = window.location.search.substr(1).match(reg);
	if(r!=null)return unescape(r[2]); return null;
};