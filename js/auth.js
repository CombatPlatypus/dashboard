// IMPORTA AS CONFIGURAÇÕES DA APLICAÇÃO

import {
    CONFIG
} from "./config.js";

// IMPORTA AS FUNÇÕES RESPONSÁVEIS PELA INTERFACE

import {
    showDriveBreadcrumb,
    showDriveError,
    showDriveFiles,
    showDriveLoading,
    showUser
} from "./ui.js";

// IMPORTA AS FUNÇÕES RESPONSÁVEIS PELA API DO GOOGLE DRIVE

import {
    getDriveFolderInformation,
    listDriveFiles
} from "./drive.js";

// ARMAZENA O CLIENTE DE AUTENTICAÇÃO E O TOKEN DE ACESSO

export let tokenClient =
    null;

export let accessToken =
    null;

// ARMAZENA O ID E O NOME DAS PASTAS PRESENTES NO HISTÓRICO DE NAVEGAÇÃO

const folderNavigationHistory =
    [];

// ABRE UMA PASTA DO GOOGLE DRIVE E ATUALIZA O HISTÓRICO DE NAVEGAÇÃO

export async function openDriveFolder(
    folderId,
    addToHistory = true
) {

    showDriveLoading();

    try {

        const currentFolder =
            folderNavigationHistory.at(
                -1
            );

        let newFolderInformation =
            null;


        // CONSULTA AS INFORMAÇÕES SOMENTE QUANDO A PASTA REPRESENTA UM NOVO NÍVEL

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

        // CONSULTA OS ARQUIVOS PRESENTES NA PASTA

        const driveItems =
            await listDriveFiles(
                accessToken,
                folderId
            );

        // ADICIONA A PASTA AO HISTÓRICO APÓS A CONSULTA SER CONCLUÍDA

        if (newFolderInformation) {

            folderNavigationHistory.push({
                id:
                    newFolderInformation.id,

                name:
                    newFolderInformation.name
            });
        }

        // EXIBE OS ARQUIVOS ENCONTRADOS NA PASTA

        showDriveFiles(
            driveItems,
            openDriveFolder
        );

        // ATUALIZA O CAMINHO DE NAVEGAÇÃO

        showDriveBreadcrumb(
            folderNavigationHistory,
            handleBreadcrumbNavigation
        );

        // ATUALIZA A VISIBILIDADE DO BOTÃO DE VOLTAR

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

// MOSTRA OU OCULTA O BOTÃO DE VOLTAR CONFORME A PROFUNDIDADE DA NAVEGAÇÃO

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

// INICIALIZA O CLIENTE OAUTH DO GOOGLE E OS EVENTOS DE NAVEGAÇÃO

function initializeGoogleAuth() {

    if (
        typeof google ===
        "undefined"
    ) {

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
                CONFIG.google.scopes.join(
                    " "
                ),

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

// RETORNA PARA A PASTA IMEDIATAMENTE ANTERIOR

async function handleBackButtonClick() {

    if (
        folderNavigationHistory.length <= 1
    ) {

        return;
    }

    folderNavigationHistory.pop();

    const previousFolder =
        folderNavigationHistory.at(
            -1
        );

    await openDriveFolder(
        previousFolder.id,
        false
    );
}

// ABRE UMA PASTA DO BREADCRUMB E REMOVE OS NÍVEIS POSTERIORES DO HISTÓRICO

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

    // REMOVE AS PASTAS LOCALIZADAS DEPOIS DA PASTA SELECIONADA

    folderNavigationHistory.splice(
        folderIndex + 1
    );

    await openDriveFolder(
        selectedFolder.id,
        false
    );
}

// PROCESSA A RESPOSTA DO GOOGLE APÓS A SOLICITAÇÃO DE AUTORIZAÇÃO

async function handleTokenResponse(
    response
) {

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

// CARREGA O USUÁRIO AUTENTICADO E ABRE A PASTA INICIAL

async function initializeUserSession() {

    try {

        folderNavigationHistory.length =
            0;

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

        showDriveError(
            error.message ??
            "Não foi possível iniciar a sessão."
        );
    }
}

// CONSULTA AS INFORMAÇÕES BÁSICAS DO USUÁRIO AUTENTICADO

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

    showUser(
        user
    );
}

// INICIALIZA A AUTENTICAÇÃO DEPOIS QUE A PÁGINA FOR CARREGADA

window.addEventListener(
    "load",
    initializeGoogleAuth
);
