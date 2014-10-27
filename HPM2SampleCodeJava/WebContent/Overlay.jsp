<%@ page language="java" contentType="text/html; charset=UTF-8"
    pageEncoding="UTF-8"%>
<%@ page import="java.util.Properties" %>
<%@page import="java.util.Iterator" %>
<%@page import="java.util.HashSet" %>
<%@page import="java.util.Set" %>
<!DOCTYPE html>
<html>
<head>
<meta http-equiv="Content-Type" content="text/html; charset=UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=1, user-scalable=no">
<link href="css/hpm2samplecode.css" rel="stylesheet" type="text/css" />
<title>Overlay</title>
<script type="text/javascript" src='<%=request.getAttribute("jsPath")%>'></script>
<script type="text/javascript">
<%
Properties props = (Properties)request.getAttribute("prepopFields");
Set<String> encryptedFields = new HashSet<String>();
encryptedFields.add("creditCardNumber");
encryptedFields.add("cardSecurityCode");
encryptedFields.add("creditCardExpirationYear");
encryptedFields.add("creditCardExpirationMonth");
%>

// Set non-PCI pre-populate fields.
var prepopulateFields = {
	<%
		if(props != null) {
			Iterator iterator = props.keySet().iterator();
			while(iterator.hasNext()) {
				String key = (String)iterator.next();
				if(!encryptedFields.contains(key)) {
					String value = props.getProperty(key);
	%>
	<%=key%>:"<%=value%>"<%=(iterator.hasNext() ? "," : "")%>
	<%
				}
			}
		}
	%>
};

// Set HPM parameters, passthrough and PCI pre-populate fields.
var params = {
	<%
		if(props != null) {
			Iterator iterator = props.keySet().iterator();
			while(iterator.hasNext()) {
				String key = (String)iterator.next();
				if(encryptedFields.contains(key)) {
					String value = props.getProperty(key);
	%>
	field_<%=key%>:"<%=value%>",
	<%
				}
			}
		}
	%>
	tenantId:"<%=request.getAttribute("tenantId")%>", 
	id:"<%=request.getAttribute("id")%>",
	token:"<%=request.getAttribute("token")%>",
	signature:"<%=request.getAttribute("signature")%>",
	key:"<%=request.getAttribute("key")%>",
	style:"overlay",
	submitEnabled:"true",
	locale:"<%=request.getAttribute("locale")%>",
	url:"<%=request.getAttribute("url")%>",
	paymentGateway:"<%=request.getAttribute("paymentGateway")%>",
	field_passthrough1:100,
	field_passthrough2:200,
	field_passthrough3:300,
	field_passthrough4:"<%=request.getAttribute("pageName")%>",	
	field_passthrough5:"Overlay"
};

function forwardCallbackURL(response) {
	// Simply forward to the callback url.
	var callbackUrl = "<%=request.getContextPath()%>/callback?";
	for(id in response) {
		callbackUrl = callbackUrl+id+"="+encodeURIComponent(response[id])+"&";		
	}
	window.location.replace(callbackUrl);
} 

var callback = function (response) {
    if(response.success) {
    	// Submitting hosted page succeeds. Business logic code may be added here. Simply forward to the callback url in sample code. 
    	forwardCallbackURL(response);
    } else {
        if(response.responsetFrom == "Response_From_Submit_Page") {
            // Requesting hosted page fails. Error handling code should be added here. Simply forward to the callback url in sample code.
        	forwardCallbackURL(response);
        } else {
            // Submitting hosted page fails. Error handling code should be added here. Simply forward to the callback url in sample code.
        	forwardCallbackURL(response);
        }
    }
};

function showPage() {
	Z.render(params,prepopulateFields,callback);
}

function backHomepage() {
	window.location.replace("<%=request.getContextPath()%>/Homepage.jsp");
}
</script>
</head>
<body>
	<div class="firstTitle"><font size="5" style="margin-left: 140px; height: 80px;">Overlay Hosted Page</font></div>
	<div class="item"><button onclick="showPage()" style="margin-left: 100px; height: 24px; width: 120px;">Open Hosted Page</button><button onclick="backHomepage()" style="margin-left: 20px; width: 140px; height: 24px;">Back To Homepage</button></div>
	<div class="title"><div id="zuora_payment"></div></div>
</body>
</html>