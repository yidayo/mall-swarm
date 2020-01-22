package org.raine.book.controller;

import java.util.List;
import java.util.Map;

import javax.servlet.http.HttpServletRequest;

import org.raine.book.service.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/message")
public class MessageController {

	@Autowired
	UserService userService;
	
	//获取短消息
	@RequestMapping("/getMessages")
	public List<?> getMessages(HttpServletRequest request) {
		return userService.getMessages(request);
	}
	
	//向某人发消息(返回消息id,然而我已经想不起来为什么要返回消息id了)
	@RequestMapping("/sendMessage")
	public String sendMessage(HttpServletRequest request) {
		return userService.sendMessage(request);
	}
	
	//删消息
	@RequestMapping("/deleteMessage")
	public String deleteMessage(HttpServletRequest request) {
		return userService.deleteMessage(request);
	}
	
	//请求头像(参数是userid的list集合)
	@RequestMapping("/getHeadsAndUsernames")
	public Map<String,Object[]> getHeadsAndUsernames(@RequestParam("userlist") List<Integer> idlist) {
		return userService.getHeadsAndUsernames(idlist);
	}
	
}
