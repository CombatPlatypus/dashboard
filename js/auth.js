import { CONFIG } from "./config.js";

import {
    showUser,
    showDriveFiles
} from "./ui.js";

import { listDriveFiles } from "./drive.js";


export let tokenClient = null;
export let accessToken = null;


const folderHistory = [];


export async function openDriveFolder(
    folderId,
    addToHistory = true
) {

    try {

        if (addToHistory) {

            const currentFolder =
                folderHistory.at(-1);

            if (currentFolder !== folderId) {
                folderHistory.push(folderId);
            }

        }

        const files = await listDriveFiles(
            accessToken,
            folderId
        );

        showDriveFiles(
            files,
            openDriveFolder
        );

        updateBackButton();

    }
    catch (error) {

        console.error(
            "Não foi possível abrir a pasta:",
            error
        );

    }

}


function updateBackButton() {

    const backButton =
        document.getElementById("driveBackButton");

    if (!backButton) {

        console.error(
            "Botão de voltar não encontrado."
        );

        return;

    }

    backButton.hidden =
        folderHistory.length <= 1;

}


function initializeGoogleAuth() {

    if (typeof google === "undefined") {

        console.error(
            "A biblioteca Google Identity Services não foi carregada."
        );

        return;

    }

    tokenClient =
        google.accounts.oauth2.initTokenClient({

            client_id: CONFIG.google.clientId,

            scope:
                CONFIG.google.scopes.join(" "),

            callback: handleTokenResponse

        });

    const backButton =
        document.getElementById("driveBackButton");

    if (!backButton) {

        console.error(
            "Botão de voltar não encontrado."
        );

        return;

    }

    backButton.addEventListener(
        "click",
        handleBackButton
    );

    updateBackButton();

    console.log(
        "Cliente OAuth inicializado."
    );

}


async function handleBackButton() {

    if (folderHistory.length <= 1) {
        return;
    }

    folderHistory.pop();

    const previousFolder =
        folderHistory.at(-1);

    await openDriveFolder(
        previousFolder,
        false
    );

}


async function handleTokenResponse(response) {

    if (response.error) {

        console.error(
            "Erro durante a autorização:",
            response.error
        );

        return;

    }

    accessToken =
        response.access_token;

    console.log(
        "Autorização concluída com sucesso."
    );

    await initializeUserSession();

}


async function initializeUserSession() {

    try {

        folderHistory.length = 0;

        await loadUserInformation();

        await openDriveFolder(
            CONFIG.google.folderId
        );

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
                Authorization:
                    `Bearer ${accessToken}`
            }
        }
    );

    if (!response.ok) {

        throw new Error(
            `Erro ao consultar usuário: ${response.status}`
        );

    }

    const user =
        await response.json();

    showUser(user);

}


window.addEventListener(
    "load",
    initializeGoogleAuth
);
