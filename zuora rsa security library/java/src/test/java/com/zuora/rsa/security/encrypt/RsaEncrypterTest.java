/*
 * Copyright 2014 Tony
 * 
 * Licensed under the Private License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * 		http://www.saas.com/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */
package com.zuora.rsa.security.encrypt;

import junit.framework.TestCase;

public class RsaEncrypterTest extends TestCase {
	
	public void testEncryptWithPublicKey() throws Exception {
		String pubKey = "MIIBIjANBgkqhkiG9w0BAQEFAAOCAQ8AMIIBCgKCAQEAlRiGIXX1zM8RN/x/3aoZjcfv2xUK7w0SHiFna4pkDgYk4RU+fH5TRv5gwjMglF0Pbm9n1esQn1O/lGCzmlr9r1OBBsrw8novA/pal8vshbRTowKXW3BKjJNUyxxPunMhhj/dniFOP+2oP2y3UOrSLassb5Gz6IBMslp4zRVzy/uUZJj6DmIq0Y/f7tzfPXRT5HZwQPHL+O/llrfRSHxt0VRHun17LpPpiOn6GFLFBk83LW4UehYnhjpwVdUJdNrNpNQAvy1pgn3kSwaEWTUb1lUTjMvib6lU1GlE+GwKRpCzZowkCqvWGdQPhh7Tewmr9dWj/54V5UUF3QU+hcZ5EwIDAQAB";
		String encryptedString = RsaEncrypter.encrypt("41111111111111111", pubKey);
		assertNotNull(encryptedString);
	}
}
