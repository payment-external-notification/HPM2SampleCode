<%@ page language="java" contentType="text/html; charset=UTF-8"
    pageEncoding="UTF-8"%>
<%@ page import="java.util.Map" %>
<!DOCTYPE html>
<html>
<head>
<meta http-equiv="Content-Type" content="text/html; charset=UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=1, user-scalable=no">
<link href="css/hpm2samplecode.css" rel="stylesheet" type="text/css" />
<title>Result</title>
<script type="text/javascript">
function backHomepage() {
	window.location.replace("<%=request.getContextPath()%>/Homepage.jsp");
}
</script>
</head>
<body>
	<div class="firstTitle"><font size="5">Submit Response</font></div>
	<div class="item"><font size="3">success: <%=request.getParameter("success") %></font></div>
		<%
			if(!"true".equals(request.getParameter("success"))) {
		%>
	<div class="item"><font size="3">errorMessage: <%=request.getParameter("errorMessage") %></font></div>
		<% 		
			}
		%>
		<%
			if(!"Inline_ButtonOut".equals(request.getParameter("field_passthrough5"))) {
		%>
	<div class="item"><button onclick="backHomepage()" style="margin-left: 20px; width: 140px; height: 24px;">Back To Homepage</button></div>
		<%
			}
		%>
</body>
</html>

<script type="text/javascript">
<%
if("Inline_ButtonOut".equals(request.getParameter("field_passthrough5"))) {
%>
window.parent.document.getElementById("submitButton").disabled = true;
<%
}
%>
</script>