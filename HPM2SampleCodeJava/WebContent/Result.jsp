<%@ page language="java" contentType="text/html; charset=UTF-8"
    pageEncoding="UTF-8"%>
<%@ page import="java.util.Map" %>
<!DOCTYPE html>
<html>
<head>
<meta http-equiv="Content-Type" content="text/html; charset=UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=1, user-scalable=no">
<link href="hpm_default_responsive_v5.css" rel="stylesheet" type="text/css"> 
<title>Result</title>
<script type="text/javascript">
function backHomepage() {
	window.location.replace("<%=request.getContextPath()%>/Homepage.jsp");
}
</script>
</head>
<body>
	<table border="0" align="center" style="margin-top: 80px; width: 600px; height: 150px;">
		<tr>
			<td><font size="5">Submit Response</font></td>
		</tr>
		<tr>
			<td><font size="3">success: <%=request.getParameter("success") %></font></td>
		</tr>
		<%
			if(!"true".equals(request.getParameter("success"))) {
		%>
		<tr>
			<td><font size="3">errorMessage: <%=request.getParameter("errorMessage") %></font></td>
		</tr>
		<% 		
			}
		%>
		<%
			if(!"Inline_ButtonOut".equals(request.getParameter("field_passthrough5"))) {
		%>
		<tr>
			<td><button onclick="backHomepage()" style="margin-left: 20px; width: 140px; height: 24px;">Back To Homepage</button></td>
		</tr>
		<%
			}
		%>
	</table>
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