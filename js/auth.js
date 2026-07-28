import { CONFIG } from "./config.js";

import {
    showDriveBreadcrumb,
    showDriveError,
    showDriveFiles,
    showDriveLoading,
    showUser
} from "./ui.js";

import {
    getDriveFolderInformation,
    listDriveFiles
} from "./drive.js";


export let tokenClient = null;
export let accessToken = null;


// Cada posição armazena o ID e o nome de uma pasta.
const folderNavigationHistory = [];


/**
 * Abre uma pasta do Google Drive, carrega seus arquivos
 * e atualiza o histórico de navegação.
 */
export async function openDriveFolder(
    folderId,
    addToHistory = true) {

    showDriveLoading();

    try {

        const currentFolder =
            folderNavigationHistory.at(-1);

        let newFolderInformation = null;

        /*
         * Consulta o nome da pasta apenas quando ela
         * representa um novo nível da navegação.
         */
        if (
            addToHistory &&
            currentFolder?.id !== folderId
        ) {

            newFolderInformation =
                await getDriveFolderInformation(
                    accessToken,
                    folderId
                );

        }

        const driveItems =
            await listDriveFiles(
                accessToken,
                folderId
            );

        /*
         * A pasta só entra no histórico depois que
         * sua consulta é concluída com sucesso.
         */
        if (newFolderInformation) {

            folderNavigationHistory.push({

                id:
                    newFolderInformation.id,

                name:
                    newFolderInformation.name

            });

        }

        showDriveFiles(
            driveItems,
            openDriveFolder
        );

        showDriveBreadcrumb(
            folderNavigationHistory,
            handleBreadcrumbNavigation
        );

        updateBackButtonVisibility();

    }
    catch (error) {

        console.error(
            "Não foi possível abrir a pasta:",
            error
        );

        showDriveError(
            error.message ??
            "Não foi possível carregar os arquivos."
        );

    }

}

export function setDriveViewMode(
    viewMode
) {

    const driveFilesContainer =
        document.getElementById(
            "driveFiles"
        );

    if (!driveFilesContainer) {
        return;
    }

    driveFilesContainer.classList.remove(
        "drive-list-view",
        "drive-grid-view"
    );

    driveFilesContainer.classList.add(
        `drive-${viewMode}-view`
    );

}

setDriveViewMode("grid");


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
 * e registra os eventos da navegação.
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
 * Retorna para a pasta imediatamente anterior.
 */
async function handleBackButtonClick() {

    if (
        folderNavigationHistory.length <= 1
    ) {

        return;

    }

    folderNavigationHistory.pop();

    const previousFolder =
        folderNavigationHistory.at(-1);

    await openDriveFolder(
        previousFolder.id,
        false
    );

}


/**
 * Abre uma pasta selecionada no breadcrumb
 * e remove do histórico os níveis posteriores.
 */
async function handleBreadcrumbNavigation(
    folderIndex
) {

    const selectedFolder =
        folderNavigationHistory[
            folderIndex
        ];

    if (!selectedFolder) {

        console.error(
            "Pasta do breadcrumb não encontrada."
        );

        return;

    }

    /*
     * Remove todas as pastas que estavam
     * depois da pasta selecionada.
     */
    folderNavigationHistory.splice(
        folderIndex + 1
    );

    await openDriveFolder(
        selectedFolder.id,
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
 * Carrega o usuário e abre
 * a pasta inicial configurada.
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

    const response =
        await fetch(
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

// Inicializa o OAuth depois que a página estiver carregada.
window.addEventListener(
    "load",
    initializeGoogleAuth
);
