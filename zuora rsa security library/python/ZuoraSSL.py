__author__ = 'xin.li@zuora.com'
__copyright__ = """
Copyright (c) 2014 Zuora, Inc.

Permission is hereby granted, free of charge, to any person obtaining a copy of
this software and associated documentation files (the "Software"), to use copy,
modify, merge, publish the Software and to distribute, and sublicense copies of
the Software, provided no fee is charged for the Software.  In addition the
rights specified above are conditioned upon the following:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

Zuora, Inc. or any other trademarks of Zuora, Inc.  may not be used to endorse
or promote products derived from this Software without specific prior written
permission from Zuora, Inc.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NON-INFRINGEMENT. IN NO EVENT SHALL
ZUORA, INC. BE LIABLE FOR ANY DIRECT, INDIRECT OR CONSEQUENTIAL DAMAGES
(INCLUDING, BUT NOT LIMITED TO, PROCUREMENT OF SUBSTITUTE GOODS OR SERVICES;
LOSS OF USE, DATA, OR PROFITS; OR BUSINESS INTERRUPTION) HOWEVER CAUSED AND ON
ANY THEORY OF LIABILITY, WHETHER IN CONTRACT, STRICT LIABILITY, OR TORT
(INCLUDING NEGLIGENCE OR OTHERWISE) ARISING IN ANY WAY OUT OF THE USE OF THIS
SOFTWARE, EVEN IF ADVISED OF THE POSSIBILITY OF SUCH DAMAGE.
"""
__since__ = "2014-12-15"
__version__ = "1.0.0"
__email__ = "xin.li@zuora.com"

from base64 import b64decode, b64encode
from M2Crypto import RSA


class ZuoraSSL(object):
    """
    Helper class for encryption and decryption while communication with Zuora.
    """

    def __init__(self, public_key_string, public_key_loc=None):
        self.public_key_loc = "zuora_public_key.pem" if public_key_loc is None else public_key_loc
        self._create_public_key_pem_file(public_key_string)
        pass

    def _decrypt_with_public_key(self, encrypted_str):
        """
        :param encrypted_str: The encrypted string with base64 encoded
        :return:
        """
        pub_key = RSA.load_pub_key(self.public_key_loc)
        decrypted = pub_key.public_decrypt(b64decode(encrypted_str), RSA.pkcs1_padding)
        return decrypted

    @staticmethod
    def _break_to_multi_line(key_str):
        """
        Add '/n' every 64 characters.
        :param key_str:
        :return:
        """
        return '\n'.join(
            key_str[i:i + 64] for i in range(0, len(key_str), 64))

    def _create_public_key_pem_file(self, key_str):
        key_start = "-----BEGIN PUBLIC KEY-----"
        key_end = "-----END PUBLIC KEY-----"
        formatted_key_str = key_start + "\n" + ZuoraSSL._break_to_multi_line(key_str) + "\n" + key_end
        pem_file = open(self.public_key_loc, 'w+')
        pem_file.write(formatted_key_str)
        pem_file.close()

    def decrypt_signature(self, signature=""):
        """
        :param signature: A base64 encoded text.
        :return :
        """
        return self._decrypt_with_public_key(signature)

    def decrypt_signature_to_dict(self, signature):
        return ZuoraSSL._parse_signature_to_dict(self.decrypt_signature(signature))

    @staticmethod
    def _parse_signature_to_dict(signature):
        """
        :param signature: a string concated with "#" like /hpm2samplecodejsp/callback.jsp#9#5ZUbvhzsquXKrnd0qkjdT6XkMXpTVYh2#1418192059150#4028904a49eff36e0149f43e62cb000e
        :return: a dictionary like : <code>{
            "url_signature" : "/hpm2samplecodejsp/callback.jsp"
            "tenantId" : "9"
            "token_signature":"5ZUbvhzsquXKrnd0qkjdT6XkMXpTVYh2"
            "timestamp_signature":"1418192059150"
            "pageId":"4028904a49eff36e0149f43e62cb000e"
        } </code>
        """
        array = signature.split("#")
        assert len(array) == 5
        return {
            "url_signature": array[0],
            "tenantId": array[1],
            "token_signature": array[2],
            "timestamp_signature": array[3],
            "pageId": array[4]
        }

    def encrypt_message(self, message):
        """
        :param message: text to be encrypted.
        :return:
        """
        pub_key = RSA.load_pub_key(self.public_key_loc)
        encrypted = pub_key.public_encrypt(message, RSA.pkcs1_padding)
        encrypted = b64encode(encrypted)
        return encrypted


