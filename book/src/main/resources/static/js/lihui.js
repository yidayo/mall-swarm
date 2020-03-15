$(function(){
	loadTopMenu();
	var lihuiid = GetQueryString("lihuiid");
	$.get("../data/lihui/"+lihuiid+".json",function(json) {
		//console.log(json);//打印被转化好的json对象
		var catCan = new CatCan();
		catCan.init("catCan",json,{w:500,h:600},"axis","xy");//只有前两个是必须的
		catCan.playAnimation(0);
	});
})
function GetQueryString(name) {//地址栏获取参数
	var reg = new RegExp("(^|&)"+ name +"=([^&]*)(&|$)");
	var r = window.location.search.substr(1).match(reg);
	if(r!=null)return unescape(r[2]); return null;
};