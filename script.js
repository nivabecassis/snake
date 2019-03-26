"use strict";

function $(id) {
    return document.getElementById(id);
}

function init() {
    $("start").addEventListener("click", changePage);
}

function changePage(e) {
    if (e.target) {
        $("jeu").classList.remove("invisible");
        $("menu").classList.add("invisible");
    }
}

document.addEventListener("DOMContentLoaded", init);