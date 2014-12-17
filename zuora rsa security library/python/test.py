__author__ = 'xin.li@zuora.com'

from ZuoraSSL import ZuoraSSL
import unittest

DUMMY_DECRYPTED_SIGNATURE = "/hpm2samplecodejsp/callback.jsp#9#5ZUbvhzsquXKrnd0qkjdT6XkMXpTVYh2#1418192059150#4028904a49eff36e0149f43e62cb000e"
DUMMY_PUBLIC_KEY = "MIIBIjANBgkqhkiG9w0BAQEFAAOCAQ8AMIIBCgKCAQEAt7k14Yxu1pmXqMr67Yu0QcPFbY3R+S/AKjFpoyQJtMo2oTJAoDrcKKijN/40w9KCMxYqxCNrgez996zPIl7QRPGtuqv7F6Y0hi4pSrRtm+C2spf9T5PVrpcAf0tr0vglkW+cttMmQQ1/dwNDT7zRxTlSReQvkQ1aieEGiitBkkmnI0ThhUubJCTI90u4NO5fIkWJodbxsZ0w9eEJ3IpPCGEwjOkrTQtoa0IfacdMW7nxOQEvWiUQ2Pq154sNTfVRjCZsjugl8zkCLcp8IPqJ4rkNQu8WyylPb5Rp74I6nKSuNJkLGV8DoHHOTMuT4521oksrzrYs2NOtDlC0R+Ba0wIDAQAB"
DUMMY_ENCRYPTED_SIGNATURE = "rxJ8Dv2G0L+5h9Z7y1f+p6DR2+SGL9ixF/qzRfzEAJ3OtLEd6POxfLgtG+0J8YDY3FuO3FpAGZotdOcQarnYMkbjkWOBNgMA9kmEZaZnEeXUuYJn5eSb0wtO3Vqh65xK6vFAeuFH/ONaeuRvN34a3mUn1p/9jw+PF1dpMBdTHFo94ezPQL0q6yP/TTKSQLEk9E+f9yRcBTW4ZbqhvwFSD8Xzi1URrr6cpkVNP+tatYFzHnBFNDzIl2ZuKU97L2Ao/DChy/mJ2hhHNtx7XzXGmXVRQnUEeXSvguwi+s9Ktb6cxmh05g5P/SEsYJymHDsdDumx0cXJD+SkkntuK1omgg=="


class ZuoraSSLTest(unittest.TestCase):
    def setUp(self):
        self.zuoraSSL = ZuoraSSL(DUMMY_PUBLIC_KEY)
        pass

    def test_encrypt(self):
        encrypted_message = self.zuoraSSL.encrypt_message("A message to Be Encrypted")
        self.assertIsNotNone(encrypted_message, "Encrypted message should not be none")

    def test_decrypt_signature(self):
        decrypted = self.zuoraSSL.decrypt_signature(DUMMY_ENCRYPTED_SIGNATURE)
        print(decrypted)
        self.assertEqual(decrypted, DUMMY_DECRYPTED_SIGNATURE)

    def test_decrypt_signature_to_dict(self):
        decrypted_dict = self.zuoraSSL.decrypt_signature_to_dict(DUMMY_ENCRYPTED_SIGNATURE)
        self.assertEqual(decrypted_dict['url_signature'], "/hpm2samplecodejsp/callback.jsp")
        self.assertEqual(decrypted_dict['tenantId'], "9")
        self.assertEqual(decrypted_dict['token_signature'], "5ZUbvhzsquXKrnd0qkjdT6XkMXpTVYh2")
        self.assertEqual(decrypted_dict['timestamp_signature'], "1418192059150")
        self.assertEqual(decrypted_dict['pageId'], "4028904a49eff36e0149f43e62cb000e")
