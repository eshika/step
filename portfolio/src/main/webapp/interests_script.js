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

function initSlides() {
    showSlides(currSlideNum);
}

function advanceSlides(n) {
    showSlides(currSlideNum += n);
}

function showSlides(n) {
    var slides = document.getElementsByClassName("slide");
    var captionText = document.getElementById("caption");
    if (n > slides.length - 1) {
        currSlideNum = 0;
    }
    if (n < 0) {
        currSlideNum = slides.length - 1;
    }
    for (var i = 0; i < slides.length; i++) {
        slides[i].style.display = "none";
    }
    slides[currSlideNum].style.display = "block";
    captionText.innerHTML = slides[currSlideNum].getElementsByTagName("img")[0].alt;
}
