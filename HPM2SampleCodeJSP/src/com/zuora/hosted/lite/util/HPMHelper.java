/**    
 *   Copyright (c) 2014 Zuora, Inc.
 *
 *   Permission is hereby granted, free of charge, to any person obtaining a copy of 
 *   this software and associated documentation files (the "Software"), to use copy, 
 *   modify, merge, publish the Software and to distribute, and sublicense copies of 
 *   the Software, provided no fee is charged for the Software.  In addition the
 *   rights specified above are conditioned upon the following:
 *
 *   The above copyright notice and this permission notice shall be included in all
 *   copies or substantial portions of the Software.
 *
 *   Zuora, Inc. or any other trademarks of Zuora, Inc.  may not be used to endorse
 *   or promote products derived from this Software without specific prior written
 *   permission from Zuora, Inc.
 *
 *   THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 *   IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 *   FITNESS FOR A PARTICULAR PURPOSE AND NON-INFRINGEMENT. IN NO EVENT SHALL
 *   ZUORA, INC. BE LIABLE FOR ANY DIRECT, INDIRECT OR CONSEQUENTIAL DAMAGES
 *   (INCLUDING, BUT NOT LIMITED TO, PROCUREMENT OF SUBSTITUTE GOODS OR SERVICES;
 *   LOSS OF USE, DATA, OR PROFITS; OR BUSINESS INTERRUPTION) HOWEVER CAUSED AND ON
 *   ANY THEORY OF LIABILITY, WHETHER IN CONTRACT, STRICT LIABILITY, OR TORT
 *   (INCLUDING NEGLIGENCE OR OTHERWISE) ARISING IN ANY WAY OUT OF THE USE OF THIS
 *   SOFTWARE, EVEN IF ADVISED OF THE POSSIBILITY OF SUCH DAMAGE.
 */
package com.zuora.hosted.lite.util;

import java.io.FileInputStream;
import java.io.IOException;
import java.net.URLEncoder;
import java.security.Key;
import java.util.ArrayList;
import java.util.Date;
import java.util.HashSet;
import java.util.Iterator;
import java.util.List;
import java.util.Map;
import java.util.Properties;
import java.util.Set;
import java.util.StringTokenizer;
import java.util.TreeMap;
import java.util.regex.Matcher;
import java.util.regex.Pattern;

import org.apache.commons.httpclient.HttpClient;
import org.apache.commons.httpclient.methods.PostMethod;
import org.apache.commons.httpclient.methods.RequestEntity;
import org.apache.commons.httpclient.methods.StringRequestEntity;
import org.apache.commons.httpclient.protocol.Protocol;
import org.apache.commons.lang.StringUtils;
import org.json.JSONException;
import org.json.JSONObject;

import com.zuora.hosted.lite.support.BypassSSLSocketFactory;
import com.zuora.rsa.security.decrypt.SignatureDecrypter;
import com.zuora.rsa.security.encrypt.RsaEncrypter;

/**
 * HPM utility class which can 
 * 		1. load and maintain configurations
 * 		2. generate and validate signature
 * 		3. encrypt pre-populate fields
 *       
 * @author Tony.Liu, Chunyu.Jia.
 */
public class HPMHelper {
	
	private static final int DEFAULT_HTTPS_PORT = 443;
	private static final Set<String> fieldToEncrypt = new HashSet<String>();
	
	static {
		fieldToEncrypt.add("creditCardNumber");
		fieldToEncrypt.add("cardSecurityCode");
		fieldToEncrypt.add("creditCardExpirationYear");
		fieldToEncrypt.add("creditCardExpirationMonth");
	}
	
	private static String url = "";
	private static String endPoint = "";
	private static String username = "";
	private static String password = "";
	private static String publicKeyString = "";
	private static String jsPath = "";
	private static String jsVersion ="";
	private static Map<String, HPMPage> pages = new TreeMap<String, HPMPage>();
	 	
	public static String getJsPath() {
		return jsPath;
	}
	
	public static Map<String, HPMPage> getPages() {
		return pages;
	}
	
	public static HPMPage getPage(String pageName) {
		return pages.get(pageName);
	}
	
	public static String getJsVersion() {
		return jsVersion;
	}
	
	/**
	 * HPMPage contains the configurations for a single Hosted Page.
	 * 
	 * @author Tony.Liu, Chunyu.Jia.
	 */
	public static class HPMPage {
		private String pageId;
		private String paymentGateway;
		private List<String> locales;
		
		public String getPageId() {
			return pageId;
		}
		
		public void setPageId(String pageId) {
			this.pageId = pageId;
		}
		
		public String getPaymentGateway() {
			return paymentGateway;
		}
		
		public void setPaymentGateway(String paymentGateway) {
			this.paymentGateway = paymentGateway;
		}
				
		public List<String> getLocales() {
			return locales;
		}

		public void setLocales(List<String> locales) {
			this.locales = locales;
		}

		public HPMPage() {
			pageId = "";
			paymentGateway = "";
			locales = new ArrayList<String>();			
		}		
	}
	
	/**
	 * Load HPM configuration file.
	 * 
	 * @param configFile - the HPM configuration file path
	 * @throws IOException
	 */
	public static void loadConfiguration(String configFile) throws IOException {
		Properties props = new Properties();
		props.load(new FileInputStream(configFile));
		
		url = props.getProperty("url");
		endPoint = props.getProperty("endPoint");
		username =props.getProperty("username");
		password = props.getProperty("password");
		publicKeyString = props.getProperty("publicKey");
		jsPath = props.getProperty("jsPath");
		Pattern pattern = Pattern.compile(".+hosted/(.+)/zuora.+");
		Matcher matcher = pattern.matcher(jsPath);
		if(matcher.matches()) {
			jsVersion = matcher.group(1);
		}
		
		pages.clear();
		for(Object key : props.keySet()) {
			pattern = Pattern.compile("page\\.([^\\.]+)\\.([^\\.]+)");
			matcher = pattern.matcher((String)key);
			if(matcher.matches()) {
				String value = props.getProperty((String)key);
				
				String name = matcher.group(1);
				HPMPage page = pages.get(name);
				if(page == null) {
					page = new HPMPage();
					pages.put(name, page);
				}
				
				if("pageId".equals(matcher.group(2))) {
					page.setPageId(value);
				} else if("paymentGateway".equals(matcher.group(2))) {
					page.setPaymentGateway(value);
				} else if("locale".equals(matcher.group(2))) {
					List<String> locales = new ArrayList<String>();
					for(String locale : value.split(",")) {
						if(!"".equals(locale.trim())) {
							locales.add(locale.trim());
						}
					}
					
					page.setLocales(locales);
				}
			}
		}
	}
	
	/**
	 * Fill params and encrypt PCI pre-populate fields.
	 * 
	 * @param pageName - Page Name specified in HPM configuration file
	 * @param params - Map of params which will be passed to Z.render. tenantId, id, token, signature, key, url and paymentGateway will be filled by this method. 
	 * @param prepopulateFields - Map of pre-populate fields which will be passed to Z.render.  
	 * @throws Exception
	 */
	public static void prepareParamsAndFields(String pageName, Map<String, String> params, Map<String, String> prepopulateFields) throws Exception {
		HPMPage page = pages.get(pageName);
		if(page == null) {
			throw new Exception("Could not find Hosted Page configurations for " + pageName);
		}
		
		JSONObject result = generateSignature(page.getPageId());
	    
		params.put("tenantId", result.getString("tenantId"));
		params.put("id", page.getPageId());
		params.put("token", result.getString("token"));
		params.put("signature", result.getString("signature"));
		params.put("key", publicKeyString);
		params.put("url", url);
		params.put("paymentGateway", page.getPaymentGateway());
		
		for(Iterator<String> iterator = prepopulateFields.keySet().iterator(); iterator.hasNext(); ) {
			String key = iterator.next();
	    	String value = prepopulateFields.get(key);
	    	if(fieldToEncrypt.contains(key)) {
	    		value = RsaEncrypter.encrypt(value, publicKeyString);
	    		if("1.0.0".equals(jsVersion) || "1.1.0".equals(jsVersion)) {
	    			// For zuora.js version 1.0.0 and 1.1.0, PCI pre-populate fields are in params.
	    			iterator.remove();
	    			params.put("field_" + key, value);	    			
	    		} else {
	    			// For zuora.js version 1.2.0 and later, PCI pre-populate fields are in prepopulateFields.
	    			prepopulateFields.put(key, value);
	    		}
	    	}
	    }
		
		if("1.0.0".equals(jsVersion)) {
			// For zuora.js version 1.0.0, encode the values in params except url.
			for(String key : params.keySet()) {
				if(!"url".equals(key)) {
					params.put(key, URLEncoder.encode(params.get(key), "UTF-8"));
				}
			}
		}
	}
	
	private static JSONObject generateSignature(String pageId) throws Exception {
		HttpClient httpClient = new HttpClient();
		PostMethod postRequest = new PostMethod(endPoint);  
    	postRequest.addRequestHeader("apiAccessKeyId", username);
    	postRequest.addRequestHeader("apiSecretAccessKey", password);
    	postRequest.addRequestHeader("Accept", "application/json");
    	
    	RequestEntity requestEntity = new StringRequestEntity(buildJsonRequest(pageId), "application/json", "UTF-8");
        postRequest.setRequestEntity(requestEntity);
        
        // Re-try 10 times in case the server is too busy to give you response in time.
        int loop = 0;
        while(loop++ < 10) {
        	int response = httpClient.executeMethod(postRequest);
        	
        	if (response == 404) {
	            throw new Exception("Failed with HTTP error code : " + response + ". ZUORA Signature API End Point is incorrect.");
	        } else if (response == 401) {
        		throw new Exception("Failed with HTTP error code : " + response + ". ZUORA Login's Username or Password is incorrect.");
        	} else if (response != 200) {
        		throw new Exception("Failed with HTTP error code : " + response + ". ZUORA Login's Username or Password is incorrect.");
        	}
        	
	        if(postRequest.getResponseBody().length > 0) {
	        	break;
	        }
        }
        
        // Parse the response returned from ZUORA Signature API End Point
        byte[] res = postRequest.getResponseBody();
        String s = new String(res);
	    JSONObject result = new JSONObject(s);
	    if(!result.getBoolean("success")) {
	    	throw new Exception("Failed to generate signature. The reason is " + result.getString("reasons"));
	    }
	    
	    return result;
	}
	
	private static String buildJsonRequest(String pageId) throws NullPointerException, JSONException {
	    JSONObject json = new JSONObject();
	    if(url.toLowerCase().indexOf("https") >= 0) {
	    	Protocol.registerProtocol("https", new Protocol("https", new BypassSSLSocketFactory(), DEFAULT_HTTPS_PORT));
	    }
	    json.put("uri", url);
	    json.put("method","POST");
	    json.put("pageId", pageId);
	    return json.toString();
	}
		
	/**
	 * Validate signature using Hosted Page configuration
	 * 
	 * @param signature - signature need to validate
	 * @param expiredAfter - expired time in millisecond after the signature is created
	 * @throws Exception
	 */
	public static void validSignature(String signature, long expiredAfter) throws Exception {
		String decryptedSignature = SignatureDecrypter.decryptAsString(signature, publicKeyString);
	 	// Validate signature.
	 	if(StringUtils.isBlank(decryptedSignature)) {
			throw new Exception("Signature is empty.");			
		}
	 	
		StringTokenizer st = new StringTokenizer(decryptedSignature,"#");
		String url_signature = st.nextToken();
		String tenanId_signature = st.nextToken();
		String token_signature = st.nextToken();
		String timestamp_signature = st.nextToken();
		String pageId_signature = st.nextToken();
		
		if(StringUtils.isBlank(url_signature) || StringUtils.isBlank(tenanId_signature) || StringUtils.isBlank(token_signature) 
				|| StringUtils.isBlank(timestamp_signature) || StringUtils.isBlank(pageId_signature)) {
			throw new Exception("Signature is not complete.");
		}
		
		boolean isPageIdValid = false;
		for(HPMPage page : pages.values()) {
			if(page.getPageId().equals(pageId_signature)) {
				isPageIdValid = true;
				break;
			}
		}
		if(!isPageIdValid) {
			throw new Exception("Page Id in signature is invalid.");
		}
		
		if((new Date()).getTime() > (Long.parseLong(timestamp_signature) + expiredAfter)) {
			throw new Exception("Signature is expired.");
		}		
	}	

}