package org.raine.book.dao.bean;

import javax.persistence.Entity;
import javax.persistence.GeneratedValue;
import javax.persistence.Id;

@Entity
public class Lihui {
	@Id
	@GeneratedValue
	private int lihuiid;
	private int userid;
	private int bookid;
	public Lihui() {}
	public int getLihuiid() {
		return lihuiid;
	}
	public void setLihuiid(int lihuiid) {
		this.lihuiid = lihuiid;
	}
	public int getUserid() {
		return userid;
	}
	public void setUserid(int userid) {
		this.userid = userid;
	}
	public int getBookid() {
		return bookid;
	}
	public void setBookid(int bookid) {
		this.bookid = bookid;
	}
	@Override
	public String toString() {
		return "Lihui [lihuiid=" + lihuiid + ", userid=" + userid + ", bookid=" + bookid + "]";
	}
}
