package org.raine.book.dao.repo;

import java.util.List;

import org.raine.book.dao.bean.Message;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.transaction.annotation.Transactional;

public interface MessageRepository extends JpaRepository<Message,Long> {
	//查找"发件人为userid,state为1或3"以及"收件人为userid,state为2或3"的消息
	@Transactional
	@Query(value="select * from message where (senderid=?1 and (state=1 or state=3)) or (receiverid=?1 and (state=2 or state=3))",nativeQuery=true)
	List<Message> getMessages(int userid);
	//将自己发送的且只有自己可见的消息改为双方都不可见:1→0(01→00)
	@Transactional
	@Modifying//只需要加在update和delete SQL注解前
	@Query(value="update message set state=0 where senderid=?1 and receiverid=?2 and state=1",nativeQuery=true)
	int deleteMessage0(int userid,int receiverid);
	//将对方发送的且只有自己可见的消息改为双方都不可见:2→0(10→00)
	@Transactional
	@Modifying//只需要加在update和delete SQL注解前
	@Query(value="update message set state=0 where senderid=?1 and receiverid=?2 and state=2",nativeQuery=true)
	int deleteMessage1(int senderid,int userid);
	//将对方发送的且双方都可见的消息改为只有对方可见:3→1(11→01)
	@Transactional
	@Modifying//只需要加在update和delete SQL注解前
	@Query(value="update message set state=1 where senderid=?1 and receiverid=?2 and state=3",nativeQuery=true)
	int deleteMessage2(int senderid,int userid);
	//将自己发送的且双方都可见的消息改为只有对方看见3→2(11→10)
	@Transactional
	@Modifying//只需要加在update和delete SQL注解前
	@Query(value="update message set state=2 where senderid=?1 and receiverid=?2 and state=3",nativeQuery=true)
	int deleteMessage3(int userid,int receiverid);
}
