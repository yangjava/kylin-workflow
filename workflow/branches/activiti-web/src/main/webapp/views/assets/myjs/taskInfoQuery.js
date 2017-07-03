$(function() {
	initApplyInfo();
	initHisTaskInfo();
	
});
//业务信息
var initApplyInfo = function() {
	
	var path = "taskProcessVariablesQuery";
	if("isHis" == getUrlParam("flag")){
		path = "historyVariableQuery";
	}
	var json = {
			taskId:getUrlParam("taskId"),
			processInstanceId:getUrlParam("processInstanceId"),
	};
	
	$.post("/activiti-web/"+path, json, function(data) {
		var htmlData = [];
		if(data){
			$.each(data.data,function(key,value) {
				//业务数据
				htmlData.push('<div class="col-md-3">');
				htmlData.push('<strong>'+key+'：</strong><span>'+value+'</span>');
				htmlData.push('</div>');
			});
		}
		$("#bnsInfo").html(htmlData.join(''));
	});

};
//审核信息
var initHisTaskInfo = function() {
	
	var json = {
			processInstanceId : getUrlParam("processInstanceId")
	};
	
	$.post("/activiti-web/hisTaskQuery", json,
			function(data) {
				var htmlData = [];
				var dataList = data.data.dataList;
				if(data.isSuccess&&dataList.length>0){
					for(var i=0;i<dataList.length;i++){
						htmlData.push('<tr class="odd">');
						htmlData.push('<td class="center">'+dataList[i].taskId+'</td>');
						htmlData.push('<td class="center">'+dataList[i].name+'</td>');
						htmlData.push('<td class="center">'+dataList[i].assignee+'</td>');
						htmlData.push('<td class="center">'+undefinedToEmpty(dataList[i].taskLocalVariables.statusId)+'</td>');
						htmlData.push('<td class="center">'+undefinedToEmpty(dataList[i].taskLocalVariables.remark)+'</td>');
						htmlData.push('<td class="center">'+dataList[i].createTime+'</td>');
						htmlData.push('<td class="center">'+dataList[i].endTime+'</td>');
						htmlData.push('</tr>');
					}
					$("#dataInfoList").html(htmlData.join(''));
				}else{
					$("#dataInfoList").html('<tr class="odd"><td colspan="9" class="center">无查询数据</td></tr>');
				}

			});

};

var getCheckName = function(val){
	var checkName = val;
	switch (val) {
	case "1":
		checkName = "通过";
		break;
	case "0":
		checkName = "不通过";
		break;

	default:
		break;
	}
	return checkName;
};

var changeStatus = function(){
	if($("#statusId").val() == 3){
		$("#backTask").show();
	}else{
		$("#backTask").hide();
	}
};

var submit = function(){

	var variableParams = {
			statusId:$("#statusId").val(),
			remark:$("#remark").val()
	};
	var value  = $('input[name="userTask"]:checked').val(); //获取被选中Radio的Value值
	if($("#backTask").is(":visible") && !value){
		alert("请选择驳回任务节点");
		return;
	}
	
	var interfaceName = "submitTask";
	if($("#backTask").is(":visible")){
		interfaceName = "jumpTask";
	}
	var json = {
			taskId:	getUrlParam("taskId"),
			usertask:value,
			variableParams:JSON.stringify(variableParams)
	};
	$.post("/activiti-web/"+interfaceName, json ,
			function(data) {
				if(data.isSuccess){
					showAlert(data.retmsg);
					setTimeout(function(){
						skipPage("myTaskQuery.html");
					}, 2*1000);
					
				}else{
					showAlert(data.retmsg,5000);
				}
			});
};



