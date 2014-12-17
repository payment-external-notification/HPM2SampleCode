package com.zuora.rsa.security.decrypt;

import java.util.Map;

import com.zuora.rsa.security.decrypt.SignatureDecrypter;
import com.zuora.rsa.security.decrypt.SignatureDecrypter.Key;

import junit.framework.TestCase;

public class SignatureDecrypterTest extends TestCase {
	
	private static final String encryptedSignature = "/apps/publichostedpagelite.do#9#3YTFLeeVxMY70kualpukzwrWDTzyEQAI#1418368033291#4028920a493c052701493c182db30023";
	
	public void testDecryptAsString() throws Exception {
		String pubKey = "MIIBIjANBgkqhkiG9w0BAQEFAAOCAQ8AMIIBCgKCAQEAlRiGIXX1zM8RN/x/3aoZjcfv2xUK7w0SHiFna4pkDgYk4RU+fH5TRv5gwjMglF0Pbm9n1esQn1O/lGCzmlr9r1OBBsrw8novA/pal8vshbRTowKXW3BKjJNUyxxPunMhhj/dniFOP+2oP2y3UOrSLassb5Gz6IBMslp4zRVzy/uUZJj6DmIq0Y/f7tzfPXRT5HZwQPHL+O/llrfRSHxt0VRHun17LpPpiOn6GFLFBk83LW4UehYnhjpwVdUJdNrNpNQAvy1pgn3kSwaEWTUb1lUTjMvib6lU1GlE+GwKRpCzZowkCqvWGdQPhh7Tewmr9dWj/54V5UUF3QU+hcZ5EwIDAQAB";
		String signature = "k7OBLfWB80TZeFZ5p8kivVPvOaaiD3I6It4uNF0pX5wa+UMckiNOGrpOlZsdBxS/7Aw7UPaA3xOWIp0MvNPtllUUlsvUr/RQ29gqa+TX4l89Y0jNMtpRToC/Hy9UDndHjEtfM3ABMWIXYrEOYWJo1k3SG13jeKF4WD2iSGqd6BTG2etsJIB2nba/CZriT6h7TJTX8KbmJFmVukNsiu0Knyo8wWCDnZ0Nn5+aB1RYdCH7lYvkMQsFF/OA+1l7BTBhOvfBsCQ4/K00ooQrfVyZkwf7nTJzPenBxf+DKwHR1kvPzX+6m7zQHcgaNinTtFwCo0NQrnaISws/oclCO49Oww==";
		String decryptSignature = SignatureDecrypter.decryptAsString(signature, pubKey);
		assertTrue(decryptSignature.equalsIgnoreCase(encryptedSignature));
	}

	public void testDecryptAsMap() throws Exception {
		String pubKey = "MIIBIjANBgkqhkiG9w0BAQEFAAOCAQ8AMIIBCgKCAQEAlRiGIXX1zM8RN/x/3aoZjcfv2xUK7w0SHiFna4pkDgYk4RU+fH5TRv5gwjMglF0Pbm9n1esQn1O/lGCzmlr9r1OBBsrw8novA/pal8vshbRTowKXW3BKjJNUyxxPunMhhj/dniFOP+2oP2y3UOrSLassb5Gz6IBMslp4zRVzy/uUZJj6DmIq0Y/f7tzfPXRT5HZwQPHL+O/llrfRSHxt0VRHun17LpPpiOn6GFLFBk83LW4UehYnhjpwVdUJdNrNpNQAvy1pgn3kSwaEWTUb1lUTjMvib6lU1GlE+GwKRpCzZowkCqvWGdQPhh7Tewmr9dWj/54V5UUF3QU+hcZ5EwIDAQAB";
		String signature = "k7OBLfWB80TZeFZ5p8kivVPvOaaiD3I6It4uNF0pX5wa+UMckiNOGrpOlZsdBxS/7Aw7UPaA3xOWIp0MvNPtllUUlsvUr/RQ29gqa+TX4l89Y0jNMtpRToC/Hy9UDndHjEtfM3ABMWIXYrEOYWJo1k3SG13jeKF4WD2iSGqd6BTG2etsJIB2nba/CZriT6h7TJTX8KbmJFmVukNsiu0Knyo8wWCDnZ0Nn5+aB1RYdCH7lYvkMQsFF/OA+1l7BTBhOvfBsCQ4/K00ooQrfVyZkwf7nTJzPenBxf+DKwHR1kvPzX+6m7zQHcgaNinTtFwCo0NQrnaISws/oclCO49Oww==";
		Map<Key, String> map = SignatureDecrypter.decryptAsMap(signature, pubKey);
		assertTrue(map.get(Key.Url).equalsIgnoreCase("/apps/publichostedpagelite.do"));
	}
}
