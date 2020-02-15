var bookid = 0;
var chapterid = 0;
var c1=c2=false;//标记json文件和两个csv文件是否加载完成
var chapterJson = null;//配置文件(chapter.json)
var chapterCsv = null;//图片列表(chapter.csv)
var talkNCsv = null;//对话列表(talkN.csv)
var listCsv = null;//章节列表(list.csv)
var imgDiv = $("#imgDiv");
$(function (){
	loadTopMenu();//加载顶部菜单
	bookid = GetQueryString("bookid");//获取bookid
	chapterid = parseInt(GetQueryString("chapterid"));//获取chapterid
	//console.log(bookid,"~",chapterid);//打印bookid和chapterid
	getSettings(bookid,chapterid);//加载配置文件(chapter.json),图片列表(chapter.csv),对话列表(talkN.csv),本书配置文件(book.json)
	$.get("../data/book/"+bookid+"/list.csv",function(data) {
		listCsv = csvToObject(data);
		//console.log(listCsv);//打印章节列表(list.csv)
		workForNewChapter();
	});
});
function getSettings(bookid,chapterid) {//加载json和csv文件
	$.get("../data/book/"+bookid+"/"+chapterid+"/chapter.json",function(data) {
		chapterJson = data;
		//console.log(chapterJson);//打印配置文件(chapter.json)
		$.get("../data/book/"+bookid+"/"+chapterid+"/chapter.csv",function(data) {
			chapterCsv = csvToObject(data);
			//console.log(chapterCsv);//打印图片列表(chapter.csv)
			c1=true;
			if(c1&&c2)
				afterGetAll();
		});
		$.get("../data/book/"+bookid+"/"+chapterid+"/talk"+chapterJson.defaultTalk+".csv",function(data) {
			talkNCsv = csvToObject(data);
			//console.log(talkNCsv);//打印对话列表(talkN.csv)
			c2=true;
			if(c1&&c2)
				afterGetAll();
		});
	});
};
function afterGetAll() {//两个配置文件加载之后
	c1=c2=false;//把flag变回false以免刷新图片时出错
	//console.log(chapterJson,"\n",chapterCsv,"\n",talkNCsv);//打印三个文件
	var start=0,length=chapterJson.imgNum;
	imgDiv.append('<div class="'+chapterid+'"></div>');
	var chapterDiv = $("."+chapterid);
	if(chapterJson.talks.length>1) {//如果有多个对话列表,上方添加单选框
		imgDiv.find("."+chapterid+":first").append('<div class="radio"></div>');
		var talks = chapterJson.talks;
		for(var i=0;i<talks.length;i++) {
			var radio = imgDiv.find("."+chapterid+":first>.radio");//↓chapterid会变,所以把参数传进去
			radio.append('<label class="radio-inline"><input type="radio" name="radio'+chapterid+'" class="'+talks[i].no+'" onclick="changeTalk('+chapterid+','+talks[i].no+')">'+talks[i].name+'</label>');
		}
		radio.find("."+chapterJson.defaultTalk).attr('checked','checked');
	}
	for(var i=start;i<start+length;i++) {//加载图片
		chapterDiv.append('<canvas class="c'+i+'"></canvas>');
		getImg(i);
	}
};
function getImg(i) {//为某一个canvas添加内容(canvas标签的id)
	var c = document.getElementsByClassName(chapterid)[0].getElementsByClassName("c"+i)[0];
	c.img = new Image();
	c.img.src = "../data/book/"+bookid+"/"+chapterid+"/"+i+".jpg";
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
	c.ctx = c.getContext("2d");
	c.img.onload = function() {
		c.width = c.img.width;
		c.height = c.img.height;
		c.ctx.drawImage(c.img,0,0);//绘图
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
			c.ctx.font = ""+talkNCsv[j].px+"px "+talkNCsv[j].textName;
			c.ctx.textAlign = talkNCsv[j].textAlign;//左右对齐
			c.ctx.textBaseline = talkNCsv[j].textBaseline;//上下基准线
			//c.ctx.globalAlpha=0.5;//临时调试用,半透明
			if(talkNCsv[j].text instanceof Array) {
				for(var k=0;k<talkNCsv[j].text.length;k++) {
					var w = 1.25*k*talkNCsv[j].px+parseInt(talkNCsv[j].y1);//0.25倍行距
					c.ctx.fillText(talkNCsv[j].text[k],talkNCsv[j].x1,w);//实心的
				}
			} else {//单行打印
				c.ctx.fillText(talkNCsv[j].text,talkNCsv[j].x1,talkNCsv[j].y1);//实心的
			}
		}
	}
};

function changeTalk(chapterid,talkNo) {//刷新对话列表以及更新文字的函数
	$.get("../data/book/"+bookid+"/"+chapterid+"/talk"+talkNo+".csv",function(data) {//获取新的列表
		talkNCsv = csvToObject(data);
		//console.log(talkNCsv);//打印对话列表(talkN.csv)
		var canvases = $("#imgDiv>."+chapterid+">canvas");
		//console.log(canvases);
		for(var i=0;i<canvases.length;i++) {//重新打印图片
			var chapteri = chapterCsv[i];
			var cani = canvases[i];
			cani.ctx.clearRect(0,0,cani.width,cani.height);//清空图像
			cani.ctx.drawImage(cani.img,0,0);//绘图
			for(var j=parseInt(chapteri.min);j<=parseInt(chapteri.max);j++) {//打字
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
				cani.ctx.font = ""+talkNCsv[j].px+"px "+talkNCsv[j].textName;
				cani.ctx.textAlign = talkNCsv[j].textAlign;//左右对齐
				cani.ctx.textBaseline = talkNCsv[j].textBaseline;//上下基准线
				//c.ctx.globalAlpha=0.5;//临时调试用,半透明
				if(talkNCsv[j].text instanceof Array) {
					for(var k=0;k<talkNCsv[j].text.length;k++) {
						var w = 1.25*k*talkNCsv[j].px+parseInt(talkNCsv[j].y1);//0.25倍行距
						cani.ctx.fillText(talkNCsv[j].text[k],talkNCsv[j].x1,w);//实心的
					}
				} else {//单行打印
					cani.ctx.fillText(talkNCsv[j].text,talkNCsv[j].x1,talkNCsv[j].y1);//实心的
				}
			}
		}
	});
};
function workForNewChapter() {//为加载下一章所进行的工作
	$(window).scroll(function() {
		var awayBtm = $(document).height()-$(window).scrollTop()-$(window).height();
		//https://zhidao.baidu.com/question/1736919478070059187.html
		if(awayBtm==0) {//滑动到底部时
			if(listCsv[chapterid+1].no=="") return;//如果没有下一章
			chapterid += 1;
			console.log(bookid,"~",chapterid);//打印bookid和chapterid
			getSettings(bookid,chapterid);//加载配置文件(chapter.json),图片列表(chapter.csv),对话列表(talkN.csv)
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