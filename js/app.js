// Inicializa os componentes JavaScript do Foundation.
$(document).foundation();

import { tokenClient } from "./auth.js";

import {
    setDriveViewMode
} from "./ui.js";


const loginButton =
    document.getElementById(
        "loginButton"
    );

const driveListViewButton =
    document.getElementById(
        "driveListViewButton"
    );

const driveGridViewButton =
    document.getElementById(
        "driveGridViewButton"
    );


/**
 * Solicita ao Google um token de acesso
 * quando o usuário clica em entrar.
 */
function handleLoginButtonClick() {

    if (!tokenClient) {

        console.error(
            "O cliente de autenticação ainda não foi inicializado."
        );

        return;

    }

    tokenClient.requestAccessToken({
        prompt: "consent"
    });

}


if (!loginButton) {

    console.error(
        "Botão de login não encontrado."
    );

}
else {

    loginButton.addEventListener(
        "click",
        handleLoginButtonClick
    );

}


if (!driveListViewButton) {

    console.error(
        "Botão de visualização em lista não encontrado."
    );

}
else {

    driveListViewButton.addEventListener(
        "click",
        () => {

            setDriveViewMode(
                "list"
            );

        }
    );

}


if (!driveGridViewButton) {

    console.error(
        "Botão de visualização em grade não encontrado."
    );

}
else {

    driveGridViewButton.addEventListener(
        "click",
        () => {

            setDriveViewMode(
                "grid"
            );

        }
    );

}


/*
 * Recupera a última visualização escolhida.
 * Caso não exista preferência, utiliza lista.
 */
const savedDriveViewMode =
    localStorage.getItem(
        "driveViewMode"
    ) ?? "list";

setDriveViewMode(
    savedDriveViewMode
);
