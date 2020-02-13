var bookid = 0;
var chapterid = 0;
var j1=c2=c3=false;//标记json文件和两个csv文件是否加载完成
var chapterJson = null;//配置文件(chapter.json)
var chapterCsv = null;//图片列表(chapter.csv)(画板对象绑这上面了)
var talkNCsv = null;//对话列表(talkN.csv)
var imgDiv = $("#imgDiv");
$(function (){
	loadTopMenu();//加载顶部菜单
	bookid = GetQueryString("bookid");//获取bookid
	chapterid = parseInt(GetQueryString("chapterid"));//获取chapterid
	//console.log(bookid,"~",chapterid);//打印bookid和chapterid
	getSettings(bookid,chapterid);//加载配置文件(chapter.json),图片列表(chapter.csv),对话列表(talkN.csv)
	workForNewChapter();//下一章的准备工作(如滚轮事件)
});
function getSettings(bookid,chapterid) {//加载json和csv文件
	$.get("../data/book/"+bookid+"/"+chapterid+"/chapter.json",function(data) {
		chapterJson = data;
		//console.log(chapterJson);//打印配置文件(chapter.json)
		j1=true;
		if(j1&&c2&&c3)
			afterGetAll();
	});
	$.get("../data/book/"+bookid+"/"+chapterid+"/chapter.csv",function(data) {
		chapterCsv = csvToObject(data);
		//console.log(chapterCsv);//打印图片列表(chapter.csv)
		c2=true;
		if(j1&&c2&&c3)
			afterGetAll();
	});
	$.get("../data/book/"+bookid+"/"+chapterid+"/talk1.csv",function(data) {
		talkNCsv = csvToObject(data);
		//console.log(talkNCsv);//打印对话列表(talkN.csv)
		c3=true;
		if(j1&&c2&&c3)
			afterGetAll();
	});
};
function afterGetAll() {//三个配置文件加载之后
	j1=c2=c3=false;//把flag变回false以免刷新图片时出错
	//console.log(chapterJson,"\n",chapterCsv,"\n",talkNCsv);//打印三个文件
	//加载图片
	var start=0,length=chapterJson.imgNum;
	imgDiv.append('<div class="'+chapterid+'"></div>');
	var chapterDiv = $("."+chapterid);
	for(var i=start;i<start+length;i++) {
		chapterDiv.append('<canvas class="c'+i+'"></canvas>');
		getImg(i);
	}
};
function getImg(i) {//为某一个canvas添加内容(canvas标签的id)
	var img = new Image();
	img.src = "../data/book/"+bookid+"/"+chapterid+"/"+i+".jpg";
	var c = document.getElementsByClassName(chapterid)[0].getElementsByClassName("c"+i)[0];
	c.onclick = function(e) {//测试时临时加的方法,用以确定文字位置
		var eRect = this.getBoundingClientRect();//返回被点击的对象的位置集合,包含top,right,bottom,left四个属性,是表示位置的集合
		var x = e.clientX - eRect.left;
		var y = e.clientY - eRect.top;
		console.log(x,y);
	};
	c.ondblclick = function(e) {//双击重新加载
		//getSettings(bookid,chapterid);//为了方便修改csv留下的,稍后删掉,把下面的getImg放出来
		//console.log(chapterJson,"\n",chapterCsv,"\n",talkNCsv);//打印更新后的三个文件
		getImg(i);
	};
	var ci = chapterCsv[i];
	ci.ctx = c.getContext("2d");
	img.onload = function() {
		c.width = img.width;
		c.height = img.height;
		ci.ctx.drawImage(img,0,0);//绘图
		for(var j=parseInt(ci.min);j<=parseInt(ci.max);j++) {//打字
			if(j==-1) continue;//↓把下面用到的东西一股脑打印出来
			//console.log(i,j,talkNCsv[j].px,talkNCsv[j].textName,talkNCsv[j].text,talkNCsv[j].x1,talkNCsv[j].y1);
			if(talkNCsv[j].size!=0) {//拆分的部分,size是每一行的字数
				var size = parseInt(talkNCsv[j].size);
				var old = talkNCsv[j].text;
				talkNCsv[j].text = [];
				for(var k=0;k<old.length;k+=size) {
					talkNCsv[j].text.push(old.slice(k,k+size));
				}
				talkNCsv[j].size=0;
			}
			ci.ctx.font = ""+talkNCsv[j].px+"px "+talkNCsv[j].textName;
			ci.ctx.textAlign = talkNCsv[j].textAlign;//左右对齐
			ci.ctx.textBaseline = talkNCsv[j].textBaseline;//上下基准线
			//ci.ctx.globalAlpha=0.5;//临时调试用,半透明
			if(talkNCsv[j].text instanceof Array) {
				for(var k=0;k<talkNCsv[j].text.length;k++) {
					var w = 1.25*k*talkNCsv[j].px+parseInt(talkNCsv[j].y1);//0.25倍行距
					ci.ctx.fillText(talkNCsv[j].text[k],talkNCsv[j].x1,w);//实心的
				}
			} else {//单行打印
				ci.ctx.fillText(talkNCsv[j].text,talkNCsv[j].x1,talkNCsv[j].y1);//实心的
			}
		}
	}
};

function workForNewChapter() {//为加载下一章所进行的工作
	$(window).scroll(function() {
		var awayBtm = $(document).height()-$(window).scrollTop()-$(window).height();
		//https://zhidao.baidu.com/question/1736919478070059187.html
		if(awayBtm==0) {//滑动到90%部分时
			//$(window).unbind("scroll");
			console.log(1);
			chapterid += 1;//chapterid+1
			console.log(bookid,"~",chapterid);//打印bookid和chapterid
			getSettings(bookid,chapterid);//加载配置文件(chapter.json),图片列表(chapter.csv),对话列表(talkN.csv)
			//workForNewChapter();//下一章的准备工作(如滚轮事件)
		}
	});
};
function csvToObject(csvString) {//将csv文件转化为object
	var csvarray = csvString.split("\r\n");
	var datas = [];
	var headers = csvarray[0].split(",");
	for(var i=1;i<csvarray.length;i++) {
		var data = {};
		var temp = csvarray[i].split(",");
		for(var j=0;j<temp.length;j++) {
			data[headers[j]]=temp[j];
		}
		datas.push(data);
	}
	return datas;
};
function GetQueryString(name) {//地址栏获取参数
	var reg = new RegExp("(^|&)"+ name +"=([^&]*)(&|$)");
	var r = window.location.search.substr(1).match(reg);
	if(r!=null)return unescape(r[2]); return null;
};