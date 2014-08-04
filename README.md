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

There are two steps which needs to be implemented by the customer in order to implement HPM Version 2.0.The two steps are mentioned as follows:


1.Generating the digital signature and token using CORS:
This step is the first step in which the customer will be able to generate the token and the digital signature which will be used to access the hosted pages.The CORS Api plays a vital role in generating the token and signature used for accessing the hosted pages.

2.Including the Zuora javascript library:
In this step, the customer will be required to include the Zuora javascript library which will result in a very efficient way of implementation by eliminating embedding of an iframe in the page, removing all the error handling scenarios and eliminating the callback responses.




PRE-REQUISITES
-------------
It is necessary to include all the zuora javascript files of HPM 1.0 Version in order to implement the HPM 2.0 version.

For more information on the implementation of HPM Verison 2.0  please refer to the HPM Version 2.0 chapter on Zuora knowledge center: 
http://knowledgecenter.zuora.com/
 

