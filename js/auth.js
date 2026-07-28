import { CONFIG } from "./config.js";

import {
    showDriveFiles,
    showUser
} from "./ui.js";

import { listDriveFiles } from "./drive.js";


export let tokenClient = null;
export let accessToken = null;


// Armazena o caminho percorrido entre as pastas.
const folderNavigationHistory = [];


/**
 * Abre uma pasta do Google Drive, renderiza seus itens
 * e atualiza o histórico usado pelo botão de voltar.
 */
export async function openDriveFolder(
    folderId,
    addToHistory = true
) {

    try {

        if (addToHistory) {

            const currentFolderId =
                folderNavigationHistory.at(-1);

            if (currentFolderId !== folderId) {

                folderNavigationHistory.push(
                    folderId
                );

            }

        }

        const driveItems =
            await listDriveFiles(
                accessToken,
                folderId
            );

        showDriveFiles(
            driveItems,
            openDriveFolder
        );

        updateBackButtonVisibility();

    }
    catch (error) {

        console.error(
            "Não foi possível abrir a pasta:",
            error
        );

    }

}


/**
 * Mostra ou oculta o botão de voltar conforme
 * a profundidade atual da navegação.
 */
function updateBackButtonVisibility() {

    const backButton =
        document.getElementById(
            "driveBackButton"
        );

    if (!backButton) {

        console.error(
            "Botão de voltar não encontrado."
        );

        return;

    }

    backButton.hidden =
        folderNavigationHistory.length <= 1;

}


/**
 * Inicializa o cliente OAuth do Google
 * e configura os eventos de navegação.
 */
function initializeGoogleAuth() {

    if (typeof google === "undefined") {

        console.error(
            "A biblioteca Google Identity Services não foi carregada."
        );

        return;

    }

    tokenClient =
        google.accounts.oauth2.initTokenClient({

            client_id:
                CONFIG.google.clientId,

            scope:
                CONFIG.google.scopes.join(" "),

            callback:
                handleTokenResponse

        });

    const backButton =
        document.getElementById(
            "driveBackButton"
        );

    if (!backButton) {

        console.error(
            "Botão de voltar não encontrado."
        );

        return;

    }

    backButton.addEventListener(
        "click",
        handleBackButtonClick
    );

    updateBackButtonVisibility();

}


/**
 * Retorna para a pasta anterior registrada
 * no histórico de navegação.
 */
async function handleBackButtonClick() {

    if (
        folderNavigationHistory.length <= 1
    ) {

        return;

    }

    folderNavigationHistory.pop();

    const previousFolderId =
        folderNavigationHistory.at(-1);

    await openDriveFolder(
        previousFolderId,
        false
    );

}


/**
 * Processa a resposta do Google após
 * a solicitação de autorização.
 */
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

    await initializeUserSession();

}


/**
 * Carrega os dados do usuário
 * e abre a pasta inicial configurada.
 */
async function initializeUserSession() {

    try {

        folderNavigationHistory.length = 0;

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


/**
 * Consulta as informações básicas
 * do usuário autenticado.
 */
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


// Aguarda o carregamento completo da página
// antes de inicializar o OAuth.
window.addEventListener(
    "load",
    initializeGoogleAuth
);
