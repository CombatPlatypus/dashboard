// IMPORTA AS CONFIGURAÇÕES DA APLICAÇÃO

import {
    CONFIG
} from "./config.js";


// INICIALIZA O CONTROLE DAS PLANILHAS

$(document).ready(
    async function () {

        const spreadsheetTabs =
            $("#switch-spreadsheet");

        const spreadsheetPanels =
            document.querySelectorAll(
                "#spreadsheets .tabs-panel"
            );

        const configuredSpreadsheetButtons =
            document.querySelectorAll(
                "#spreadsheets .spreadsheets-links[data-spreadsheet-key]"
            );


        // MONTA O ENDEREÇO DE UMA PLANILHA

        function createSpreadsheetUrl(
            spreadsheetId,
            gid
        ) {

            return (
                "https://docs.google.com/spreadsheets/d/" +
                encodeURIComponent(
                    spreadsheetId
                ) +
                "/edit?gid=" +
                encodeURIComponent(
                    gid
                ) +
                "#gid=" +
                encodeURIComponent(
                    gid
                )
            );
        }


        // CONSULTA A PLANILHA PÚBLICA DE CONFIGURAÇÃO

        async function getSpreadsheetConfiguration() {

            const spreadsheetId =
                encodeURIComponent(
                    CONFIG.google.linksSpreadsheetId
                );

            const spreadsheetRange =
                encodeURIComponent(
                    CONFIG.google.linksSpreadsheetRange
                );

            const requestUrl =
                `https://sheets.googleapis.com/v4/spreadsheets/${spreadsheetId}` +
                `/values/${spreadsheetRange}?majorDimension=ROWS`;

            const response =
                await fetch(
                    requestUrl,
                    {
                        cache:
                            "no-store",

                        headers: {
                            "x-goog-api-key":
                                CONFIG.google.sheetsApiKey
                        }
                    }
                );

            if (!response.ok) {

                let errorMessage =
                    `Erro ao consultar configuração: ${response.status}`;

                try {

                    const errorData =
                        await response.json();

                    errorMessage =
                        errorData.error?.message ??
                        errorMessage;

                }
                catch {

                    // MANTÉM A MENSAGEM PADRÃO

                }

                throw new Error(
                    errorMessage
                );
            }

            const responseData =
                await response.json();

            const spreadsheetConfiguration =
                new Map();

            const rows =
                responseData.values ??
                [];

            rows.forEach(
                function (row) {

                    const spreadsheetKey =
                        String(
                            row[0] ?? ""
                        ).trim();

                    const targetSpreadsheetId =
                        String(
                            row[1] ?? ""
                        ).trim();

                    const targetSpreadsheetGid =
                        String(
                            row[2] ?? "0"
                        ).trim() || "0";

                    if (
                        !spreadsheetKey ||
                        !targetSpreadsheetId
                    ) {

                        console.warn(
                            "Linha de configuração ignorada por estar incompleta:",
                            row
                        );

                        return;
                    }

                    if (
                        !/^[A-Za-z0-9_-]+$/.test(
                            targetSpreadsheetId
                        )
                    ) {

                        console.warn(
                            `ID inválido para "${spreadsheetKey}".`
                        );

                        return;
                    }

                    if (
                        !/^\d+$/.test(
                            targetSpreadsheetGid
                        )
                    ) {

                        console.warn(
                            `GID inválido para "${spreadsheetKey}".`
                        );

                        return;
                    }

                    spreadsheetConfiguration.set(
                        spreadsheetKey,
                        {
                            spreadsheetId:
                                targetSpreadsheetId,

                            gid:
                                targetSpreadsheetGid
                        }
                    );
                }
            );

            if (
                spreadsheetConfiguration.size ===
                0
            ) {

                throw new Error(
                    "A planilha de configuração não retornou nenhum link válido."
                );
            }

            return spreadsheetConfiguration;
        }


        // APLICA OS LINKS OBTIDOS AOS BOTÕES E IFRAMES

        function applySpreadsheetConfiguration(
            spreadsheetConfiguration
        ) {

            const configuredElements =
                document.querySelectorAll(
                    "#spreadsheets [data-spreadsheet-key]"
                );

            configuredElements.forEach(
                function (configuredElement) {

                    const spreadsheetKey =
                        configuredElement.dataset
                            .spreadsheetKey;

                    const spreadsheetData =
                        spreadsheetConfiguration.get(
                            spreadsheetKey
                        );

                    if (!spreadsheetData) {

                        console.error(
                            `Configuração não encontrada para "${spreadsheetKey}".`
                        );

                        if (
                            configuredElement instanceof
                            HTMLButtonElement
                        ) {

                            configuredElement.disabled =
                                true;
                        }

                        return;
                    }

                    const spreadsheetUrl =
                        createSpreadsheetUrl(
                            spreadsheetData.spreadsheetId,
                            spreadsheetData.gid
                        );

                    if (
                        configuredElement instanceof
                        HTMLIFrameElement
                    ) {

                        configuredElement.dataset.src =
                            spreadsheetUrl;
                    }

                    if (
                        configuredElement instanceof
                        HTMLButtonElement
                    ) {

                        configuredElement.dataset.url =
                            spreadsheetUrl;

                        configuredElement.disabled =
                            false;
                    }
                }
            );
        }


        // CONFIGURA OS CLIQUES DOS BOTÕES DINÂMICOS

        function initializeConfiguredSpreadsheetButtons() {

            configuredSpreadsheetButtons.forEach(
                function (spreadsheetButton) {

                    // PERMANECE DESATIVADO ATÉ A CONFIGURAÇÃO SER CARREGADA

                    spreadsheetButton.disabled =
                        true;

                    spreadsheetButton.addEventListener(
                        "click",
                        function (event) {

                            event.stopPropagation();

                            const spreadsheetUrl =
                                spreadsheetButton.dataset
                                    .url;

                            if (!spreadsheetUrl) {

                                console.error(
                                    "Link da planilha ainda não está disponível."
                                );

                                return;
                            }

                            window.open(
                                spreadsheetUrl,
                                "_blank",
                                "noopener,noreferrer"
                            );
                        }
                    );
                }
            );
        }


        // DESCARREGA UMA PLANILHA INATIVA

        function unloadSpreadsheet(
            spreadsheetPanel
        ) {

            const spreadsheetIframe =
                spreadsheetPanel.querySelector(
                    "iframe[src]"
                );

            if (!spreadsheetIframe) {

                return;
            }

            spreadsheetIframe.removeAttribute(
                "src"
            );
        }


        // CARREGA A PLANILHA ATIVA

        function loadSpreadsheet(
            spreadsheetPanel
        ) {

            const spreadsheetIframe =
                spreadsheetPanel.querySelector(
                    "iframe[data-src]"
                );

            if (
                !spreadsheetIframe ||
                spreadsheetIframe.hasAttribute(
                    "src"
                )
            ) {

                return;
            }

            requestAnimationFrame(
                function () {

                    setTimeout(
                        function () {

                            if (
                                !spreadsheetPanel.classList.contains(
                                    "is-active"
                                )
                            ) {

                                return;
                            }

                            spreadsheetIframe.src =
                                spreadsheetIframe.dataset
                                    .src;

                        },
                        80
                    );
                }
            );
        }


        // MANTÉM SOMENTE A PLANILHA ATIVA CARREGADA

        function updateSpreadsheetIframes() {

            const activeSpreadsheetPanel =
                document.querySelector(
                    "#spreadsheets .tabs-panel.is-active"
                );

            if (!activeSpreadsheetPanel) {

                return;
            }

            spreadsheetPanels.forEach(
                function (spreadsheetPanel) {

                    if (
                        spreadsheetPanel !==
                        activeSpreadsheetPanel
                    ) {

                        unloadSpreadsheet(
                            spreadsheetPanel
                        );
                    }
                }
            );

            loadSpreadsheet(
                activeSpreadsheetPanel
            );
        }


        // CONFIGURA OS DOIS BOTÕES DE TESTE

        initializeConfiguredSpreadsheetButtons();


        // ATUALIZA DEPOIS DE CADA TROCA DE ABA

        spreadsheetTabs.on(
            "change.zf.tabs",
            function () {

                requestAnimationFrame(
                    updateSpreadsheetIframes
                );
            }
        );


        // CARREGA A PLANILHA INICIAL, QUE CONTINUA FIXA

        updateSpreadsheetIframes();


        // CONSULTA E APLICA OS LINKS DINÂMICOS

        try {

            const spreadsheetConfiguration =
                await getSpreadsheetConfiguration();

            applySpreadsheetConfiguration(
                spreadsheetConfiguration
            );

            // CARREGA A PLANILHA DINÂMICA CASO O USUÁRIO JÁ TENHA ABERTO SUA ABA

            updateSpreadsheetIframes();

        }
        catch (error) {

            console.error(
                "Não foi possível carregar os links das planilhas:",
                error
            );

            configuredSpreadsheetButtons.forEach(
                function (spreadsheetButton) {

                    spreadsheetButton.disabled =
                        true;
                }
            );
        }

    }
);
