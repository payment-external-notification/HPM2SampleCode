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
<title>Inline, Button Out.</title>
<script type="text/javascript" src='<%=request.getAttribute("jsPath")%>'></script>
<script type="text/javascript">
<%
Properties props = (Properties)request.getAttribute("prepopFields");
Set<String> encryptedFields = new HashSet<String>();
encryptedFields.add("creditCardNumber");
encryptedFields.add("cardSecurityCode");
encryptedFields.add("creditCardType");
encryptedFields.add("creditCardExpirationYear");
encryptedFields.add("creditCardExpirationMonth");
%>

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
	style:"inline",
	submitEnabled:"false",
	locale:"<%=request.getAttribute("locale")%>",
	url:"<%=request.getAttribute("url")%>",
	paymentGateway:"<%=request.getAttribute("paymentGateway")%>",
	field_passthrough1:100,
	field_passthrough2:200,
	field_passthrough3:300,
	field_passthrough4:"<%=request.getAttribute("pageName")%>",
	field_passthrough5:"Inline_ButtonOut"
};

function showPage() {
	document.getElementById("showPage").disabled = true;
	
	Z.render(params,prepopulateFields,null);
	
	document.getElementById("submit").style.display = "inline";
}

function backHomepage() {
	window.location.replace("<%=request.getContextPath()%>/Homepage.jsp");
}

</script>
</head>
<body>
	<div class="firstTitle"><font size="5" style="margin-left: 90px; height: 80px;">Inline, Submit Button Outside Hosted Page.</font></div>
	<div class="item"><button id="showPage" onclick="showPage()" style="margin-left: 150px; height: 24px; width: 120px;">Open Hosted Page</button><button onclick="backHomepage()"  style="margin-left: 20px; width: 140px; height: 24px;">Back To Homepage</button></div>
	<div class="title"><div id="zuora_payment"></div></div>
	<div class="item"><div id="submit" style="display:none"><button id="submitButton" onclick="Z.submit();return false;" style="margin-left: 270px; width: 66px; height: 24px; margin-top: 10px;">Submit</button></div></div>
</body>
</html>