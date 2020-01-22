package org.raine.book.controller;

import java.util.HashMap;
import java.util.Map;

import org.raine.book.service.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.data.domain.Page;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/main")
public class MainController {
	
	@Value("${bookClassify.quantity}")
	int BOOKCLASSIFY_QUANTITY;//分类的数量,方便查询各分类的排行榜以及后续修改
	@Autowired
	UserService userService;
	
	//获取传送带物品信息
	@RequestMapping("/getBox")
	public Page<?> getBox() {
		return userService.getBox();
	}
	
	//找人气最高的几个
	@RequestMapping("/getMostPopular")
	public Page<?> getMostPopular() {
		return userService.getMostPopular();
	}
	
	//找各分类人气最高的几个
	@RequestMapping("/getPopularByClassify")
	public Map<Integer,Page<?>> getPopularByClassify() {
		Map<Integer,Page<?>> bookmap = new HashMap<Integer,Page<?>>();
		Page<?> booklist = null;
		for(int i=0; i<BOOKCLASSIFY_QUANTITY; i++) {
			booklist = userService.getPopularByGroup(i);
			bookmap.put(i, booklist);
		}
		return bookmap;
	}
}
