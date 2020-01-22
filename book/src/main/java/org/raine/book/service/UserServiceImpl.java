package org.raine.book.service;

import java.io.File;
import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.sql.Timestamp;
import java.util.Date;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpSession;

import org.raine.book.dao.bean.Book;
import org.raine.book.dao.bean.Box;
import org.raine.book.dao.bean.Comment;
import org.raine.book.dao.bean.Love;
import org.raine.book.dao.bean.Message;
import org.raine.book.dao.bean.User;
import org.raine.book.dao.repo.BookRepository;
import org.raine.book.dao.repo.BoxRepository;
import org.raine.book.dao.repo.CommentRepository;
import org.raine.book.dao.repo.GoodsRepository;
import org.raine.book.dao.repo.GroupnameRepository;
import org.raine.book.dao.repo.LihuiRepository;
import org.raine.book.dao.repo.LoveRepository;
import org.raine.book.dao.repo.MessageRepository;
import org.raine.book.dao.repo.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;
import org.springframework.web.multipart.MultipartHttpServletRequest;

@Service
public class UserServiceImpl implements UserService {
	
	@Value("${data.head}")
	String HEAD_LOCATION;//头像的保存位置
	@Value("${data.bookimg")
	String BOOKIMG_LOCATION;//漫画封面保存位置
	
	@Autowired
	BookRepository bookRepository;//作品
	@Autowired
	BoxRepository boxRepository;//传送带
	@Autowired
	CommentRepository commentRepository;//评论
	@Autowired
	GoodsRepository goodsRepository;//传送带备选物品
	@Autowired
	GroupnameRepository groupnameRepository;//类别
	@Autowired
	LihuiRepository lihuiRepository;//立绘
	@Autowired
	LoveRepository loveRepository;//收藏
	@Autowired
	MessageRepository messageRepository;//短消息
	@Autowired
	UserRepository userRepository;//用户
	
	//查找用户名是否重复
	public int findByUsername(String username) {
		List<User> list = userRepository.findByUsername(username);
		return list.size();//如果为零说明用户名不重复
	}

	//注册
	public String registe(HttpServletRequest request) {
		//↓获取路径
		String urlPath = Thread.currentThread().getContextClassLoader().getResource("").getPath().substring(1);
		//↑获取路径
		User user = new User();
		//↓表单中的数据
		String username = request.getParameter("username");
		user.setUsername(username);
		String password = request.getParameter("password");
		user.setPassword(password);
		//↑表单中的数据
		user.setState(0);
		user.setImg("");//先存空字符串
		user = userRepository.save(user);
		System.out.println(user);
		//↓处理上传的图片
		MultipartHttpServletRequest multipartRequest = (MultipartHttpServletRequest) request;
		MultipartFile file = multipartRequest.getFile("img");
		if (file.isEmpty()) {
			return "图片为空";
		}
		String userid = ""+user.getUserid();//获取id
		String fileName = file.getOriginalFilename();//获取上传文件的文件名
		String end = fileName.substring(fileName.lastIndexOf("."),fileName.length());//获取上传文件后缀
		File p = new File(urlPath+HEAD_LOCATION);//看看这个文件夹有没有
        if (!p.exists()) {
        	p.mkdirs();
        }
		try {
			byte[] bytes = file.getBytes();//获取上传文件的字节流
			Path path = Paths.get(urlPath,HEAD_LOCATION, userid+end);//定义保存路径nio包←我也不知道为什么这么叫
			Files.write(path, bytes);//写入最终保存的位置
		} catch (IOException e) {
			System.out.println("处理图片出问题了");
			e.printStackTrace();
		}
		//↑处理上传的图片
		user.setImg(userid+end);
		userRepository.save(user);//更新数据库头像文件路径
		System.out.println("注册成功");
		//↓附带登陆
		HttpSession session = request.getSession();
		session.setAttribute("user", user);
		System.out.println(session.getAttribute("user"));
		//↑附带登陆
		return "注册成功";
	}

	//登陆
	public String login(HttpServletRequest request) {
		//↓表单中的数据
		String username = request.getParameter("username");
		String password = request.getParameter("password");
		//↑表单中的数据
		User user = userRepository.findByUsernameAndPassword(username, password);
		//↓session
		if(user!=null) {
			HttpSession session = request.getSession();
			session.setAttribute("user", user);
			System.out.println(session.getAttribute("user"));
			return "0";//这是登陆成功的,把数据存进session了
		}
		//↑session
		return "1";//这是登陆不成功的
	}

	//注销
	public String logout(HttpServletRequest request) {
		HttpSession session = request.getSession();
		session.removeAttribute("user");
		return "注销成功";
	}

	//修改个人信息(需要修改)
	public String updateUserinfo(HttpServletRequest request) {
		//↓从session中查找这个用户
		User user = getUserinfo(request);
		if(user==null) return "客官未登录";
		//↑从session中查找这个用户
		//↓处理表单中的数据
		String username = request.getParameter("username");
		int count = findByUsername(username);//同名的个数
		if(count!=0) {
			return "用户名重复";
		}
		user.setUsername(username);
		String password = request.getParameter("password");
		user.setPassword(password);
		//↑处理表单中的数据
		user.setState(0);
		//↓处理上传的图片
		MultipartHttpServletRequest multipartRequest = (MultipartHttpServletRequest) request;
		MultipartFile file = multipartRequest.getFile("img");
		if (!file.isEmpty()) {//如果想修改图片
			//↓获取路径
			String urlPath = Thread.currentThread().getContextClassLoader().getResource("").getPath().substring(1);
			//↑获取路径
			String userid = ""+user.getUserid();//获取id
			String fileName = file.getOriginalFilename();//获取上传文件的文件名
			String end = fileName.substring(fileName.lastIndexOf("."),fileName.length());//获取上传文件后缀
			try {
				byte[] bytes = file.getBytes();//获取上传文件的字节流
				Path path = Paths.get(urlPath,HEAD_LOCATION, userid+end);//定义保存路径nio包←我也不知道为什么这么叫
				Files.write(path, bytes);//写入最终保存的位置
			} catch (IOException e) {
				System.out.println("处理图片出问题了");
				e.printStackTrace();
				return "图片上传失败";
			}
			user.setImg(userid+end);
		}
		//↑处理上传的图片
		userRepository.save(user);//更新数据库头像文件路径
		System.out.println("修改成功");
		//↓附带刷新登陆信息
		HttpSession session = request.getSession();
		session.setAttribute("user", user);
		System.out.println(session.getAttribute("user"));
		//↑附带刷新登陆信息
		return "修改成功";
	}

	//获取个人信息
	public User getUserinfo(HttpServletRequest request) {
		HttpSession session = request.getSession();
		User sessionUser = (User) session.getAttribute("user");
		if(sessionUser==null) return null;
		User user = new User();
		user.setUserid(sessionUser.getUserid());
		user.setUsername(sessionUser.getUsername());
		user.setImg(sessionUser.getImg());
		return user;
	}

	//获取他人信息
	public User getOtherinfo(int userid) {
		User user = userRepository.findOne(userid);
		user.setPassword("");
		return user;
	}
	
	//获取他人立绘Id
	public List<Integer> getOthersLihuiId(int userid) {
		return lihuiRepository.findLihuiidByUserid(userid);
	}

	//获取他人作品
	public List<Book> getOthersBook(int userid) {
		return bookRepository.findByUserid(userid);
	}

	//获取他人收藏
	public List<Book> getOthersLove(int userid) {//只要前五条
		List<Book> booklist = bookRepository.findLoveBookByUseridAndDisplay(userid,1);//1表示可见
		return booklist;
	}

	//获取他人评论
	public List<Object[]> getOthersComment(int userid,int pageIndex,int pageSize) {
		int begin = (pageIndex-1)*pageSize;
		List<Object[]> commentList = bookRepository.getCommentByUserid(userid, begin, pageSize);
		return commentList;
	}

	//创建新书
	public String createBook(HttpServletRequest request) {
		//↓获取路径
		String urlPath = Thread.currentThread().getContextClassLoader().getResource("").getPath().substring(1);
		//↑获取路径
		Book book = new Book();
		//↓表单中的数据
		String bookname = request.getParameter("bookname");
		book.setBookname(bookname);
		String groupnameid = request.getParameter("groupnameid");
		book.setGroupnameid(Integer.parseInt(groupnameid));
		//↑表单中的数据
		//↓处理session中的信息
		User user = getUserinfo(request);
		if(user==null) return "客官未登录";
		book.setUserid(user.getUserid());
		//↑处理session中的信息
		//处理默认数据
		book.setLihui(0);
		book.setLove(0);
		book.setComment(0);
		book.setTimeline(0);
		book = bookRepository.save(book);
		//处理默认数据
		System.out.println(book);
		//↓处理上传的图片
		MultipartHttpServletRequest multipartRequest = (MultipartHttpServletRequest) request;
		MultipartFile file = multipartRequest.getFile("img");
		if (file.isEmpty()) {
			return "图片为空";
		}
		String bookid = ""+book.getBookid();//获取id
		String fileName = file.getOriginalFilename();//获取上传文件的文件名
		String end = fileName.substring(fileName.lastIndexOf("."),fileName.length());//获取上传文件后缀
		File p = new File(urlPath+BOOKIMG_LOCATION);//看看这个文件夹有没有
        if (!p.exists()) {
        	p.mkdirs();
        }
		try {
			byte[] bytes = file.getBytes();//获取上传文件的字节流
			Path path = Paths.get(urlPath,BOOKIMG_LOCATION, bookid+end);//定义保存路径nio包←我也不知道为什么这么叫
			Files.write(path, bytes);//写入最终保存的位置
		} catch (IOException e) {
			System.out.println("处理图片出问题了");
			e.printStackTrace();
		}
		//↑处理上传的图片
		System.out.println("图片更新成功");
		return "新书创建成功";
	}

	public String updateBook(HttpServletRequest request) {
		// TODO Auto-generated method stub
		return null;
	}
	
	//获取漫画
	public Book getBook(int bookid) {
		return bookRepository.findByBookid(bookid);
	}

	//搜索漫画
	public Page<Book> searchBook(String bookname,int pageIndex,int pageSize) {
		Pageable pageable = new PageRequest(pageIndex-1, pageSize);//第一页,每页五个(就是前五条)
		return bookRepository.findByBooknameContaining(bookname, pageable);
	}

	public String createTimeline(HttpServletRequest request) {
		// TODO Auto-generated method stub
		return null;
	}

	public String updateTimeline(HttpServletRequest request) {
		// TODO Auto-generated method stub
		return null;
	}
	
	//查看是否收藏
	public String getLove(HttpServletRequest request) {
		//↓处理session中的数据
		User user = getUserinfo(request);
		if(user==null) {
			return "客官未登录";
		}
		int userid = user.getUserid();//获取userid
		//↑处理session中的数据
		//↓处理表单中的数据
		int bookid = Integer.parseInt(request.getParameter("bookid"));
		int count = loveRepository.countByUseridAndBookid(userid,bookid);
		if(count>0) {
			return ""+1;
		} else {
			return ""+0;
		}
	}
	
	//收藏漫画或者取消收藏漫画
	public String love(HttpServletRequest request) {
		Love love = new Love();
		//↓处理session中的数据
		User user = getUserinfo(request);
		if(user==null) {
			return "客官未登录";
		}
		int userid = user.getUserid();//获取userid
		love.setUserid(userid);
		//↑处理session中的数据
		//↓处理表单中的数据
		int loveflag = Integer.parseInt(request.getParameter("loveflag"));//1添加收藏,0取消收藏
		int bookid = Integer.parseInt(request.getParameter("bookid"));
		int display = Integer.parseInt(request.getParameter("display"));//1展示,0隐藏
		love.setBookid(bookid);
		love.setDisplay(display);
		//↑处理表单中的数据
		//↓修改love表
		try {
			if(loveflag==1) {
				loveRepository.save(love);//收藏
			} else if(loveflag==0) {
				loveRepository.deleteLove(bookid, userid);//取消收藏
			} else {
				return "前端传错数据了=-=";
			}
		} catch (Exception e) {
			System.out.println("修改love表出错了");
			e.printStackTrace();
			return "修改love表出错了";
		}
		//↑修改love表
		//↓修改book表
		int loveNum = loveflag==1?1:-1;//updateBooklove方法的参数1
		int successNum = bookRepository.updateBookLove(loveNum, bookid);
		if (successNum<1) {
			System.out.println("收藏数没有改变");
			return "收藏数没有改变";
		}
		//↑修改love表
		if(loveflag==1) {
			return "收藏成功,默认不展示~";//收藏
		} else {
			return "已取消收藏~";//取消收藏
		}
	}

	//评论漫画
	public String comment(HttpServletRequest request) {
		Comment comment = new Comment();
		//↓处理session中的数据
		User user = getUserinfo(request);
		if(user==null) {
			return "客官未登录";
		}
		int userid = user.getUserid();//获取userid
		comment.setUserid(userid);
		//↑处理session中的数据
		//↓处理表单中的数据
		int bookid = Integer.parseInt(request.getParameter("bookid"));
		String commentText = request.getParameter("comment");
		comment.setBookid(bookid);
		comment.setComment(commentText);
		//↑处理表单中的数据
		//↓修改comment表
		try {
			commentRepository.save(comment);//取消收藏
		} catch (Exception e) {
			System.out.println("修改comment表出错了");
			e.printStackTrace();
			return "修改comment表出错了";
		}
		//↑修改comment表
		//↓修改book表
		int successNum = bookRepository.updateBookComment(1,bookid);
		if (successNum<1) {
			System.out.println("评论数没有改变");
			return "评论数没有改变";
		}
		//↑修改book表
		return "修改成功";
	}

	//获取评论
	public List<Object[]> getComment(int bookid,int pageIndex,int pageSize) {
		int begin = (pageIndex-1)*pageSize;
		return commentRepository.getComment(bookid,begin,pageSize);
	}

	//获取传送带列表
	public Page<Box> getBox() {
		Pageable pageable = new PageRequest(0,10);//前十个
		Page<Box> pagebox = boxRepository.findByOrderBySequenceAsc(pageable);
		System.out.println(pagebox);
		return pagebox;
	}

	//所有类别中获取人气最高的(评论最多的)
	public Page<Book> getMostPopular() {
		Pageable pageable = new PageRequest(0,10);//前十个
		return bookRepository.findByOrderByLoveDesc(pageable);
	}

	//获取某分类中人气最高的(评论最多的)
	public Page<Book> getPopularByGroup(int groupid) {
		Pageable pageable = new PageRequest(0,10);//前十个
		return bookRepository.findByGroupnameidOrderByLoveDesc(groupid, pageable);
	}

	//获取消息(所有没删除/隐藏的消息)
	public List<Message> getMessages(HttpServletRequest request) {
		List<Message> messageList = messageRepository.getMessages(0);
		//↓处理session信息
		User user = getUserinfo(request);
		if(user!=null) {
			List<Message> userMessages = messageRepository.getMessages(user.getUserid());
			messageList.addAll(userMessages);
		}
		//↑处理session信息
		return messageList;
	}

	//向某人发消息
	public String sendMessage(HttpServletRequest request) {
		Message message = new Message();
		User user = getUserinfo(request);
		if(user==null) {
			return "客官未登录";
		}
		int senderid = user.getUserid();
		//↓处理表单中的数据
		int receiverid = Integer.parseInt(request.getParameter("receiverid"));
		String text = request.getParameter("text");
		message.setSenderid(senderid);//发送者(本人)
		message.setReceiverid(receiverid);//接收者(表单中数据)
		message.setState(3);//双方都能看见
		message.setText(text);//发送的消息
		message.setTime(new Timestamp(new Date().getTime()));
		//↑处理表单中的数据
		long messageid = messageRepository.save(message).getMessageid();
		return ""+messageid;//返回messageid
	}

	//删除消息(其实是修改对自己的可见状态)
	public String deleteMessage(HttpServletRequest request) {
		User user = getUserinfo(request);
		if(user==null) {
			return "未登录";
		}
		int userid = user.getUserid();//自己id
		int theotherid = Integer.parseInt(request.getParameter("theotherid"));//对方id
		int d0 = messageRepository.deleteMessage0(userid, theotherid);
		int d1 = messageRepository.deleteMessage1(theotherid, userid);
		int d2 = messageRepository.deleteMessage2(theotherid, userid);
		int d3 = messageRepository.deleteMessage3(userid, theotherid);
		int count = d0+d1+d2+d3;
		return ""+count;//返回的是修改的条数
	}
	
	//请求id,用户名和头像
	public Map<String,Object[]> getHeadsAndUsernames(List<Integer> userid) {
		List<Object[]> userList = userRepository.getHeadsAndUsernames(userid);
		Map<String,Object[]> userMiniMap= new HashMap<String,Object[]>();
		String key = null;
		for (Object[] value : userList) {
			key = ""+value[0];//userid
			userMiniMap.put(key, value);
		}
		return userMiniMap;
	}
}