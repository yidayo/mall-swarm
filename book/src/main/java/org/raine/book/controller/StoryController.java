package org.raine.book.controller;

import java.util.List;

import javax.servlet.http.HttpServletRequest;

import org.raine.book.dao.bean.Book;
import org.raine.book.dao.bean.User;
import org.raine.book.service.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/story")
public class StoryController {

	@Autowired
	UserService userService;

	//获取漫画
	@RequestMapping("/getBook")
	public Book getBook(int bookid) {
		return userService.getBook(bookid);
	}
	
	//获取收藏
	@RequestMapping("/getLove")
	public String getComment(HttpServletRequest request) {
		return userService.getLove(request);
	}
	
	//获取评论
	@RequestMapping("/getComment")
	public List<?> getComment(int bookid,int pageIndex,int pageSize) {
		return userService.getComment(bookid,pageIndex,pageSize);//不需要进行-1操作
	}
	
	//获取作者信息(获取他人信息)
	@RequestMapping("/getWriterinfo")
	public User getWriterinfo(int userid) {
		return userService.getOtherinfo(userid);
	}
	
	//收藏
	@RequestMapping("/love")
	public String love(HttpServletRequest request) {
		return userService.love(request);
	}
	
	//评论
	@RequestMapping("/comment")
	public String comment(HttpServletRequest request) {
		return userService.comment(request);
	}
}
