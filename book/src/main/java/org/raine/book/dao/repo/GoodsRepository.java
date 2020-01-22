package org.raine.book.dao.repo;

import org.raine.book.dao.bean.Goods;
import org.springframework.data.jpa.repository.JpaRepository;

public interface GoodsRepository extends JpaRepository<Goods,Integer> {

}
