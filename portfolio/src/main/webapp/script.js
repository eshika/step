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

/**
 * Fetches and displays thank you message.
 */
async function fetchMessage() {
  const response = await fetch('/data');
  const message = await response.json();
  const messageContainer = document.getElementById('message-container')
  messageContainer.innerText = '';
  for (let i = 0; i < message.length; i++) {
    messageContainer.appendChild(createListElement(message[i]));
  }

}


/** Creates an <li> element containing text. */
function createListElement(text) {
  const liElement = document.createElement('li');
  liElement.innerText = text;
  return liElement;
}