// Copyright 2019 Google LLC
//
// Licensed under the Apache License, Version 2.0 (the "License");
// you may not use this file except in compliance with the License.
// You may obtain a copy of the License at
//
//     https://www.apache.org/licenses/LICENSE-2.0
//
// Unless required by applicable law or agreed to in writing, software
// distributed under the License is distributed on an "AS IS" BASIS,
// WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
// See the License for the specific language governing permissions and
// limitations under the License.

package com.google.sps.servlets;

import com.google.gson.Gson;
import java.io.IOException;
import java.util.ArrayList;
import java.util.List;
import javax.servlet.annotation.WebServlet;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

/** Servlet that returns some example content. TODO: modify this file to handle comments data */
@WebServlet("/data")
public class DataServlet extends HttpServlet {

  private ArrayList<String> comments = new ArrayList<String>();

  /**
   * Gets input from the form, adds it to data structure, and redirects back to the HTML page.
   */
  @Override
  public void doPost(HttpServletRequest request, HttpServletResponse response) throws IOException {
    String text = getParameter(request, "text-input", "");
    comments.add(text);
    response.sendRedirect("/index.html");
  }

  /**
   * Converts a ArrayList of comments into a JSON string and sends JSON string as a repsonse.
   */
  @Override
  public void doGet(HttpServletRequest request, HttpServletResponse response) throws IOException {
    String json = convertToJsonUsingGson(comments);
    response.setContentType("application/json;");
    response.getWriter().println(json);
  }

  /**
   * Converts a ArrayList of comments into a JSON string using the Gson library.
   */
  private String convertToJsonUsingGson(ArrayList comments) {
    Gson gson = new Gson();
    String json = gson.toJson(comments);
    return json;
  }

  /**
   * @return the request parameter, or the default value if the parameter
   *         was not specified by the client
   */
  private String getParameter(HttpServletRequest request, String name, String defaultValue) {
    String value = request.getParameter(name);
    if (value == null) {
      return defaultValue;
    }
    return value;
  }  
}
