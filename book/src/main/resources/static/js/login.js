$(function(){
	var fd = new FormData();
	$("#login").click(function() {
		if(!$("#checkbox").is(':checked')) {
			alert("不同意是不允许登陆的");
			return;
		}
		var username=$("#username").val();
		var password=$("#password").val();
		if(!username) {//如果没有输入用户名
			alert("用户名未输入");
			return;
		}
		if(!password) {//如果没有输入密码
			alert("密码未输入");
			return;
		}
		$.post("../login/finduser?username="+username,function(data) {
			console.log(data);
			if(data==0) {
				alert("我不认识"+username);
				return;
			}
			fd.set("username",username);
			fd.set("password",password);
			$.ajax({
				url: "../../login/userlogin",
				type: "POST",
				processData: false,
				contentType: false,
				data: fd,
				success: function(data) {
					if(data!=0) {
						alert("密码好像错了");
						return;
					}
					history.go(-1);
				}
			});
		});
	});
})	