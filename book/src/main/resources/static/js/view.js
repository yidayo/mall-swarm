var bookid = 0;
var chapterid = 0;
var chapterJson = null;
var chapterCsv = null;
var talkNCsv = null;
$(function (){
	loadTopMenu();//加载顶部菜单
	bookid = GetQueryString("bookid");//获取bookid
	chapterid = GetQueryString("chapterid");//获取chapterid
	//console.log(bookid,"~",chapterid);//打印bookid和chapterid
	getSettings(bookid,chapterid);//加载配置文件(chapter.json),图片列表(chapter.csv),对话列表(talkN.csv)
	/*console.log(chapterJSON);
	console.log(chapterCsv);
	console.log(talkNCsv);*/
	//起初加载五页,且一次加载五页
});
function getSettings(bookid,chapterid) {
	$.get("../data/book/"+bookid+"/"+chapterid+"/chapter.json",function(data) {
		chapterJSON = data;
		console.log(chapterJSON);//打印配置文件(chapter.json)
	});
	/*$.ajax({
		url:"../data/book/"+bookid+"/"+chapterid+"/chapter.json",
		type:"get",
		async:false,
		success:function(data) {
			//console.log(data);//打印配置文件(chapter.json)
			chapterJSON = data;
		},
		error:function(data) {
			console.log("拉取chapter.json错误");
		}
	});*/
	$.get("../data/book/"+bookid+"/"+chapterid+"/chapter.csv",function(data) {
		chapterCsv = csvToObject(data);
		console.log(chapterCsv);//打印图片列表(chapter.csv)
	});
	/*$.ajax({
		url:"../data/book/"+bookid+"/"+chapterid+"/chapter.csv",
		type:"get",
		async:false,
		success:function(data) {
			//console.log(data);//打印图片列表(chapter.csv)
			chapterCsv = csvToObject(data);
		},
		error:function(data) {
			console.log("拉取chapter.csv错误");
		}
	});*/
	$.get("../data/book/"+bookid+"/"+chapterid+"/talk1.csv",function(data) {
		talkNCsv = csvToObject(data);
		console.log(talkNCsv);//打印对话列表(talkN.csv)
	});
	/*$.ajax({
		url:"../data/book/"+bookid+"/"+chapterid+"/talk1.csv",
		type:"get",
		async:false,
		success:function(data) {
			//console.log(data);//打印对话列表(talkN.csv)
			talkNCsv = csvToObject(data);
		},
		error:function(data) {
			console.log("拉取talkN.csv错误");
		}
	});*/
};
function csvToObject(csvString) {//处理csv文件的函数
	var csvarray = csvString.split("\r\n");
	var datas = [];
	var headers = csvarray[0].split(",");
	for(var i=0;i<csvarray.length;i++) {
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