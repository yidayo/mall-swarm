package org.raine.book.dao.repo;

import java.util.List;

import org.raine.book.dao.bean.Lihui;
import org.springframework.data.jpa.repository.JpaRepository;

public interface LihuiRepository extends JpaRepository<Lihui,Integer> {
	//根据用户Id查找立绘Id
	List<Integer> findLihuiidByUserid(int userid);
}
