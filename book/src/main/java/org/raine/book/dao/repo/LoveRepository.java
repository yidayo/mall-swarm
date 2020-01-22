package org.raine.book.dao.repo;

import org.raine.book.dao.bean.Love;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.transaction.annotation.Transactional;

public interface LoveRepository extends JpaRepository<Love,Long> {
	//通过bookid和userid删除收藏记录
	@Transactional
	@Modifying//只需要加在update和delete sql注解前
	@Query(value="delete from love where bookid=?1 and userid=?2", nativeQuery=true)
	int deleteLove(int bookid,int userid);
	//根据userid和bookid统计条数(通常为1和0)
	int countByUseridAndBookid(int userid,int bookid);
}
