<%@ page language="java" contentType="text/html; charset=UTF-8" pageEncoding="UTF-8"%>
<%@ page import="com.zuora.hosted.lite.util.HPMHelper" %>
<%@ page import="java.util.Map" %>
<%@ page import="java.util.HashMap" %>
<%@ page import="java.util.Properties" %>
<%@ page import="java.io.FileInputStream" %>
<%
	Map<String, String> params = new HashMap<String, String>();
	params.put("style", "overlay");
	params.put("submitEnabled", "true");
	params.put("locale", request.getParameter("locale"));
	
	Properties prepopulateFields = new Properties();
	prepopulateFields.load(new FileInputStream(request.getServletContext().getRealPath("WEB-INF") + "/data/prepopulate.properties"));
	
	try{
		HPMHelper.prepareParamsAndFields(request.getParameter("pageName"), params, (Map)prepopulateFields);		
	}catch(Exception e) {
		// TODO: Error handling code should be added here.
		
		throw e;
	}
%>
<!DOCTYPE html>
<html>
<head>
<meta http-equiv="Content-Type" content="text/html; charset=UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=1, user-scalable=no">
<link href="css/hpm2samplecode.css" rel="stylesheet" type="text/css" />
<title>Overlay</title>
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

function forwardCallbackURL(response) {
	var callbackUrl = "Callback.jsp?";
	for(id in response) {
		callbackUrl = callbackUrl+id+"="+encodeURIComponent(response[id])+"&";		
	}
	window.location.replace(callbackUrl);
} 

var callback = function (response) {
    if(response.responseFrom == "Response_From_Submit_Page") {
    	if(response.success) {
        	// Submitting hosted page succeeds. Business logic code may be added here. Simply forward to the callback url in sample code.
        	forwardCallbackURL(response);
        } else {
            // Submitting hosted page fails. Error handling code should be added here. Simply forward to the callback url in sample code.
            forwardCallbackURL(response);
        }
    } else {
    	// Requesting hosted page fails. Error handling code should be added here. Simply forward to the callback url in sample code.
    	forwardCallbackURL(response);
    }
};

function showPage() {
	Z.render(params,prepopulateFields,callback);
}
</script>
</head>
<body>
	<div class="firstTitle"><font size="5" style="margin-left: 140px; height: 80px;">Overlay Hosted Page</font></div>
	<div class="item"><button onclick="showPage()" style="margin-left: 100px; height: 24px; width: 120px;">Open Hosted Page</button><button onclick='window.location.replace("Homepage.jsp")' style="margin-left: 20px; width: 140px; height: 24px;">Back To Homepage</button></div>
	<div class="title"><div id="zuora_payment"></div></div>
</body>
</html>