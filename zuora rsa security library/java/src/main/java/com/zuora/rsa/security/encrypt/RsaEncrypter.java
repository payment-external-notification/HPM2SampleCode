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
package com.zuora.rsa.security.encrypt;

import java.nio.charset.Charset;
import java.security.Security;

import javax.crypto.Cipher;

import org.apache.commons.codec.binary.Base64;
import org.bouncycastle.jce.provider.BouncyCastleProvider;

import com.zuora.rsa.security.PublicKeyBuilder;

/**
 * <p><b>Function:</b> Encrypt string with public key.
 *
 * @author Tony Liu
 * @since Dec 15, 2014 12:52:06 PM
 * @see
 */
public class RsaEncrypter {
	public static final String encrypt(String encryptedString, String publicKey) throws Exception {
		Security.addProvider(new BouncyCastleProvider());
		
		Cipher encrypter = Cipher.getInstance("RSA/ECB/PKCS1Padding");
	 	encrypter.init(Cipher.ENCRYPT_MODE, PublicKeyBuilder.build(publicKey));
	 	byte[] unencoded = encrypter.doFinal(encryptedString.getBytes(Charset.forName("UTF-8")));
	 	return new String(Base64.encodeBase64(unencoded));
	}
}
