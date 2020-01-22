package org.raine.book.dao.bean;

import javax.persistence.Entity;
import javax.persistence.GeneratedValue;
import javax.persistence.Id;

@Entity
public class User {
	@Id
	@GeneratedValue
	private int userid;
	private String username;
	private String img;//头像文件名
	private String introduce;//介绍
	private String password;
	private int state;//0正常,1冻结
	private int kanban;//是否有看板
	public User() {}
	public int getUserid() {
		return userid;
	}
	public void setUserid(int userid) {
		this.userid = userid;
	}
	public String getUsername() {
		return username;
	}
	public void setUsername(String username) {
		this.username = username;
	}
	public String getImg() {
		return img;
	}
	public void setImg(String img) {
		this.img = img;
	}
	public String getIntroduce() {
		return introduce;
	}
	public void setIntroduce(String introduce) {
		this.introduce = introduce;
	}
	public String getPassword() {
		return password;
	}
	public void setPassword(String password) {
		this.password = password;
	}
	public int getState() {
		return state;
	}
	public void setState(int state) {
		this.state = state;
	}
	public int getKanban() {
		return kanban;
	}
	public void setKanban(int kanban) {
		this.kanban = kanban;
	}
	@Override
	public String toString() {
		return "User [userid=" + userid + ", username=" + username + ", img=" + img + ", introduce=" + introduce
				+ ", password=" + password + ", state=" + state + ", kanban=" + kanban + "]";
	}
}
