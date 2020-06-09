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

/**
 * Displays a fun fact about Eshika.
 */
function showFunFact() {
  const funFacts =
      ['I\'m a black belt in taekwondo!', 'I\'ve played the piano for over 10 years.', 'I like painting.'];

  // Pick a random fun fact.
  const fact = funFacts[Math.floor(Math.random() * funFacts.length)];

  // Add it to the page.
  const funFactContainer = document.getElementById('fact-container');
  funFactContainer.innerText = fact;
}

let commentLimit = 1;

/**
 * Fetches and displays comments.
 */
async function fetchMessage(commentLimit) {
  const response = await fetch('/data?max-comments=' + commentLimit);
  const message = await response.json();
  console.log(message);
  const messageContainer = document.getElementById('message-container')
  messageContainer.innerText = '';
  for (let i = 0; i < message.length; i++) {
    messageContainer.appendChild(createListElement(message[i]));
  }

}

/**
 * Refreshes comments.
 */
async function refreshMessage() {
  commentLimit = document.getElementById("limit").value;
  fetchMessage(commentLimit);
}

/**
 * Creates an <li> element containing text.
 */
function createListElement(text) {
  const liElement = document.createElement('li');
  liElement.innerText = text;
  return liElement;
}

/**
 * Saves the comment limit as a cookie.
 */
function setCookie() {
  let d = new Date();
  // Cookie expires after 365 days
  d.setTime(d.getTime() + (365 * 24 * 60 * 60 * 1000));
  let expires = "expires="+d.toUTCString();
  let cvalue = document.getElementById("limit").value;
  document.cookie = "limit=" + cvalue + ";" + expires + ";path=/";
}

/**
 * Obtains the cookie value.
 */
function getCookie(cookieLabel) {
  let name = cookieLabel + "=";
  let ca = document.cookie.split(';');
  for (let i = 0; i < ca.length; i++) {
    let c = ca[i];
    while (c.charAt(0) == ' ') {
      c = c.substring(1);
    }
    if (c.indexOf(name) == 0) {
      return c.substring(name.length, c.length);
    }
  }
  return "";
}

/**
 * Fetches comments based on the value stored in the cookie.
 */
function checkCookie() {
  let limitCookie = getCookie("limit");
  if (limitCookie != "") {
    document.getElementById("limit").value = limitCookie;
    fetchMessage(limitCookie);
  } else {
    document.getElementById("limit").value = 1;
    fetchMessage(1);
  }
}
