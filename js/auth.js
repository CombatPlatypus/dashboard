import { CONFIG } from "./config.js";

export let tokenClient = null;

function initializeGoogleAuth() {

    if (typeof google === "undefined") {
        console.error("A biblioteca Google Identity Services ainda não foi carregada.");
        return;
    }

    tokenClient = google.accounts.oauth2.initTokenClient({

        client_id: CONFIG.google.clientId,

        scope: CONFIG.google.scopes.join(" "),

        callback: handleTokenResponse

    });

    console.log("Cliente OAuth inicializado.");

}

function handleTokenResponse(response) {

    if (response.error) {
        console.error("Erro durante a autorização:", response);
        return;
    }

    console.log("Resposta do Google:", response);
    console.log("Access Token:", response.access_token);

}

window.addEventListener("load", initializeGoogleAuth);