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
	//根据forumid查找某一条帖子
	@Transactional
	@Modifying//只需要加在update和delete SQL注解前
	@Query(value="select f.forumid,u.userid,u.username,u.img,u.introduce,f.topic,f.text,f.comment,f.time from user u,forum f where f.userid=u.userid and f.forumid=?1",nativeQuery=true)
	Object[] findByForumid(int forumid);
	//根据forumid修改评论(增加一条)
	@Transactional
	@Modifying//只需要加在update和delete SQL注解前
	@Query(value="update forum set comment=comment+?1 where forumid=(?2)",nativeQuery=true)
	int updateForumComment(int comment,int forumid);
	//根据帖子id获取回复的条数(怀疑可能是涉及到comment这个关键字导致不能用jpa)
	@Transactional
	@Query(value="select comment from forum where forumid=?1",nativeQuery=true)
	int findCommentByForumid(int forumid);
}
