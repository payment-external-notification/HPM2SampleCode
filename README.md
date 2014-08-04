/*    Copyright (c) 2014 Zuora, Inc.
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

INTRODUCTION
------------

There are two steps which needs to be implemented by the customer in order to implement Hosted Payment Pages Version 2.0.The two steps are mentioned as follows:


A) Generating the digital signature and token using CORS:

CORS is Zuora's REST API call to generate the digital signature for the resources. The REST call generates the token, signature and also returns the public key for encryption of the sensitive data. Please refer to the CorsApiCall under src directory for the curl representation of the API call.


B) Including the Zuora javascript library:

In order to render the Hosted Pages on client side, please include the Zuora's public library (zuroa-*.js) in your page.  The implementation parameters are illustrated in the same code src/HPM2Javascript file. Please refer to comments inlined within the sample code to understand the usage of parameters. Also refer to the src/HPMPrepopulationFields to see the list of field names that can be prepopulated in the rendered payment form.



PRE-REQUISITES
-------------

a) Please create the Hosted Payment Pages Version 2.0 configuration in zuora application.

b) Include the zuora public javascript library(zuora-*.js) in your implementation page.

For more information on the implementation and configuration of Hosted Payment Pages Version 2.0.  

Please refer to the HPM Version 2.0 chapter on Zuora knowledge center: 

http://knowledgecenter.zuora.com/
 

File Index
-----------------

src/Pages/   Sample Javascript Implementation
src/Pages/..   List of prepopulated fields.







