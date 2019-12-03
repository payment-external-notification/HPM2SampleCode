<%@ page import="java.util.Arrays"%>
<%@ page import="java.util.ArrayList"%>
<%@ page import="com.zuora.hosted.lite.util.HPMHelper.HPMPage"%>
<%@ page language="java" contentType="text/html; charset=UTF-8" pageEncoding="UTF-8" %>
<%@ page import="com.zuora.hosted.lite.util.HPMHelper" %>
<%@ page import="java.util.Iterator" %>
<%
	HPMHelper.loadConfiguration(request.getServletContext().getRealPath("WEB-INF") + "/conf/configuration.properties");
	if (request.getParameter("CALLBACK_URL")!=null) {HPMHelper.setCallbackURL(request.getParameter("CALLBACK_URL"));}
	/*  create new page based on page id to make multi cases can executed concurrently*/
	if (request.getParameter("PAGE_PAGEID")!=null && request.getParameter("USERNAME")!=null && request.getParameter("PASSWORD")!=null && request.getParameter("PUBLIC_KEY")!=null && request.getParameter("ENDPOINT")!=null && request.getParameter("URL")!=null) {
		String pageId = request.getParameter("PAGE_PAGEID");
		String pageName = "page" + pageId;
		HPMHelper.createHPMPage(pageName,pageId,"", Arrays.asList("en"), request.getParameter("USERNAME"), request.getParameter("PASSWORD"), request.getParameter("PUBLIC_KEY"), request.getParameter("ENDPOINT"), request.getParameter("URL"), request.getParameter("ACCOUNTID"), request.getParameter("GWOPTION"),request.getParameter("JSPATH"));
	}
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

/* Added for Automation Usage */
function saveConfig() {
	var endpoint = encodeURIComponent(document.getElementById("endpoint").value);
	var url = encodeURIComponent(document.getElementById("url").value);
	var callbackurl = encodeURIComponent(document.getElementById("callbackurl").value);
	var username = encodeURIComponent(document.getElementById("username").value);
	var password = encodeURIComponent(document.getElementById("password").value);
	var publickey = encodeURIComponent(document.getElementById("publickey").value);
	var page_pageid = encodeURIComponent(document.getElementById("page_pageid").value);
	var accountid = encodeURIComponent(document.getElementById("accountid").value);
	var gwOption = encodeURIComponent(document.getElementById("gwOption").value);
	var jsPath = encodeURIComponent(document.getElementById("jsPath").value);

	window.location.replace("HomepageWithReconfig.jsp?URL="+url+"&ENDPOINT="+endpoint+"&CALLBACK_URL="+callbackurl+"&USERNAME="+username
			+"&PASSWORD="+password+"&PUBLIC_KEY="+publickey+"&PAGE_PAGEID="+page_pageid+"&ACCOUNTID="+accountid+"&GWOPTION="+gwOption+"&JSPATH="+jsPath);
}

</script>
</head>
<body onload="pageChange()">
	<div class="item">
		Config section:<br>
		<span style="display:inline-block;width:200px;text-align:right;">URL:          </span><input type="text" name="style" style="width:300px" id="url"/><br>
		<span style="display:inline-block;width:200px;text-align:right;">ENDPOINT:     </span><input type="text" name="style" style="width:300px" id="endpoint"/><br>
		<span style="display:inline-block;width:200px;text-align:right;">USERNAME:     </span><input type="text" name="style" style="width:300px" id="username"/><br>
		<span style="display:inline-block;width:200px;text-align:right;">PASSWORD:     </span><input type="text" name="style" style="width:300px" id="password"/><br>
		<span style="display:inline-block;width:200px;text-align:right;">PUBLICKEY:    </span><input type="textarea" style="width:300px" id="publickey"/><br>
		<%-- <span style="display:inline-block;width:200px;text-align:right;">JSPATH:       </span><input type="text" name="style" style="width:300px" id="jspath" value=<%=HPMHelper.getJsPath()%> /><br> --%>
		<span style="display:inline-block;width:200px;text-align:right;">CALLBACKURL:  </span><input type="text" name="style" style="width:300px" id="callbackurl"/><br>
		<span style="display:inline-block;width:200px;text-align:right;">PAGE_PAGEID:</span><input type="text" name="style" style="width:300px" id="page_pageid"/><br>
		<span style="display:inline-block;width:200px;text-align:right;">ACCOUNT_ID:</span><input type="text" name="style" style="width:300px" id="accountid"/><br>
		<span style="display:inline-block;width:200px;text-align:right;">GATEWAY_OPTION:</span><input type="text" name="style" style="width:300px" id="gwOption"/><br>
		<span style="display:inline-block;width:200px;text-align:right;">JS_PATH:</span><input type="text" name="style" style="width:300px" id="jsPath"/><br>
		<button type="button" onclick="saveConfig()" style="width: 150px; height: 24px; margin-left: 200px;">Save new config</button><br>
	</div>
	<div class="firstTitle"><font size="5">Please select the Hosted Page:</font></div>
	<div class="item">
		<select id="page" style="width: 300px; height: 24px;" onchange="pageChange(this)">
				<%
					pageIterator = HPMHelper.getPages().keySet().iterator();
					while(pageIterator.hasNext()) {
						String pageName = (String)pageIterator.next();
				%>	
						<option value=<%=pageName%>><%=pageName%></option>
				<%			
					}
				%>
		</select>
	</div>
	<div class="title"><font size="5">Please select the Hosted Page style you want:</font></div>
	<div class="item"><input type="radio" name="style" id="ButtonIn" value="Inline_ButtonIn_Legacy.jsp"/>Inline, Submit button inside Hosted Page, Legacy</div>
	<div class="item"><input type="radio" name="style" id="ButtonIn_CITMIT" value="Inline_ButtonIn_CITMIT.jsp"/>Inline, Submit button inside Hosted Page, CITMIT</div>
	<div class="item"><input type="radio" name="style" id="ButtonOut" value="Inline_ButtonOut_Legacy.jsp"/>Inline, Submit button outside Hosted Page, Legacy.</div>
	<div class="item"><input type="radio" name="style" id="ButtonOut_CITMIT" value="Inline_ButtonOut_CITMIT.jsp" checked="checked"/>Inline, Submit button outside Hosted Page, CIT/MIT.</div>
	<div class="item"><input type="radio" name="style" id="Overlay" value="Overlay.jsp"/>Overlay Hosted Page.</div>
	<div class="title"><font size="5">Please select the locale:</font></div>
	<div class="item">
		<select id="locale" style="width: 150px; height: 24px;"></select>
	</div>
	<div class="title"><button type="button" onclick="showPage()" style="width: 50px; height: 24px; margin-left: 200px;">OK</button></div>
</body>
</html>
