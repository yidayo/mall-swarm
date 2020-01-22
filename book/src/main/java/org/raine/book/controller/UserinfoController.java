package org.raine.book.controller;

import java.util.List;

import org.raine.book.dao.bean.Book;
import org.raine.book.dao.bean.User;
import org.raine.book.service.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/userinfo")
public class UserinfoController {

	@Autowired
	UserService userService;
	
	//获取他人信息
	@RequestMapping("/getOtherinfo")
	public User getOtherinfo(int userid) {
		return userService.getOtherinfo(userid);
	}
	
	//获取他人立绘id
	@RequestMapping("/getOthersLihuiId")
	public List<?> getOthersLihuiId(int userid) {
		return userService.getOthersLihuiId(userid);
	}
	
	//获取他人作品
	@RequestMapping("/getOthersBook")
	public List<?> getOthersBook(int userid) {
		return userService.getOthersBook(userid);
		//返回全部(就算作者能画一百部作品也全显示在主页上,创作的热情不应该被埋没)
	}
	
	//获取他人收藏
	@RequestMapping("/getOthersLove")
	public List<Book> getOthersLove(int userid) {
		return userService.getOthersLove(userid);
		//只返回五条(我真是个小机灵鬼,写接口实现的时候就考虑到可能会太多,所以直接写死了)
	}
	
	//获取他人评论
	@RequestMapping("/getOthersComment")
	public List<Object[]> getOthersComment(int userid,int pageIndex,int pageSize) {
		return userService.getOthersComment(userid,pageIndex,pageSize);
	}
}
