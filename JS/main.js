/**
 * Animazioni main
 */

"use strict";

var slideIndex = 1;

showImage(slideIndex);
automaticSlide();

function slide(index) {
    showImage(slideIndex += index);
}

function automaticSlide() {
    setInterval(function() {
        slide(1);
    }, 5000);
}

function showImage(index) {
    var images = document.getElementsByClassName("sliding-imgs");

    if(index > images.length) {
        slideIndex = 1;
    }
    if(index < 1) {
        slideIndex = images.length;
    }

    for(let i = 0; i < images.length; i++) {
        images[i].style.display = "none";  
    }
    images[slideIndex-1].style.display = "block";  
}