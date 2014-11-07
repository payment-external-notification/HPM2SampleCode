<%@ page language="java" contentType="text/html; charset=UTF-8" pageEncoding="UTF-8"%>
<%@ page import="com.zuora.hosted.lite.util.HPMHelper" %>
<%@ page import="com.zuora.hosted.lite.util.HPMHelper.Signature" %>
<%@ page import="java.util.Properties" %>
<%@ page import="java.io.FileInputStream" %>
<%@ page import="java.util.Iterator" %>
<%@ page import="java.util.HashSet" %>
<%
	HPMHelper hpmHelper = HPMHelper.getInstance();
	
	// Generate signature.
	Signature signature = null;
	try{
		signature = hpmHelper.generateSignaure(request.getParameter("pageName"));		
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
<title>Inline, Button In.</title>
<script type="text/javascript" src='<%=hpmHelper.getJsPath()%>'></script>
<script type="text/javascript">
// non-PCI pre-populate fields.
var prepopulateFields = {
};

// HPM parameters, passthrough and PCI pre-populate fields.
var params = {
	tenantId:"<%=signature.getTenantId()%>", 
	id:"<%=signature.getPageId()%>",
	token:"<%=signature.getToken()%>",
	signature:"<%=signature.getSignature()%>",
	key:"<%=signature.getPublicKey()%>",
	style:"inline",
	submitEnabled:"true",
	locale:"<%=request.getParameter("locale")%>",
	url:"<%=signature.getUrl()%>",
	paymentGateway:"<%=signature.getPaymentGateway()%>",
	field_passthrough1:100,
	field_passthrough2:200,
	field_passthrough3:300,
	field_passthrough4:"<%=request.getParameter("pageName")%>",
	field_passthrough5:500
};

// Set pre-populate fields.
<%
	// Define PCI pre-populate fields.
	HashSet<String> encryptedFields = new HashSet<String>();
	encryptedFields.add("creditCardNumber");
	encryptedFields.add("cardSecurityCode");
	encryptedFields.add("creditCardExpirationYear");
	encryptedFields.add("creditCardExpirationMonth");

	// Load pre-populate fields.
	Properties props = new Properties();
	props.load(new FileInputStream(request.getServletContext().getRealPath("WEB-INF") + "/data/prepopulate.properties"));
	
	Iterator iterator = props.keySet().iterator();
	while(iterator.hasNext()) {
		String key = (String)iterator.next();
		String value = props.getProperty(key);
		if(encryptedFields.contains(key)) {
			// Encrypt PCI pre-populate fields and put to params.
			if(value != null && !"".equals(value)) {
				value = hpmHelper.encrypt(value);
			}
%>
params["field_<%=key%>"]="<%=value%>";
<%
		} else {
			// Put non-PCI pre-populate fields to prepopulateFields.
%>
prepopulateFields["<%=key%>"]="<%=value%>";
<%
		}
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
	document.getElementById("showPage").disabled = true;
	
	Z.render(params,prepopulateFields,callback);
}
</script>
</head>
<body>
	<div class="firstTitle"><font size="5" style="margin-left: 90px; height: 80px;">Inline, Submit Button Inside Hosted Page.</font></div>
	<div class="item"><button id="showPage" onclick="showPage()" style="margin-left: 150px; height: 24px; width: 120px;">Open Hosted Page</button><button onclick='window.location.replace("Homepage.jsp")' style="margin-left: 20px; width: 140px; height: 24px;">Back To Homepage</button></div>
	<div class="title"><div id="zuora_payment"></div></div>
</body>
</html>