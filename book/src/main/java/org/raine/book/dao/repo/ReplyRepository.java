package org.raine.book.dao.repo;

import java.util.List;

import org.raine.book.dao.bean.Reply;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.transaction.annotation.Transactional;

public interface ReplyRepository extends JpaRepository<Reply,Integer>{
	//根据帖子id分页获取回复
	@Transactional
	@Query(value="select r.replyid,u.userid,u.username,u.img,u.introduce,r.forumid,r.comment,r.time from (select replyid,userid,forumid,comment,time from reply where replyid>=(select replyid from reply where forumid=?1 limit ?2,1) and forumid=?1 limit ?3) r,user u where r.userid=u.userid",nativeQuery=true)
	List<Object[]> findByForumid(int forumid,int begin,int pageSize);
	//根据帖子id批量删除回复
	@Transactional
	void deleteByForumid(int forumid);
}
