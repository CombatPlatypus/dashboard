$(document).ready(
    function () {

        const spreadsheetTabs =
            $("#switch-spreadsheet");

        const spreadsheetPanels =
            document.querySelectorAll(
                "#spreadsheets .tabs-panel"
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
                    "#spreadsheets .tabs-panel.is-active"
                );

            if (!activeSpreadsheetPanel) {

                console.error(
                    "Nenhum painel de planilha ativo foi encontrado."
                );

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

        // GARANTE O ESTADO CORRETO AO ABRIR A PÁGINA

        updateSpreadsheetIframes();

        // EXECUTA DEPOIS DE CADA TROCA DE ABA

        spreadsheetTabs.on(
            "change.zf.tabs",
            function () {

                requestAnimationFrame(
                    updateSpreadsheetIframes
                );

            }
        );

    }
);
