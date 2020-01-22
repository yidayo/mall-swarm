package org.raine.book.dao.bean;

import javax.persistence.Entity;
import javax.persistence.GeneratedValue;
import javax.persistence.Id;

@Entity
public class Groupname {
	@Id
	@GeneratedValue
	private int groupnameid;
	private int groupname;
	public Groupname() {}
	public int getGroupnameid() {
		return groupnameid;
	}
	public void setGroupnameid(int groupnameid) {
		this.groupnameid = groupnameid;
	}
	public int getGroupname() {
		return groupname;
	}
	public void setGroupname(int groupname) {
		this.groupname = groupname;
	}
	@Override
	public String toString() {
		return "Groupname [groupnameid=" + groupnameid + ", groupname=" + groupname + "]";
	}
}
