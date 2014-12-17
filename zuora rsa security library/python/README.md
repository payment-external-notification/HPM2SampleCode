ZuoraSSL Python Client
================

This is a util module for encrypting message and decrypting signature when communication with Zuora.


## How To Use

1. Dependency:

This module depends on **M2Crypto**, so you should install **M2Crypto** before using this module.
**M2Crypto** can be installed via **pip** with `pip install M2Crypto`, or you can download it from: https://pypi.python.org/pypi/M2Crypto

1. Encrypt Message

```python
from ZuoraSSL import ZuoraSSL

zuoraSSL = ZuoraSSL(
    "MIIBIjANBgkqhkiG9w0BAQEFAAOCAQ8AMIIBCgKCAQEAt7k14Yxu1pmXqMr67Yu0QcPFbY3R+S/AKjFpoyQJtMo2oTJAoDrcKKijN/40w9KCMxYqxCNrgez996zPIl7QRPGtuqv7F6Y0hi4pSrRtm+C2spf9T5PVrpcAf0tr0vglkW+cttMmQQ1/dwNDT7zRxTlSReQvkQ1aieEGiitBkkmnI0ThhUubJCTI90u4NO5fIkWJodbxsZ0w9eEJ3IpPCGEwjOkrTQtoa0IfacdMW7nxOQEvWiUQ2Pq154sNTfVRjCZsjugl8zkCLcp8IPqJ4rkNQu8WyylPb5Rp74I6nKSuNJkLGV8DoHHOTMuT4521oksrzrYs2NOtDlC0R+Ba0wIDAQAB")
encrypted = zuoraSSL.encrypt_message("Hello I'm Your Boss")
print(encrypted)
```

2. Decrypt Signatrue

```python
from ZuoraSSL import ZuoraSSL

zuoraSSL = ZuoraSSL(
    "MIIBIjANBgkqhkiG9w0BAQEFAAOCAQ8AMIIBCgKCAQEAt7k14Yxu1pmXqMr67Yu0QcPFbY3R+S/AKjFpoyQJtMo2oTJAoDrcKKijN/40w9KCMxYqxCNrgez996zPIl7QRPGtuqv7F6Y0hi4pSrRtm+C2spf9T5PVrpcAf0tr0vglkW+cttMmQQ1/dwNDT7zRxTlSReQvkQ1aieEGiitBkkmnI0ThhUubJCTI90u4NO5fIkWJodbxsZ0w9eEJ3IpPCGEwjOkrTQtoa0IfacdMW7nxOQEvWiUQ2Pq154sNTfVRjCZsjugl8zkCLcp8IPqJ4rkNQu8WyylPb5Rp74I6nKSuNJkLGV8DoHHOTMuT4521oksrzrYs2NOtDlC0R+Ba0wIDAQAB")

decrypted = zuoraSSL.decrypt_signature(
    "rxJ8Dv2G0L+5h9Z7y1f+p6DR2+SGL9ixF/qzRfzEAJ3OtLEd6POxfLgtG+0J8YDY3FuO3FpAGZotdOcQarnYMkbjkWOBNgMA9kmEZaZnEeXUuYJn5eSb0wtO3Vqh65xK6vFAeuFH/ONaeuRvN34a3mUn1p/9jw+PF1dpMBdTHFo94ezPQL0q6yP/TTKSQLEk9E+f9yRcBTW4ZbqhvwFSD8Xzi1URrr6cpkVNP+tatYFzHnBFNDzIl2ZuKU97L2Ao/DChy/mJ2hhHNtx7XzXGmXVRQnUEeXSvguwi+s9Ktb6cxmh05g5P/SEsYJymHDsdDumx0cXJD+SkkntuK1omgg==")
print(decrypted)

```

The result should be like this:
```
/hpm2samplecodejsp/callback.jsp#9#5ZUbvhzsquXKrnd0qkjdT6XkMXpTVYh2#1418192059150#4028904a49eff36e0149f43e62cb000e
```

If you want a dictionary decrypted from the signature instead of a string with '#' connected,  you can use `decrypt_signature_to_dict` method, and you will get a dictionary like below:

```python
{'pageId': '4028904a49eff36e0149f43e62cb000e', 'token_signature': '5ZUbvhzsquXKrnd0qkjdT6XkMXpTVYh2', 'timestamp_signature': '1418192059150', 'url_signature': '/hpm2samplecodejsp/callback.jsp', 'tenantId': '9'}
```

## Copyright

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