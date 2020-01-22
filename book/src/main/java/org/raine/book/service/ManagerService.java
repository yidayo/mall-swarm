package org.raine.book.service;

import java.util.List;

import javax.servlet.http.HttpServletRequest;

import org.raine.book.dao.bean.Book;
import org.raine.book.dao.bean.Goods;
import org.raine.book.dao.bean.User;
import org.springframework.stereotype.Service;

@Service
public interface ManagerService {
	//登陆
	public String login(HttpServletRequest request);
	//注销
	public String logout(HttpServletRequest request);
	
	//搜索用户
	public List<User> searchUser(HttpServletRequest request);
	//冻结用户
	public List<Boolean> iceUser(HttpServletRequest request);
	//搜索漫画
	public List<Book> searchBook(HttpServletRequest request);
	//冻结漫画
	public List<Boolean> iceBook(HttpServletRequest request);

	//添加传送带备选物品
	public List<Goods> addGood(HttpServletRequest request);
	//删除传送带备选物品
	public boolean delGood(int goodid);
	//修改传送带
	public List<Goods> updateBox(HttpServletRequest request);
	
	
	//向某人发送消息
	public boolean sendMessage(HttpServletRequest request);
	//删除消息(其实是修改对自己的可见状态)
	public boolean delete(int senderId);
}
