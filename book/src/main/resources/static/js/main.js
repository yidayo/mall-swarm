var group = ["页漫","条漫","四格多格","绘本"];
$(function (){
	loadTopMenu();
	loadMainCarousel();
	getMostPopular();
});
function loadMainCarousel() {
	$.post("../../main/getBox",function(data) {
		//console.log(data);//传送带信息
		var ol = $("#mainCarousel>ol");
		ol.append('<li data-target="#mainCarousel" data-slide-to="0" class="active"></li>');
		for(var i=1;i<data.numberOfElements;i++) {
			ol.append('<li data-target="#mainCarousel" data-slide-to="'+i+'"></li>');
		}
		var inner = $(".carousel-inner");
		inner.append('<div class="item active"><a href="'+data.content[0].link+'"><img src="../data/goodsimg/'+data.content[0].img+'"></a><div class="carousel-caption"><p>'+data.content[0].text+'</p></div></div>');
		for(var i=1;i<data.numberOfElements;i++) {
			inner.append('<div class="item"><a href="'+data.content[i].link+'"><img src="../data/goodsimg/'+data.content[i].img+'"></a><div class="carousel-caption"><p>'+data.content[i].text+'</p></div></div>');
		}
	});
};
function getMostPopular() {
	$.post("../../main/getMostPopular",function(data) {
		//console.log(data);//人气排行榜前十
		var div = $("#mostpopular");
		for(var i=0;i<6;i++) {//1-6总是显示
			var c = data.content[i];
			div.append('<div class="col-sm-3 col-xs-4"><a href="story.html?bookid='+c.bookid+'"><img src="../data/bookimg/'+c.img+'" style="height: 102px;width: 80px;"></a><p>'+c.bookname+'</p><p>'+group[c.groupnameid-1]+'</p></div>');
		}
		for(var i=6;i<8;i++) {//7-8小于768px隐藏
			var c = data.content[i];
			div.append('<div class="col-sm-3 col-xs-4 hidden-xs"><a href="story.html?bookid='+c.bookid+'"><img src="../data/bookimg/'+c.img+'" style="height: 102px;width: 80px;"></a><p>'+c.bookname+'</p><p>'+group[c.groupnameid-1]+'</p></div>');
		}
	});
};