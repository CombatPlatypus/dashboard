import { CONFIG } from "./config.js";
import { showUser } from "./ui.js";
import { listDriveFiles } from "./drive.js";

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


async function handleTokenResponse(response) {

    if (response.error) {

        console.error(
            "Erro durante a autorização:",
            response.error
        );

        return;

    }

    accessToken = response.access_token;

    console.log("Autorização concluída com sucesso.");

    await initializeUserSession();

}


async function initializeUserSession() {

    try {

        await loadUserInformation();

        const files = await listDriveFiles(accessToken);

        console.log("Arquivos encontrados:", files);

    }
    catch (error) {

        console.error(
            "Erro ao carregar os dados da sessão:",
            error
        );

    }

}
async function loadUserInformation() {

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

    showUser(user);

}


window.addEventListener(
    "load",
    initializeGoogleAuth
);
