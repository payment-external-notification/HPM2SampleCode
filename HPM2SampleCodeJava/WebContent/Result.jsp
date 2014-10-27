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
	<%
		if("Response_From_Submit_Page".equals(request.getParameter("responseFrom"))) {
	%>
	<div class="firstTitle"><font size="5" style="margin-left: 75px; height: 80px;">Hosted Page Submission Response</font></div>
	<%
		} else {
	%>
	<div class="firstTitle"><font size="5" style="margin-left: 90px; height: 80px;">Hosted Page Loading Response</font></div>
	<%
		}
	%>
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
	<div class="item"><button onclick="backHomepage()" style="margin-left: 150px; width: 140px; height: 24px;">Back To Homepage</button></div>
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