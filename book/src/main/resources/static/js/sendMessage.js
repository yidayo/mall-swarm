var receiverid=0,receivername=0;
function sendMessageModal() {//创建发消息模态框的方法名
	$("body").prepend('<div class="modal fade" id="messageModal" tabindex="-1" role="dialog" aria-labelledby="myModalLabel" aria-hidden="true"><div class="modal-dialog"><div class="modal-content"><div class="modal-header"><button type="button" class="close" data-dismiss="modal" aria-hidden="true">&times;</button><h4 class="modal-title" id="myModalLabel">给 '+receivername+' 发消息:</h4></div><div class="modal-body"><textarea class="form-control" rows="3"></textarea></div><div class="modal-footer"><button type="button" onclick="send()" class="btn btn-primary" data-dismiss="modal">发送</button></div></div></div></div>');
	$('#messageModal').modal('show');
};
function send() {
	var text = $("#messageModal textarea").val();
	if(text=="") return;
	var fd = new FormData();//创建FormData
	fd.set("receiverid",receiverid);
	fd.set("text",text);
	$.ajax({
		url: "../message/sendMessage",
		type: "POST",
		processData: false,
		contentType: false,
		data: fd,
		success: function(data) {
			console.log(data);//显示这条消息的id
		}
	});
};