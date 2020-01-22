package org.raine.book.service;

import java.util.List;
import java.util.Map;

import javax.servlet.http.HttpServletRequest;

import org.raine.book.dao.bean.Book;
import org.raine.book.dao.bean.Box;
import org.raine.book.dao.bean.Message;
import org.raine.book.dao.bean.User;
import org.springframework.data.domain.Page;
import org.springframework.stereotype.Service;

@Service
public interface UserService {
	//查看用户名是否重复
	public int findByUsername(String username);
	//注册
	public String registe(HttpServletRequest request);
	//登陆
	public String login(HttpServletRequest request);
	//注销
	public String logout(HttpServletRequest request);
	//修改个人信息
	public String updateUserinfo(HttpServletRequest request);
	//获取个人信息√
	public User getUserinfo(HttpServletRequest request);
	
	//获取他人信息
	public User getOtherinfo(int userid);
	//获取他人立绘id
	public List<Integer> getOthersLihuiId(int userid);
	//获取他人作品
	public List<Book> getOthersBook(int userid);
	//获取他人收藏
	public List<Book> getOthersLove(int userid);
	//获取他人评论
	public List<Object[]> getOthersComment(int userid,int pageIndex,int pageSize);
	
	//创建漫画
	public String createBook(HttpServletRequest request);
	//修改已有的章节与上传新章节
	public String updateBook(HttpServletRequest request);
	//获取漫画
	public Book getBook(int bookid);
	//搜索漫画
	public Page<Book> searchBook(String bookname,int pageIndex,int pageSize);
	//添加时间轴
	public String createTimeline(HttpServletRequest request);
	//修改时间轴
	public String updateTimeline(HttpServletRequest request);
	//查看是否收藏
	public String getLove(HttpServletRequest request);
	//收藏漫画或者取消收藏漫画
	public String love(HttpServletRequest request);
	//评论
	public String comment(HttpServletRequest request);
	//获取评论
	public List<Object[]> getComment(int bookid,int pageIndex,int pageSize);
	
	//获取传送带物品信息
	public Page<Box> getBox();
	//找人气最高的几个
	public Page<Book> getMostPopular();
	//依照分类找人气最高的几个
	public Page<Book> getPopularByGroup(int groupid);
	
	//获取消息(所有没删除/隐藏的消息)
	public List<Message> getMessages(HttpServletRequest request);
	//向某人发消息
	public String sendMessage(HttpServletRequest request);
	//删除消息(其实是修改对自己的可见状态)
	public String deleteMessage(HttpServletRequest request);
	//请求头像
	public Map<String,Object[]> getHeadsAndUsernames(List<Integer> userid);
}
