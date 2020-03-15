function loadTopMenu(idName,...funs) {//给idName的div加个效果
	$("body").prepend('<div id="topMenu" class="navbar-wrapper"><div class="container" style="padding-right: 0px;padding-left: 0px;"><nav class="navbar navbar-inverse navbar-static-top"><div class="container"><div class="navbar-header"><button type="button" class="navbar-toggle collapsed" data-toggle="collapse" data-target="#navbar" aria-expanded="false" aria-controls="navbar"><span class="sr-only">Toggle navigation</span><span class="icon-bar"></span><span class="icon-bar"></span><span class="icon-bar"></span></button><a class="navbar-brand" href="welcome.html">咿哒哟</a></div><div id="navbar" class="navbar-collapse collapse"><ul class="nav navbar-nav"><li id="main"><a href="main.html">主页</a></li><li id="message"><a href="message.html">消息页</a></li><li id="forum"><a href="forum.html">论坛</a></li><li id="login"><a href="login.html">登陆/注册</a></li></ul></div></div></nav></div></div>');
	if(idName)//↑添加菜单
		$("#"+idName).addClass("active");//idname添加一个.active
	$.post("../../login/getUserinfo",function(data) {
		//console.log(data);//用户信息
		if(data.userid) {//如果用户处于非登录状态,下面的都省了
			//↓添加下拉菜单
			$("#login").replaceWith('<li class="dropdown"><a class="dropdown-toggle" role="button" aria-haspopup="true" aria-expanded="false">用户<span class="caret"></span></a><ul class="dropdown-menu"><li><a href="userinfo.html?userid='+data.userid+'">个人主页</a></li><li><a href="" id="logout">注销</a></li></ul></li>');
			$("#logout").click(function() {//注销
				$.post("../../login/userlogout",function(data) {
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