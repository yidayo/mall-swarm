package org.raine.book.controller;

import org.raine.book.dao.bean.Book;
import org.raine.book.service.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/search")
public class SearchController {

	@Autowired
	UserService userService;
	
	//搜索漫画
	@RequestMapping("/searchBook")
	public Page<Book> searchBook(String bookname,int pageIndex,int pageSize) {
		return userService.searchBook(bookname,pageIndex,pageSize);
	}
}
