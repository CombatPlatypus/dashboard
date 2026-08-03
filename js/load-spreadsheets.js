
$(document).ready(
    function () {

        const spreadsheetPanels =
            document.querySelectorAll(
                ".spreadsheets-view .tabs-panel"
            );


        // DESCARREGA UMA PLANILHA QUE NÃO ESTÁ MAIS ATIVA

        function unloadSpreadsheet(
            spreadsheetPanel
        ) {

            if (
                spreadsheetPanel.classList.contains(
                    "keep-loaded"
                )
            ) {

                return;

            }

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


        // CARREGA A PLANILHA QUE ACABOU DE SER ATIVADA

        function loadSpreadsheet(
            spreadsheetPanel
        ) {

            if (
                spreadsheetPanel.classList.contains(
                    "keep-loaded"
                )
            ) {

                return;

            }

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


            /*
             * ESPERA O FOUNDATION MOSTRAR O PAINEL
             * ANTES DE INICIAR O GOOGLE SHEETS
             */

            requestAnimationFrame(
                function () {

                    setTimeout(
                        function () {

                            /*
                             * EVITA CARREGAR A PLANILHA CASO
                             * O USUÁRIO TENHA TROCADO DE ABA
                             * MUITO RAPIDAMENTE
                             */

                            if (
                                !spreadsheetPanel.classList.contains(
                                    "is-active"
                                )
                            ) {

                                return;

                            }

                            spreadsheetIframe.src =
                                spreadsheetIframe.dataset.src;

                        },
                        80
                    );

                }
            );

        }


        // SINCRONIZA OS IFRAMES COM A ABA ATIVA

        function updateSpreadsheetIframes() {

            const activeSpreadsheetPanel =
                document.querySelector(
                    ".spreadsheets-view .tabs-panel.is-active"
                );

            if (!activeSpreadsheetPanel) {

                return;

            }


            // DESCARREGA TODAS AS PLANILHAS INATIVAS

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


            // CARREGA SOMENTE A PLANILHA ATIVA

            loadSpreadsheet(
                activeSpreadsheetPanel
            );

        }


        // GARANTE O ESTADO CORRETO AO ABRIR A PÁGINA

        updateSpreadsheetIframes();


        // EXECUTA DEPOIS DE CADA TROCA DE ABA

        $("#switch").on(
            "change.zf.tabs",
            function () {

                requestAnimationFrame(
                    updateSpreadsheetIframes
                );

            }
        );

    }
);