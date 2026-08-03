$(document).ready(
    function () {

        const spreadsheetTabs =
            $("#switch-spreadsheet");

        const spreadsheetPanels =
            document.querySelectorAll(
                "#spreadsheets .tabs-panel"
            );


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
                                spreadsheetIframe.dataset.src;

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


        // CARREGA A PLANILHA INICIAL

        updateSpreadsheetIframes();


        // ATUALIZA DEPOIS DE CADA TROCA DE ABA

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
