package org.raine.book.controller;

import java.util.List;

import org.raine.book.service.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/view")
public class ViewController {

	@Autowired
	UserService userService;
	
	//获取评论
	@RequestMapping("/getComment")
	public List<?> getComment(int bookid,int pageIndex,int pageSize) {
		return userService.getComment(bookid,pageIndex,pageSize);
	}
}
