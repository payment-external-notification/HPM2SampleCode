HPM2SampleCodeJava is JEE dynamic web application eclipse project which demonstrates how to utilize HPM2.0 in your commerce web application. 


REQUIREMENTS:
-----------
1. JDK 1.6.
	
2. Eclipse 3.7
	
3. Tomcat 7.0 or other servlet container.


RUNNING THE SAMPLE:
------------
1. Import this project into Eclipse.
	
2. Modify the file HPM2SampleCodeJava/WebContent/WEB-INF/conf/configuration.properties to set HPM configurations. Here are the descriptions of the properties in it:
		
   url - Hosted Page URL, for the production environment: https://www.zuora.com/apps/PublicHostedPageLite.do; for the API Sandbox environment: https://apisandbox.zuora.com/apps/PublicHostedPageLite.do.
		
   endPoint - Signature API End Point, for the production environment: https://www.zuora.com/apps/v1/rsa-signatures; for the API Sandbox environment: https://apisandbox.zuora.com/apps/v1/rsa-signatures.
		
   username - Login's user name.
		
   password - Login's password.
		
   publicKey - Public key, it can be retrieved in Zuora application through the following path: Settings > Administration Settings > Security Policies > Get Key.
		
   jsPath - Javascript library path, for the production environment: https://static.zuora.com/Resources/libs/hosted/1.0.0/zuora-min.js; for the API Sandbox environment: https://apisandboxstatic.zuora.com/Resources/libs/hosted/1.0.0/zuora-min.js.

   Multiple Hosted Pages can be configured in configuration.properties. Each Hosted Page should has an unique page name. The property name of Hosted Page should start with 'page.' following page name. Here are descriptions of Hosted Page properties:
		
   page.PageName.pageId - Page Id, for example: 'page.A.pageId=402880244928584a0149285beb3c0004' means the page id of the Hosted Page with page name 'A' is 402880244928584a0149285beb3c0004.
		
   page.PageName.paymentGateway - Payment Gateway Name, the name of the available payment gateway in Zuora application. If not set, the default payment gateway will be used.
		
   page.PageName.locale - Available locales, available locales of the Hosted Page separated by ',', for example: 'page.A.locale=en,fr,zh'. 
		
3. Modify the file HPM2SampleCodeJava/WebContent/WEB-INF/data/prepopulate.properties to set the values for pre-populate fields.
	
4. Modify the Hosted Page configurtions in Zuora application.
	 
   Hosted Domain - set to the domain which HPM2SampleCodeJava will run at. For example: http://localhost:8080
	 
   Callback Path - set to HPM2SampleCodeJava/callback.
	
5. Build this project.
	
6. Deploy to Tomcat.
	
7. In browser access the project's URL, for example: http://localhost:8080/HPM2SampleCodeJava. 
