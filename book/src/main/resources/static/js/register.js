$(function(){
	var fd = new FormData();
	$("#registe").click(function() {
		if(!$("#checkbox").is(':checked')) {
			alert("不同意是不允许注册的");
			return;
		}
		var username=$("#username").val();
		var password=$("#password").val();
		var password2=$("#password2").val();
		var img=$("#img").get(0).files[0];
		var all=username&&password&&img;
		if(!all) {//如果信息不全
			alert("信息不全");
			return;
		}
		if(password!=password2) {
			alert("两次输入的密码不一样");
			return;
		}
		$.post("../register/findByUsername?username="+username,function(data) {
			if(data!=0) {
				alert("用户名重复啦");
				return;
			}
			fd.set("username",username);
			fd.set("password",password);
			fd.set("img",img);
			$.ajax({
				url: "../register/registe",
				type: "POST",
				processData: false,
				contentType: false,
				data: fd,
				success: function(data) {
					alert("注册成功");
					history.go(-1);
				}
			});
		});
	});
})	