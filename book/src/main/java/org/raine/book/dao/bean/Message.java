package org.raine.book.dao.bean;

import java.sql.Timestamp;

import javax.persistence.Entity;
import javax.persistence.GeneratedValue;
import javax.persistence.Id;

@Entity
public class Message {
	@Id
	@GeneratedValue
	private long messageid;
	private int senderid;
	private int receiverid;
	private int state;
	private String text;
	private Timestamp time;
	public Message() {}
	public long getMessageid() {
		return messageid;
	}
	public void setMessageid(long messageid) {
		this.messageid = messageid;
	}
	public int getSenderid() {
		return senderid;
	}
	public void setSenderid(int senderid) {
		this.senderid = senderid;
	}
	public int getReceiverid() {
		return receiverid;
	}
	public void setReceiverid(int receiverid) {
		this.receiverid = receiverid;
	}
	public int getState() {
		return state;
	}
	public void setState(int state) {
		this.state = state;
	}
	public String getText() {
		return text;
	}
	public void setText(String text) {
		this.text = text;
	}
	public Timestamp getTime() {
		return time;
	}
	public void setTime(Timestamp time) {
		this.time = time;
	}
	@Override
	public String toString() {
		return "Message [messageid=" + messageid + ", senderid=" + senderid + ", receiverid=" + receiverid + ", state="
				+ state + ", text=" + text + ", time=" + time + "]";
	}
}
