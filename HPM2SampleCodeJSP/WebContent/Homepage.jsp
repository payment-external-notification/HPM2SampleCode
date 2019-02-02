<%@ page language="java" contentType="text/html; charset=UTF-8" pageEncoding="UTF-8" %>
<%@ page import="com.zuora.hosted.lite.util.HPMHelper" %>
<%@ page import="java.util.Iterator" %>
<%
	HPMHelper.loadConfiguration(request.getServletContext().getRealPath("WEB-INF") + "/conf/configuration.properties");
%>
<!DOCTYPE html>
<html>
<head>
<meta http-equiv="Content-Type" content="text/html; charset=UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=1, user-scalable=no">
<link href="css/hpm2samplecode.css" rel="stylesheet" type="text/css" />
<title>Homepage</title>
<script type="text/javascript">
var locales = {
		<%
		Iterator<String> pageIterator = HPMHelper.getPages().keySet().iterator();
		while(pageIterator.hasNext()) {
			String pageName = (String)pageIterator.next();
			Iterator<String> localeIterator = HPMHelper.getPage(pageName).getLocales().iterator();
			String locales = "";
			while(localeIterator.hasNext()) {
				locales += "\"" + localeIterator.next() + "\"";
				locales += localeIterator.hasNext() ? ", " : "";
			}
		%>
			<%=pageName%> : new Array(<%=locales%>)<%=(pageIterator.hasNext() ? "," : "")%>
		<%
		}
		%>
};

function pageChange() {
	var pageSelect = document.getElementById("page");
	var localeSelect = document.getElementById("locale");
	
	while(localeSelect.length > 0) {
		localeSelect.remove(localeSelect.length - 1);
	}	
	
	if(pageSelect.selectedIndex >= 0) {
		var localeArray = eval("locales."+ pageSelect.options[pageSelect.selectedIndex].text);
		var index = 0;
		for(index in localeArray) {
			var localeOption = document.createElement("option");
			localeOption.text = localeArray[index];
			localeSelect.add(localeOption, null);
		}
	}
}

function showPage() {
	var pageSelect = document.getElementById("page");
	var localeSelect = document.getElementById("locale");
	
	if(pageSelect.selectedIndex < 0) {
		alert("Please select a page.");
		return;		
	}
	
	var url = ""; 
	var radioArray = document.getElementsByName("style");
	for(var i = 0; i < radioArray.length; i++) {
		if(radioArray[i].checked) {
			url += radioArray[i].value;
			break;
		}
	}	
	
	url += "?pageName=" + pageSelect.options[pageSelect.selectedIndex].text;
		
	url +="&locale=";
	if(localeSelect.selectedIndex >= 0) {
		url += localeSelect.options[localeSelect.selectedIndex].text;
	}
	
	window.location.replace(url);
}
</script>
</head>
<body onload="pageChange()">
	<div class="firstTitle"><font size="5">Please select the Hosted Page:</font></div>
	<div class="item">
		<select id="page" style="width: 150px; height: 24px;" onchange="pageChange(this)">
				<%
					pageIterator = HPMHelper.getPages().keySet().iterator();
					while(pageIterator.hasNext()) {
						String pageName = (String)pageIterator.next();
				%>	
						<option><%=pageName%></option>
				<%			
					}
				%>
		</select>
	</div>
	<div class="title"><font size="5">Please select the Hosted Page style you want:</font></div>
	<div class="item"><input type="radio" name="style" id="ButtonIn" value="Inline_ButtonIn.jsp" checked="checked"/>Inline, Submit button inside Hosted Page.</div>
	<div class="item"><input type="radio" name="style" id="ButtonOut_Legacy" value="Inline_ButtonOut_Legacy.jsp"/>Inline, Submit button outside Hosted Page, Legacy.</div>
	<div class="item"><input type="radio" name="style" id="ButtonOut_CITMIT" value="Inline_ButtonOut_CITMIT.jsp"/>Inline, Submit button outside Hosted Page, CIT/MIT.</div>
	<div class="item"><input type="radio" name="style" id="Overlay" value="Overlay.jsp"/>Overlay Hosted Page.</div>
	<div class="title"><font size="5">Please select the locale:</font></div>
	<div class="item">
		<select id="locale" style="width: 150px; height: 24px;"></select>
	</div>
	<div class="title"><button type="button" onclick="showPage()" style="width: 50px; height: 24px; margin-left: 200px;">OK</button></div>
</body>
</html>