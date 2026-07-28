// Inicializa os componentes JavaScript do Foundation.
$(document).foundation();

import { tokenClient } from "./auth.js";

const loginButton = document.getElementById("loginButton");

/**
 * Solicita ao Google um token de acesso quando o usuário clica em entrar.
 */
function handleLoginButtonClick() {

    if (!tokenClient) {

        console.error(
            "O cliente OAuth ainda não foi inicializado."
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
