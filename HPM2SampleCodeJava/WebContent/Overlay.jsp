<%@ page language="java" contentType="text/html; charset=UTF-8"
    pageEncoding="UTF-8"%>
<!DOCTYPE html>
<html>
<head>
<meta http-equiv="Content-Type" content="text/html; charset=UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=1, user-scalable=no">
<link href="hpm_default_responsive_v5.css" rel="stylesheet" type="text/css"> 
<title>Overlay</title>
<script type="text/javascript" src='<%=request.getAttribute("jsPath")%>'></script>
<script type="text/javascript">

var prepopulateFields = {
	creditCardAddress1:"123 Any Street", 
	creditCardAddress2:"Suite #999",
	creditCardCountry:"USA",
	creditCardState:"California",
	creditCardType:"Visa",
	creditCardHolderName:"John Doe"	
};

var params = {
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

var callback = function (response) {
	var callbackUrl = "<%=request.getContextPath()%>/callback?";
	for(id in response) {
		if(callbackUrl.indexOf("&")<0) {
			callbackUrl = callbackUrl+id+"="+encodeURIComponent(response[id])+"&";
		} else {
			callbackUrl = callbackUrl+id+"="+encodeURIComponent(response[id])+"&";		
		}
	}
	window.location.replace(callbackUrl);
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
	<table border="0" align="center" style="margin-top: 80px; width: 600px; height: 120px;">
		<tr>
			<td><font size="5" style="margin-left: 123px; height: 80px;">Overlay Hosted Page</font></td>
		</tr>
		<tr>
			<td>
				<button onclick="showPage()" style="margin-left: 100px; height: 24px; width: 120px;">Open Hosted Page</button><button onclick="backHomepage()" style="margin-left: 20px; width: 140px; height: 24px;">Back To Homepage</button>
			</td>
		</tr>
		<tr>
			<td><div id="zuora_payment"></div></td>
		</tr>	
	</table>
</body>
</html>