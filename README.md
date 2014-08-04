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

The goal of this project is to minimize the complexity and implementation time of including the hosted pages in the customer sites. The customer should be able to include pages by writing fewer lines of code and thereby reducing the implementation time. 

There are two steps which needs to be implemented by the customer in order to implement HPM Version 2.0.The two steps are mentioned as follows:


1.Hiding the signature complexity using CORS:
This step is the first step in which the customer will be able to generate the token and the digital signature which will be used to access the hosted pages.The CORS Api plays a vital role in generating the token and signature used for accessing the hosted pages.The signature are stored in Zuora's database and is used for signature verification at the time of page access.This leads to decoupling of Zuora resource access from the digital signature generation and thus, provides a uniform way of accessing the hosted pages.


2.Including the Zuora javascript library:
In this step, the customer will be required to include the Zuora javascript library which will hide the implementation details and thus, will allow implementation with fewer configurations which will indeed result in a very efficient way of implementation.This library will handle the pre-population of the form fields and handle the successful response. It will also give the customer the option to render the page inline with their existing page or as an overlay on their page. It also hides the complexity around the cross-origin scripting for iframe communication. The code below enumerates the code required to render the page. The library uses JSON parameters for rendering.




PRE-REQUISITES
-------------

This sample code package is an unmanaged package that depends on the following Z-Force managed packages: 
- Z-Force 360 Version 2.2
- Z-Force Quotes Version 5.3

INSTALLATION INSTRUCTIONS
-------------------------

1. Install this sample code package using the following Force.com Installation URL (Version 1.1): 

https://login.salesforce.com/packaging/installPackage.apexp?p0=04td0000000AFwd

This will install sample code unmanaged package into your Salesforce.com organization.

CONFIGURATION INSTRUCTIONS 
--------------------------

1. Add "New Payment Method" button onto the following Quote V5.0 Layouts: 
Quote Layout Default V5.0
Quote Layout Amendment V5.0
Quote Layout Renewal V5.0
Quote Layout Default Read-only V5.0
Quote Layout Amendment Read-only V5.0
Quote Layout Renewal Read-only V5.0

2. Add "New Payment Method" button onto the Billing Account Layouts.

3. Follow the instructions on the following link to configure a Z-Payment Page in Zuora: 
http://knowledgecenter.zuora.com/C_Zuora_User_Guides/B_Commerce/Z-Payments_Page_User_Guide/Implementing_Z-Payments_Page_with_Salesforce.com/B_Create_a_Hosted_Payment_Page_in_Zuora

4. Follow the instructions on the following link to configure Z-Payment settings in Salesforce.com organization: 
http://knowledgecenter.zuora.com/C_Zuora_User_Guides/B_Commerce/Z-Payments_Page_User_Guide/Implementing_Z-Payments_Page_with_Salesforce.com/C_Configure_the_Z-Payments_Page_Settings_in_Salesforce.com

For more information on Salesforce.com and Z-Payment Pages integration please refer to the Z-Payment Pages chapter on Zuora knowledge center: 
http://knowledgecenter.zuora.com/C_Zuora_User_Guides/B_Commerce/Z-Payments_Page_User_Guide
 

