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

import com.google.appengine.api.datastore.DatastoreService;
import com.google.appengine.api.datastore.DatastoreServiceFactory;
import com.google.appengine.api.datastore.Entity;
import com.google.appengine.api.datastore.PreparedQuery;
import com.google.appengine.api.datastore.Query;
import com.google.appengine.api.datastore.Query.SortDirection;
import com.google.gson.Gson;
import java.io.IOException;
import java.util.ArrayList;
import java.util.List;
import javax.servlet.annotation.WebServlet;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

/** Servlet that handles comments data */
@WebServlet("/data")
public class DataServlet extends HttpServlet {

  public static final String COMMENT_ENTITY_LABEL = "Comment";
  public static final String TEXT_PROPERTY_LABEL = "comment";
  public static final String TIMESTAMP_PROPERTY_LABEL = "timestamp";
  public static final int DEFAULT_COMMENT_LIMIT = 1;

  private DatastoreService datastore;
  private int commentLimit;

  /**
   * Initializes datastore for comments.
   */
  @Override
  public void init() {
    datastore = DatastoreServiceFactory.getDatastoreService();  
  }

  /**
   * Gets input from the form, adds it to datastore, and redirects back to the HTML page.
   */
  @Override
  public void doPost(HttpServletRequest request, HttpServletResponse response) throws IOException {
    String text = getParameter(request, "text-input", "");
    long timestamp = System.currentTimeMillis();

    Entity commentEntity = new Entity(COMMENT_ENTITY_LABEL);
    commentEntity.setProperty(TEXT_PROPERTY_LABEL, text);
    commentEntity.setProperty(TIMESTAMP_PROPERTY_LABEL, timestamp);
    datastore.put(commentEntity);

    response.sendRedirect("/");
  }

  /**
   * Queries comments in descending order of timestamp (most recent first), 
   * converts to an ArrayList of comments, and sends JSON string of comments as a response.
   */
  @Override
  public void doGet(HttpServletRequest request, HttpServletResponse response) throws IOException {
    Query query = new Query(COMMENT_ENTITY_LABEL).addSort(TIMESTAMP_PROPERTY_LABEL, SortDirection.DESCENDING);
    PreparedQuery results = datastore.prepare(query);

    List<String> comments = new ArrayList<>();
    commentLimit = getCommentLimit(request);

    for (Entity entity : results.asIterable()) {
      String comment = (String) entity.getProperty(TEXT_PROPERTY_LABEL);
      comments.add(comment);
    }
    String json;
    if (commentLimit > comments.size()) {
      json = convertToJsonUsingGson(comments);
    } else if (commentLimit < 0) {
      commentLimit = DEFAULT_COMMENT_LIMIT;
      json = convertToJsonUsingGson(comments.subList(0, commentLimit));
    } else {
      json = convertToJsonUsingGson(comments.subList(0, commentLimit));
    }
    response.setContentType("application/json;");
    response.getWriter().println(json);
  }

  /**
   * Converts a ArrayList<String> of messages into a JSON string using the Gson library.
   */
  private String convertToJsonUsingGson(List<String> comments) {
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

  /** Returns the max number of comments to fetch and display, or 1 if the choice was invalid. */
  private int getCommentLimit(HttpServletRequest request) {
    // Get the input from the form.
    String userInputString = request.getParameter("max-comments");

    // Convert the input to an int.
    try {
      return Integer.parseInt(userInputString);
    } catch (NumberFormatException e) {
      System.err.println("Could not convert to int: " + userInputString);
      return 1;
    }
  }
}
