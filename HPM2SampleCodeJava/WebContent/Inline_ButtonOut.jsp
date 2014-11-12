<%@ page language="java" contentType="text/html; charset=UTF-8" pageEncoding="UTF-8"%>
<%@ page import="com.zuora.hosted.lite.util.HPMHelper" %>
<%@ page import="java.util.Map" %>
<%
	Map params = (Map)request.getAttribute("params");
	Map prepopulateFields = (Map)request.getAttribute("prepopulateFields");
%>
<!DOCTYPE html>
<html>
<head>
<meta http-equiv="Content-Type" content="text/html; charset=UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=1, user-scalable=no">
<link href="css/hpm2samplecode.css" rel="stylesheet" type="text/css" />
<title>Inline, Button Out.</title>
<script type="text/javascript" src='<%=HPMHelper.getJsPath()%>'></script>
<script type="text/javascript">
//HPM parameters and passthroughs
var params = {};

//Set parammeters and passthroughs
<%	
	for(Object key : params.keySet()) {
%>
params["<%=(String)key%>"]="<%=(String)params.get(key)%>";		
<%
	}
%>

//Pre-populate fields
var prepopulateFields = {};

//Set pre-populate fields
<%		
	for(Object key : prepopulateFields.keySet()) {
%>
prepopulateFields["<%=(String)key%>"]="<%=(String)prepopulateFields.get(key)%>";		
<%
	}
%>

var callback = function (response) {
    if(!response.success) {
    	// Requesting hosted page failed. Error handling code should be added here. Simply forward to the callback url in sample code.
    	var callbackUrl = "callback?";
    	for(id in response) {
    		callbackUrl = callbackUrl+id+"="+encodeURIComponent(response[id])+"&";		
    	}
    	window.location.replace(callbackUrl);
    }
};

function showPage() {
	document.getElementById("showPage").disabled = true;
	
	var zuoraDiv = document.getElementById('zuora_payment');
	zuoraDiv.innerHTML="";
	Z.render(params,prepopulateFields,callback);
	
	// Display the submit button.
	document.getElementById("submit").style.display = "inline";
}

function submitPage() {
	document.getElementById('errorMessage').innerHTML='';
	Z.submit();
	return false;
}

function submitSucceed() {
	// Submitting hosted page succeeded, disable the submit button.
	document.getElementById("submitButton").disabled = true;
}

function submitFail(errorMessage) {
	// Submitting hosted page failed, display error message and reload hosted page with retained values.
	document.getElementById("errorMessage").innerHTML="Hosted Page failed to submit. The reason is: " + errorMessage;		
	var zuoraDiv = document.getElementById('zuora_payment');
	zuoraDiv.innerHTML="";
	Z.render(params,null,callback);
}
</script>
</head>
<body>
	<div class="firstTitle"><font size="5" style="margin-left: 90px; height: 80px;">Inline, Submit Button Outside Hosted Page.</font></div>
	<div class="item"><button id="showPage" onclick="showPage()" style="margin-left: 150px; height: 24px; width: 120px;">Open Hosted Page</button><button onclick='window.location.replace("Homepage.jsp")'  style="margin-left: 20px; width: 140px; height: 24px;">Back To Homepage</button></div>
	<div class="item"><font id="errorMessage" size="3" color="red"></font></div>
	<div class="title"><div id="zuora_payment"></div></div>
	<div class="item"><div id="submit" style="display:none"><button id="submitButton" onclick="return submitPage()" style="margin-left: 270px; width: 66px; height: 24px; margin-top: 10px;">Submit</button></div></div>
</body>
</html>