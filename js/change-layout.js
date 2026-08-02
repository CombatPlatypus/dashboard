const spreadsheetLayoutButton =
    document.getElementById(
        "spreadsheetLayoutButton"
    );

const mainStructure =
    document.querySelector(
        ".main-structure"
    );

const spreadsheetLayoutStorageKey =
    "spreadsheet-layout";


// ATUALIZA O LAYOUT E O ÍCONE DO BOTÃO

function updateSpreadsheetLayout(
    horizontalLayoutEnabled
) {

    mainStructure.classList.toggle(
        "column",
        horizontalLayoutEnabled
    );

    spreadsheetLayoutButton.dataset.layout =
        horizontalLayoutEnabled
            ? "horizontal"
            : "vertical";

    spreadsheetLayoutButton.setAttribute(
        "aria-pressed",
        String(horizontalLayoutEnabled)
    );

    const buttonDescription =
        horizontalLayoutEnabled
            ? "Usar menu vertical"
            : "Usar menu horizontal";

    spreadsheetLayoutButton.setAttribute(
        "aria-label",
        buttonDescription
    );

    spreadsheetLayoutButton.title =
        buttonDescription;

}


// RECUPERA A ESCOLHA SALVA

const savedSpreadsheetLayout =
    localStorage.getItem(
        spreadsheetLayoutStorageKey
    );

if (savedSpreadsheetLayout !== null) {

    updateSpreadsheetLayout(
        savedSpreadsheetLayout === "horizontal"
    );

}


// ALTERNA E SALVA O LAYOUT

spreadsheetLayoutButton.addEventListener(
    "click",
    () => {

        const horizontalLayoutEnabled =
            !mainStructure.classList.contains(
                "column"
            );

        updateSpreadsheetLayout(
            horizontalLayoutEnabled
        );

        localStorage.setItem(
            spreadsheetLayoutStorageKey,
            horizontalLayoutEnabled
                ? "horizontal"
                : "vertical"
        );

    }
);