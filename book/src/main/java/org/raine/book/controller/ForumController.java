package org.raine.book.controller;

import javax.servlet.http.HttpServletRequest;

import org.raine.book.dao.bean.Forum;
import org.raine.book.dao.bean.Reply;
import org.raine.book.service.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/forum")
public class ForumController {
	
	@Autowired
	UserService userService;
	
	//获取帖子的条数
	@RequestMapping("/getForumsNum")
	public long getForumsNum() {
		return userService.getForumsNum();
	}
	
	//按最后回复时间排序,分页获取帖子列表
	@RequestMapping("/getForums")
	public Page<Forum> getForums(int pageIndex,int pageSize) {//http://localhost:8080/forum/getForums?pageIndex=1&pageSize=10
		return userService.getForums(pageIndex, pageSize);
	}
	
	//发帖子
	@RequestMapping("/forum")
	public String forum(HttpServletRequest request) {
		return userService.forum(request);
	}
	
	//删帖子(删了就是真删了)
	@RequestMapping("/deleteForum")
	public String deleteForum(HttpServletRequest request) {
		return userService.deleteForum(request);
	}
	
	//分页获取回复
	@RequestMapping("/getReplys")
	public Page<Reply> getReplys(int forumid,int pageIndex,int pageSize) {
		return userService.getReplys(forumid, pageIndex, pageSize);
	}
	
	//发表回复
	@RequestMapping("/reply")
	public String reply(HttpServletRequest request) {
		return userService.reply(request);
	}
	
	//删除回复(删了就是真删了)
	@RequestMapping("/deleteReply")
	public String deleteReply(HttpServletRequest request) {
		return userService.deleteReply(request);
	}

}
