// JS DO FOUNDATION

$(document).foundation()

// API

import { tokenClient } from "./auth.js";

const loginButton = document.getElementById("loginButton");

loginButton.addEventListener("click", () => {

    if (!tokenClient) {
        console.error("O cliente OAuth ainda não foi inicializado.");
        return;
    }

    tokenClient.requestAccessToken({
        prompt: "consent"
    });

});
