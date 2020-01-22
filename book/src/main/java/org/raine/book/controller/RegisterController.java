package org.raine.book.controller;

import javax.servlet.http.HttpServletRequest;

import org.raine.book.service.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/register")
public class RegisterController {

	@Autowired
	UserService userService;
	
	//验证用户名是否存在
	@RequestMapping("/findByUsername")
	public int findByUsername(String username)  {
		return userService.findByUsername(username);//返回的是用户的条数,0为不重复
	}
	
	//注册
	@RequestMapping("/registe")
	public String registe(HttpServletRequest request)  {
		return userService.registe(request);//返回的是用户的条数,0为不重复
	}
}
