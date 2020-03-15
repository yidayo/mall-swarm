package org.raine.book.dao.repo;

import org.raine.book.dao.bean.Reply;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.transaction.annotation.Transactional;

public interface ReplyRepository extends JpaRepository<Reply,Integer>{
	//根据帖子id分页获取回复
	Page<Reply> findByForumid(int forumid,Pageable pageable);
	//根据帖子id批量删除回复
	@Transactional
	void deleteByForumid(int forumid);
}
