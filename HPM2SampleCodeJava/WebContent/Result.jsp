<%@ page language="java" contentType="text/html; charset=UTF-8" pageEncoding="UTF-8"%>
<!DOCTYPE html>
<html>
<head>
<meta http-equiv="Content-Type" content="text/html; charset=UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=1, user-scalable=no">
<link href="css/hpm2samplecode.css" rel="stylesheet" type="text/css" />
<title>Result</title>
<script type="text/javascript">
function hideBackToHomepage() {
	if(window.parent != window) {
		// Inline, submit button outside hosted page. Hide the 'Back To Homepage' button.
		document.getElementById("backToHomepage").style.display = "none";
	}	
}
</script>
</head>
<body onload="hideBackToHomepage()">
<div class="firstTitle"><font size="4"><%=request.getAttribute("message")%></font></div>
	<div id="backToHomepage" class="item"><button onclick='window.location.replace("Homepage.jsp")' style="margin-left: 150px; width: 140px; height: 24px;">Back To Homepage</button></div>
</body>
</html>

<script type="text/javascript">
if(window.parent != window) {
	// Inline, submit button outside hosted page.
	<%
	if("Response_From_Submit_Page".equals(request.getParameter("responseFrom"))) {
		if("true".equals(request.getParameter("success"))) {
			// Submitting hosted page succeeded.
	%>
	window.parent.submitSucceed();
	<%
		} else {
			// Submitting hosted page failed.
	%>
	window.parent.submitFail("<%=request.getParameter("errorMessage").replace('\n', ' ')%>");
	<%
		}
	}
	%>	
}
</script>