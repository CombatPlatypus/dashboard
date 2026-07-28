import { CONFIG } from "./config.js";

export let tokenClient = null;
export let accessToken = null;

function initializeGoogleAuth() {

    if (typeof google === "undefined") {
        console.error(
            "A biblioteca Google Identity Services não foi carregada."
        );

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
        console.error("Erro durante a autorização:", response.error);
        return;
    }

    accessToken = response.access_token;

    console.log("Autorização concluída com sucesso.");

    loadUserInformation();

}

async function loadUserInformation() {

    try {

        const response = await fetch(
            "https://www.googleapis.com/oauth2/v3/userinfo",
            {
                headers: {
                    Authorization: `Bearer ${accessToken}`
                }
            }
        );

        if (!response.ok) {
            throw new Error(
                `Erro ao consultar usuário: ${response.status}`
            );
        }

        const user = await response.json();

        console.log("Usuário autenticado:", {
            name: user.name,
            email: user.email
        });

    }
    catch (error) {

        console.error(
            "Não foi possível carregar os dados do usuário:",
            error
        );

    }

}

window.addEventListener("load", initializeGoogleAuth);
