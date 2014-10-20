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
package com.zuora.demo.hosted.lite.util;

import java.io.FileInputStream;
import java.io.IOException;
import java.io.StringReader;
import java.nio.charset.Charset;
import java.security.Key;
import java.security.Security;
import java.util.ArrayList;
import java.util.LinkedHashMap;
import java.util.List;
import java.util.Map;
import java.util.Properties;
import java.util.StringTokenizer;
import java.util.regex.Matcher;
import java.util.regex.Pattern;

import javax.crypto.Cipher;

import org.apache.commons.codec.binary.Base64;
import org.apache.commons.httpclient.HttpClient;
import org.apache.commons.httpclient.methods.PostMethod;
import org.apache.commons.httpclient.methods.RequestEntity;
import org.apache.commons.httpclient.methods.StringRequestEntity;
import org.apache.commons.httpclient.protocol.Protocol;
import org.apache.commons.lang.StringUtils;
import org.bouncycastle.jce.provider.BouncyCastleProvider;
import org.bouncycastle.openssl.PEMReader;
import org.json.JSONException;
import org.json.JSONObject;

import com.zuora.demo.hosted.lite.support.BypassSSLSocketFactory;

/**
 * Bypass self-signed certificate when we try to get signature from zuora application.
 * Note:
 *      if you have had valid certificate under the jdk, then you don't need to use this.
 *       
 * @author Tony.Liu, Chunyu.Jia.
 */
public class HPMHelper {
	
	private static final int DEFAULT_HTTPS_PORT = 443;
	
	private String url;
	private String endPoint;
	private String username;
	private String password;
	private String publicKeyString;
	private String jsPath;
	private Key publicKeyObject;
	private Map<String, HPMPage> pages;
	
	private HPMHelper() {
		url = "";
		endPoint = "";
		username = "";
		password = "";
		publicKeyString = "";
		jsPath = "";
		pages = new LinkedHashMap<String, HPMPage>();
	}
		
	private static HPMHelper hpmHelper;
	
	static {
		Security.addProvider(new BouncyCastleProvider());
	}
	
	public synchronized static HPMHelper getInstance() {
		if(hpmHelper == null) {
			hpmHelper = new HPMHelper();
		}
		return hpmHelper;
	}
	
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
	
	public void loadConfiguration(String configFile) throws IOException {
		Properties props = new Properties();
		props.load(new FileInputStream(configFile));
		
		url = props.getProperty("url");
		endPoint = props.getProperty("endPoint");
		username =props.getProperty("username");
		password = props.getProperty("password");
		publicKeyString = props.getProperty("publicKey");
		jsPath = props.getProperty("jsPath");
		
		for(Object key : props.keySet()) {
			Pattern pattern = Pattern.compile("page\\.([^\\.]+)\\.([^\\.]+)");
			Matcher matcher = pattern.matcher((String)key);
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
		
		generatePublicKeyObject();
	}
	
	public String getUrl() {
		return url;
	}
	
	public void setUrl(String url) {
		this.url = url;
	}
	
	public String getEndPoint() {
		return endPoint;
	}
	
	public void setEndPoint(String endPoint) {
		this.endPoint = endPoint;
	}
		
	public String getUsername() {
		return username;
	}
	
	public void setUsername(String username) {
		this.username = username;
	}
	
	public String getPassword() {
		return password;
	}
	
	public void setPassword(String password) {
		this.password = password;
	}	
	
	public String getPublicKeyString() {
		return publicKeyString;
	}

	public void setPublicKeyString(String publicKeyString) throws IOException {
		this.publicKeyString = publicKeyString;
		
		generatePublicKeyObject();
	}

	public String getJsPath() {
		return jsPath;
	}

	public void setJsPath(String jsPath) {
		this.jsPath = jsPath;
	}

	public String getPublicKey() {
		return publicKeyString;
	}
	
	public Map<String, HPMPage> getPages() {
		return pages;
	}

	public void setPages(Map<String, HPMPage> pages) {
		this.pages = pages;
	}

	private void generatePublicKeyObject() throws IOException {
		PEMReader pemReader = new PEMReader(new StringReader("-----BEGIN PUBLIC KEY-----\n" + publicKeyString + "\n-----END PUBLIC KEY-----"));
		publicKeyObject = (Key)pemReader.readObject();
		pemReader.close();
	}
		
	private String buildJsonRequest(String pageId) throws NullPointerException, JSONException {
	    JSONObject json = new JSONObject();
	    if(url.toLowerCase().indexOf("https") >= 0) {
	    	Protocol.registerProtocol("https", new Protocol("https", new BypassSSLSocketFactory(), DEFAULT_HTTPS_PORT));
	    }
	    json.put("uri", url);
	    json.put("method","POST");
	    json.put("pageId", pageId);
	    return json.toString();
	}
	
	public JSONObject generateSignaure(String pageName) throws Exception {
		HPMPage page = pages.get(pageName);
		if(page == null) {
			throw new Exception("Could not find Hosted Page configurations for " + pageName);
		}
		
		HttpClient httpClient = new HttpClient();
		PostMethod postRequest = new PostMethod(endPoint);  
    	postRequest.addRequestHeader("apiAccessKeyId", username);
    	postRequest.addRequestHeader("apiSecretAccessKey", password);
    	postRequest.addRequestHeader("Accept", "application/json");
    	
    	RequestEntity requestEntity = new StringRequestEntity(buildJsonRequest(page.getPageId()), "application/json", "UTF-8");
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
	    JSONObject json = new JSONObject(s);
	    return json;
	}

	public boolean isValidSignature(String pageName, String signature) throws Exception {
		HPMPage page = pages.get(pageName);
		if(page == null) {
			throw new Exception("Could not find Hosted Page configurations for " + pageName);
		}
		
		// Decrypt signature.
		byte[] decoded = Base64.decodeBase64(signature.getBytes(Charset.forName("UTF-8")));
		Cipher encrypter = Cipher.getInstance("RSA/ECB/PKCS1Padding");
		encrypter.init(Cipher.DECRYPT_MODE, publicKeyObject);
	 	String decryptedSignature = new String(encrypter.doFinal(decoded));
	 	
	 	// Validate signature.
	 	if(StringUtils.isBlank(decryptedSignature)) {
			return false;			
		}
	 	
		StringTokenizer st = new StringTokenizer(decryptedSignature,"#");
		String url_signature = st.nextToken();
		String tenanId_signature = st.nextToken();
		String token_signature = st.nextToken();
		String timestamp_signature = st.nextToken();
		String pageId_signature = st.nextToken();
		
		if(StringUtils.isBlank(url_signature) || StringUtils.isBlank(tenanId_signature) || StringUtils.isBlank(token_signature) 
				|| StringUtils.isBlank(timestamp_signature) || StringUtils.isBlank(pageId_signature)) {
			return false;
		}
		
		if(!pageId_signature.equals(page.getPageId())) {
			return false;
		}
		
   	  	return true;   	  
	}	
	
	public boolean isValidPublicKey(String publicKey) {
		if(publicKeyString.length() == publicKey.length() && publicKeyString.equals(publicKey)) {
			return true;
		}
		
		return false;
	}

	public HPMPage getPage(String pageName) {
		return pages.get(pageName);
	}
}