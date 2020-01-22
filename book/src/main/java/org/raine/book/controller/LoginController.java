package org.raine.book.controller;

import javax.servlet.http.HttpServletRequest;

import org.raine.book.dao.bean.User;
import org.raine.book.service.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/login")
public class LoginController {
	
	@Autowired
	UserService userService;
	
	//登陆
	@RequestMapping("/userlogin")
	public String userlogin(HttpServletRequest request) {
		return userService.login(request);
	}
	
	//是否存在该用户
	@RequestMapping("/finduser")
	public int finduser(String username) {
		return userService.findByUsername(username);
	}
	
	//注销
	@RequestMapping("/userlogout")
	public String userlogout(HttpServletRequest request) {
		return userService.logout(request);
	}
	
	//获取个人信息
	@RequestMapping("/getUserinfo")
	public User getUserinfo(HttpServletRequest request) {
		return userService.getUserinfo(request);
	}
}
