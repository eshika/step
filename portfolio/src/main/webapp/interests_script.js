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

let currSlideNum = 0;

/**
 * Initializes slideshow by showing the first slide.
 */
function initSlides() {
    showSlides(currSlideNum);
}

/**
 * Advances slideshow by n slides.
 * @param {number} n The number of slides to advance.
 */
function advanceSlides(n) {
  currSlideNum += n;
  showSlides();
}

/**
 * Shows the current slide and hides all others.
 */
function showSlides() {
    let slides = document.getElementsByClassName("slide");
    let captionText = document.getElementById("caption");
    let numSlides = slides.length;
    // To get the correct wraparound value
    currSlideNum = (currSlideNum % numSlides + numSlides) % numSlides;
    for (let i = 0; i < slides.length; i++) {
        slides[i].style.display = "none";
    }
    slides[currSlideNum].style.display = "block";
    captionText.innerHTML = slides[currSlideNum].getElementsByTagName("img")[0].alt;
}
