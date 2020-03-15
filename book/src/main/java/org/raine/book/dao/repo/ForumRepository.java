package org.raine.book.dao.repo;

import org.raine.book.dao.bean.Forum;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.transaction.annotation.Transactional;

public interface ForumRepository extends JpaRepository<Forum,Integer> {
	//按最后回复时间排序,分页获取帖子列表
	Page<Forum> findByOrderByTimeDesc(Pageable pageable);
	//根据forumid修改评论(增加一条)
	@Transactional
	@Modifying//只需要加在update和delete SQL注解前
	@Query(value="update forum set comment=comment+?1 where forumid=(?2)",nativeQuery=true)
	int updateForumComment(int comment,int forumid);
}
