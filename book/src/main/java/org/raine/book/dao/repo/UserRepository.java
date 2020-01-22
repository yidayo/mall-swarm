package org.raine.book.dao.repo;

import java.util.List;

import org.raine.book.dao.bean.User;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.transaction.annotation.Transactional;

public interface UserRepository extends JpaRepository<User,Integer> {
	//根据用户名查找用户
	List<User> findByUsername(String username);
	//根据用户名和密码查找用户
	User findByUsernameAndPassword(String username,String password);
	//id,状态,用户名多条件模糊查询,分页
	Page<User> findByUseridContainingAndStateContainingAndUsernameContaining(int userid,int state,String username,Pageable pageable);
	//批量锁定&恢复
	@Transactional
	@Modifying//只需要加在update和delete SQL注解前
	@Query(value="update user set status=?1 where id in (?2)",nativeQuery=true)
	int adminStatus(int status,List<Integer> idArr);
	//请求用户id,头像,用户名
	@Transactional
	@Query(value="select userid,username,img from user where userid in (?1)", nativeQuery=true)
	List<Object[]> getHeadsAndUsernames(List<Integer> userid);
}
