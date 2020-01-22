package org.raine.book.dao.repo;

import java.util.List;

import org.raine.book.dao.bean.Book;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.transaction.annotation.Transactional;

public interface BookRepository extends JpaRepository<Book,Integer> {
	//获取他人作品
	List<Book> findByUserid(int userid);
	//根据bookid查找书籍
	Book findByBookid(int bookid);
	//根据关键词模糊查找漫画
	Page<Book> findByBooknameContaining(String bookname,Pageable pageable);
	//根据bookid修改收藏数(增加love条)
	@Transactional
	@Modifying//只需要加在update和delete SQL注解前
	@Query(value="update book set love=love+(?1) where bookid=(?2)",nativeQuery=true)
	int updateBookLove(int love,int bookid);
	//根据bookid修改评论数(增加一条)
	@Transactional
	@Modifying//只需要加在update和delete SQL注解前
	@Query(value="update book set comment=comment+?1 where bookid=(?2)",nativeQuery=true)
	int updateBookComment(int comment,int bookid);
	//根据评论数排序获取前十名
	Page<Book> findByOrderByLoveDesc(Pageable pageable);
	//根据评论数和分类id获取革分类中人气最高的十个
	Page<Book> findByGroupnameidOrderByLoveDesc(int groupnameid,Pageable pageable);
	//通过userid获取公开(或非公开)的收藏的book(只要前五条)
	@Transactional
	@Query(value="select b.* from book b,love l where l.userid=?1 and l.display=?2 and l.bookid=b.bookid limit 5", nativeQuery=true)
	List<Book> findLoveBookByUseridAndDisplay(int userid,int display);
	//根据userid获取评论(返回book*,commentid,comment,time)(根据评论id倒序)
	@Transactional
	@Query(value="select b.*,c.commentid,c.comment as commenttext,c.time from book b,comment c where c.bookid=b.bookid and c.userid=?1 order by c.commentid desc limit ?2,?3",nativeQuery=true)
	List<Object[]> getCommentByUserid(int userid,int begin,int pageSize);
}
