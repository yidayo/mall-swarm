var text=$("#text");
var focus = false;//自己定义的临时变量,表示input是否处于选中状态
$(function (){
	$.post("../../login/getUserinfo",
		function(data) {
			//console.log(data);//显示用户信息
			if(data.userid) {//如果用户处于登录状态
				$(".dropdown-toggle").attr("title",data.username+"的主页");
				$(".dropdown-toggle>img").attr("src","../data/head/"+data.img);//图标设为头像
				$(".dropdown-toggle").attr("href","../htmls/userinfo.html?userid="+data.userid);//连接设为个人主页
				$(".dropdown-menu>li:nth-child(1)>a").attr("href","../htmls/userinfo.html?userid="+data.userid);//连接设为主页
			} else {//如果处于非登陆状态
				$(".dropdown").removeClass("dropdown");
			}
	});
	$("input").focus(function(){//被选中的时候
		focus=true;
	});
	$("input").blur(function(){//不再选中的时候
		focus=false;
	});
	$("#logout").click(function() {//点击注销
		$.post("../../login/userlogout",
			function(data) {
				if(data=="注销成功") {
					location.reload();
				}
			}
		);
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
	$(".dropdown").bind({//鼠标悬停
		mouseover:function() {$(".dropdown").addClass("open");},
		mouseout:function() {$(".dropdown").removeClass("open");}
	});
});