function loadTopMenu(...funs) {
	$.post("../../login/getUserinfo",function(data) {
		//console.log(data);//用户信息
		if(data.userid) {//如果用户处于非登录状态,下面的都省了
			//↓添加下拉菜单
			$("#login").replaceWith('<li class="dropdown"><a class="dropdown-toggle" role="button" aria-haspopup="true" aria-expanded="false">用户<span class="caret"></span></a><ul class="dropdown-menu"><li><a href="userinfo.html?userid='+data.userid+'">个人主页</a></li><li><a href="" id="logout">注销</a></li></ul></li>');
			$("#logout").click(function() {//注销
				$.post("../../login/userlogout",
						function(data) {
					if(data=="注销成功") {
						location.reload();
					}
				});
			});
			$(".dropdown").bind({//鼠标悬停或者点击
				click:function() {$(".dropdown").toggleClass("open");},
				mouseover:function() {$(".dropdown").addClass("open");},
				mouseout:function() {$(".dropdown").removeClass("open");}
			});
		}
		for(var i=0;i<funs.length;i++) {
			funs[i](data);//这个data是用户信息
		}
	});
};