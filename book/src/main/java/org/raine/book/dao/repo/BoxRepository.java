package org.raine.book.dao.repo;

import org.raine.book.dao.bean.Box;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;

public interface BoxRepository extends JpaRepository<Box,Integer> {
	//根据order排序,返回所有传送带的信息
	Page<Box> findByOrderBySequenceAsc(Pageable pageable);
}
