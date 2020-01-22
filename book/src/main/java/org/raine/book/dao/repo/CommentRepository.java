package org.raine.book.dao.repo;

import java.util.List;

import org.raine.book.dao.bean.Comment;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.transaction.annotation.Transactional;

public interface CommentRepository extends JpaRepository<Comment,Long> {
	//获取他人评论
	Page<Comment> findByUserid(int userid,Pageable pageable);
	/*//根据bookid获取评论
	List<Comment> findCommentByBookidOrderByTimeDesc(int bookid,Pageable pageable);*/
	//根据bookid获取评论
	@Transactional
	@Query(value="select c.commentid,u.userid,u.username,u.img,u.introduce,c.bookid,c.comment,c.time from user u,comment c where c.userid=u.userid and c.bookid=?1 order by c.commentid desc limit ?2,?3",nativeQuery=true)
	List<Object[]> getComment(int bookid,int begin,int pageSize);
}
