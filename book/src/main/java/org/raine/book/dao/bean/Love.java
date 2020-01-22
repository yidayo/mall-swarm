package org.raine.book.dao.bean;

import javax.persistence.Entity;
import javax.persistence.GeneratedValue;
import javax.persistence.Id;

@Entity
public class Love {
	@Id
	@GeneratedValue
	private long loveid;
	private int userid;
	private int bookid;
	private int display;//别人是否可见
	public Love() {}
	public long getLoveid() {
		return loveid;
	}
	public void setLoveid(long loveid) {
		this.loveid = loveid;
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
	public int getDisplay() {
		return display;
	}
	public void setDisplay(int display) {
		this.display = display;
	}
	@Override
	public String toString() {
		return "Love [Loveid=" + loveid + ", userid=" + userid + ", bookid=" + bookid + ", display=" + display + "]";
	}
}
