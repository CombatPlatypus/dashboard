const FOLDER_MIME_TYPE =
    "application/vnd.google-apps.folder";


/**
 * Preenche a área de usuário e ajusta
 * a interface depois do login.
 */
export function showUser(user) {

    const loginButton =
        document.getElementById(
            "loginButton"
        );

    const userInfoContainer =
        document.getElementById(
            "userInfo"
        );

    const userPhoto =
        document.getElementById(
            "userPhoto"
        );

    const userName =
        document.getElementById(
            "userName"
        );

    const userEmail =
        document.getElementById(
            "userEmail"
        );

    if (
        !loginButton ||
        !userInfoContainer ||
        !userPhoto ||
        !userName ||
        !userEmail
    ) {

        console.error(
            "Elementos da área do usuário não foram encontrados."
        );

        return;

    }

    userPhoto.src =
        user.picture ?? "";

    userPhoto.alt =
        user.name
            ? `Foto de ${user.name}`
            : "Foto do usuário";

    userName.textContent =
        user.name ?? "Usuário";

    userEmail.textContent =
        user.email ?? "";

    loginButton.hidden = true;

    userInfoContainer.hidden = false;

}

/**
 * Renderiza o caminho atual de navegação
 * e permite voltar diretamente para uma pasta anterior.
 */
export function showDriveBreadcrumb(
    folderHistory,
    handleFolderSelection
) {

    const breadcrumbContainer =
        document.getElementById(
            "driveBreadcrumb"
        );

    if (!breadcrumbContainer) {

        console.error(
            "Área #driveBreadcrumb não encontrada."
        );

        return;

    }

    breadcrumbContainer.innerHTML = "";

    folderHistory.forEach(
        (folder, folderIndex) => {

            const isCurrentFolder =
                folderIndex ===
                folderHistory.length - 1;

            if (folderIndex > 0) {

                const separator =
                    document.createElement(
                        "span"
                    );

                separator.classList.add(
                    "drive-breadcrumb-separator"
                );

                separator.textContent = ">";

                separator.setAttribute(
                    "aria-hidden",
                    "true"
                );

                breadcrumbContainer.appendChild(
                    separator
                );

            }

            if (isCurrentFolder) {

                const currentFolderElement =
                    document.createElement(
                        "span"
                    );

                currentFolderElement.classList.add(
                    "drive-breadcrumb-current"
                );

                currentFolderElement.textContent =
                    folder.name;

                currentFolderElement.setAttribute(
                    "aria-current",
                    "page"
                );

                breadcrumbContainer.appendChild(
                    currentFolderElement
                );

                return;

            }

            const folderButton =
                document.createElement(
                    "button"
                );

            folderButton.type = "button";

            folderButton.classList.add(
                "drive-breadcrumb-button"
            );

            folderButton.textContent =
                folder.name;

            folderButton.addEventListener(
                "click",
                () => {

                    handleFolderSelection(
                        folderIndex
                    );

                }
            );

            breadcrumbContainer.appendChild(
                folderButton
            );

        }
    );

}

/**
 * Exibe o indicador de carregamento
 * enquanto uma pasta está sendo consultada.
 */
export function showDriveLoading() {

    const driveFilesContainer =
        document.getElementById(
            "driveFiles"
        );

    if (!driveFilesContainer) {

        console.error(
            "Área #driveFiles não encontrada."
        );

        return;

    }

    driveFilesContainer.setAttribute(
        "aria-busy",
        "true"
    );

    driveFilesContainer.innerHTML = `

        <div class="drive-loading">

            <span
                class="drive-loading-spinner"
                aria-hidden="true"
            ></span>

            <span>
                Carregando arquivos...
            </span>

        </div>

    `;

}


/**
 * Exibe uma mensagem quando não é possível
 * carregar uma pasta do Google Drive.
 */
export function showDriveError(
    errorMessage
) {

    const driveFilesContainer =
        document.getElementById(
            "driveFiles"
        );

    if (!driveFilesContainer) {

        console.error(
            "Área #driveFiles não encontrada."
        );

        return;

    }

    driveFilesContainer.setAttribute(
        "aria-busy",
        "false"
    );

    driveFilesContainer.innerHTML = "";

    const errorElement =
        document.createElement(
            "p"
        );

    errorElement.classList.add(
        "drive-error"
    );

    errorElement.textContent =
        errorMessage ??
        "Não foi possível carregar os arquivos.";

    driveFilesContainer.appendChild(
        errorElement
    );

}


/**
 * Renderiza os arquivos e as pastas
 * retornados pela API do Google Drive.
 */
export function showDriveFiles(
    driveItems,
    handleFolderOpen
) {

    const driveFilesContainer =
        document.getElementById(
            "driveFiles"
        );

    if (!driveFilesContainer) {

        console.error(
            "Área #driveFiles não encontrada."
        );

        return;

    }

    driveFilesContainer.setAttribute(
    "aria-busy",
    "false"
);

    driveFilesContainer.innerHTML = "";

    if (driveItems.length === 0) {

        driveFilesContainer.innerHTML =
            "<p>Esta pasta está vazia.</p>";

        return;

    }

    driveItems.forEach(
        (driveItem) => {

            const driveItemButton =
                createDriveItemButton(
                    driveItem
                );

            if (
                driveItem.mimeType ===
                FOLDER_MIME_TYPE
            ) {

                driveItemButton.addEventListener(
                    "click",
                    () => {

                        handleFolderOpen(
                            driveItem.id
                        );

                    }
                );

            }
            else {

                driveItemButton.addEventListener(
                    "click",
                    () => {

                        openDriveFile(
                            driveItem.webViewLink
                        );

                    }
                );

            }

            driveFilesContainer.appendChild(
                driveItemButton
            );

        }
    );

}


/**
 * Cria o botão visual usado para
 * representar um item do Drive.
 */
function createDriveItemButton(
    driveItem
) {

    const driveItemButton =
        document.createElement(
            "button"
        );

    driveItemButton.type = "button";

    driveItemButton.classList.add(
        "drive-file"
    );

    driveItemButton.innerHTML = `

        <img
            src="${escapeHTML(
                driveItem.iconLink ?? ""
            )}"
            alt=""
            class="drive-file-icon"
        >

        <div class="drive-file-info">

            <strong class="drive-file-name">

                ${escapeHTML(
                    driveItem.name ??
                    "Arquivo sem nome"
                )}

            </strong>

            <span class="drive-file-date">

                Modificado em:
                ${formatDate(
                    driveItem.modifiedTime
                )}

            </span>

        </div>

    `;

    return driveItemButton;

}


/**
 * Abre um arquivo do Drive
 * em uma nova aba.
 */
function openDriveFile(fileUrl) {

    if (!fileUrl) {

        console.error(
            "Link do arquivo não informado."
        );

        return;

    }

    window.open(
        fileUrl,
        "_blank",
        "noopener,noreferrer"
    );

}


/**
 * Converte uma data ISO
 * para o formato brasileiro.
 */
function formatDate(dateValue) {

    if (!dateValue) {

        return "Data não disponível";

    }

    const date =
        new Date(dateValue);

    if (
        Number.isNaN(
            date.getTime()
        )
    ) {

        return "Data não disponível";

    }

    return new Intl.DateTimeFormat(
        "pt-BR",
        {
            dateStyle: "short",
            timeStyle: "short"
        }
    ).format(date);

}


/**
 * Escapa um texto antes de inseri-lo
 * dentro de uma string HTML.
 */
function escapeHTML(value) {

    const element =
        document.createElement(
            "div"
        );

    element.textContent =
        String(value);

    return element.innerHTML;

}
