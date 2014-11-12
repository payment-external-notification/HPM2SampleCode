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
package com.zuora.demo.hosted.lite;

import java.io.FileInputStream;
import java.io.IOException;
import java.util.HashMap;
import java.util.Map;
import java.util.Properties;

import javax.servlet.ServletException;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import com.zuora.hosted.lite.util.HPMHelper;

/**
 * ShowPageServlet generates signature and set the information used to render Hosted Page. 
 * 
 * @author Tony.Liu, Chunyu.Jia.
 */
public class ShowPageServlet extends HttpServlet {
	
	private static final long serialVersionUID = 9144330619558774243L;

	@Override
	protected void doGet(HttpServletRequest req, HttpServletResponse resp) throws ServletException, IOException {
		Map<String, String> params = new HashMap<String, String>();
		if("overlay".equals(req.getParameter("style"))) {
			params.put("style", "overlay");
			params.put("submitEnabled", "true");			
		} else if("true".equals(req.getParameter("submitEnable"))) {
			params.put("style", "inline");
			params.put("submitEnabled", "true");
		} else {
			params.put("style", "inline");
			params.put("submitEnabled", "false");
			params.put("retainValues", "true");
		}
		params.put("locale", req.getParameter("locale"));
		
		Properties prepopulateFields = new Properties();
		prepopulateFields.load(new FileInputStream(req.getServletContext().getRealPath("WEB-INF") + "/data/prepopulate.properties"));
		
		try{
			HPMHelper.prepareParamsAndFields(req.getParameter("pageName"), params, (Map)prepopulateFields);
		}catch(Exception e) {
			// TODO: Error handling code should be added here.
			
			System.out.println("Error happened during generating signature.");
			
			e.printStackTrace();
			
			throw new ServletException("Error happened during generating signature. " + e.getMessage());
		}	
		req.setAttribute("params", params);
		req.setAttribute("prepopulateFields", prepopulateFields);
		
		if("overlay".equals(req.getParameter("style"))) {
			req.getRequestDispatcher("/Overlay.jsp").forward(req, resp);
		} else if("true".equals(req.getParameter("submitEnable"))) {
			req.getRequestDispatcher("/Inline_ButtonIn.jsp").forward(req, resp);
		} else {
			req.getRequestDispatcher("/Inline_ButtonOut.jsp").forward(req, resp);
		}
	}	
}
