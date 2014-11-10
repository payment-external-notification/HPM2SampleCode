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
package com.zuora.hosted.lite.support;

import java.io.IOException;
import java.net.InetAddress;
import java.net.Socket;
import java.net.UnknownHostException;

import javax.net.SocketFactory;
import javax.net.ssl.HttpsURLConnection;
import javax.net.ssl.SSLContext;
import javax.net.ssl.TrustManager;
import javax.net.ssl.X509TrustManager;

import org.apache.commons.httpclient.ConnectTimeoutException;
import org.apache.commons.httpclient.params.HttpConnectionParams;
import org.apache.commons.httpclient.protocol.ProtocolSocketFactory;

/**
 * Bypass self-signed certificate when we try to get signature from zuora application.
 * Note:
 *      if you have had valid certificate under the jdk, then you don't need to use this.
 *       
 * @author Tony.Liu, Chunyu.Jia.
 */
public class BypassSSLSocketFactory implements ProtocolSocketFactory {

	private TrustManager[] getTrustManager() {
 		TrustManager[] trustAllCerts = new TrustManager[] {
	 		new X509TrustManager() {
	 			public java.security.cert.X509Certificate[] getAcceptedIssuers() {
	 				return null;
	 			}
	 
				public void checkClientTrusted(
						java.security.cert.X509Certificate[] certs, String authType) {
	 			}
	 
				public void checkServerTrusted(
						java.security.cert.X509Certificate[] certs, String authType) {
	 			}
	 		}
		};
 		
		return trustAllCerts;
	}
 
	public Socket createSocket(String host, int port) throws IOException, UnknownHostException {
		TrustManager[] trustAllCerts = getTrustManager();
 		try {
 			SSLContext sc = SSLContext.getInstance("SSL");
 			sc.init(null, trustAllCerts, new java.security.SecureRandom());
 			HttpsURLConnection.setDefaultSSLSocketFactory(sc.getSocketFactory());
 			SocketFactory socketFactory = HttpsURLConnection.getDefaultSSLSocketFactory();
 			return socketFactory.createSocket(host, port);
 		}catch (Exception ex) {
			throw new UnknownHostException("Problems to connect " + host + ex.toString());
		}
	}
 
	public Socket createSocket(Socket socket, String host, int port, boolean flag) throws IOException, UnknownHostException {
		TrustManager[] trustAllCerts = getTrustManager();
		try {
			SSLContext sc = SSLContext.getInstance("SSL");
			sc.init(null, trustAllCerts, new java.security.SecureRandom());
			HttpsURLConnection.setDefaultSSLSocketFactory(sc.getSocketFactory());
			SocketFactory socketFactory = HttpsURLConnection.getDefaultSSLSocketFactory();
			return socketFactory.createSocket(host, port);
		}catch (Exception ex) {
 			throw new UnknownHostException("Problems to connect " + host + ex.toString());
 		}
	}
 
	public Socket createSocket(String host, int port, InetAddress clientHost, int clientPort) throws IOException, UnknownHostException {
 		TrustManager[] trustAllCerts = getTrustManager();
 		try {
			SSLContext sc = SSLContext.getInstance("SSL");
			sc.init(null, trustAllCerts, new java.security.SecureRandom());
			HttpsURLConnection.setDefaultSSLSocketFactory(sc.getSocketFactory());
 			SocketFactory socketFactory = HttpsURLConnection.getDefaultSSLSocketFactory();
 			return socketFactory.createSocket(host, port, clientHost, clientPort);
		}catch (Exception ex) {
 			throw new UnknownHostException("Problems to connect " + host + ex.toString());
		}
	}
 
	@Override
	public Socket createSocket(String host, int port, InetAddress localAddress, int localPort, HttpConnectionParams arg4) throws IOException, UnknownHostException, ConnectTimeoutException {
		TrustManager[] trustAllCerts = getTrustManager();
		try {
			SSLContext sc = SSLContext.getInstance("SSL");
			sc.init(null, trustAllCerts, new java.security.SecureRandom());
			HttpsURLConnection.setDefaultSSLSocketFactory(sc.getSocketFactory());
 			SocketFactory socketFactory = HttpsURLConnection.getDefaultSSLSocketFactory();
 
			return socketFactory.createSocket(host, port);
		}catch (Exception ex) {
 			throw new UnknownHostException("Problems to connect " + host + ex.toString());
 		}
	}

}
