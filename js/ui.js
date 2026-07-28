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
    handleFolderSelection) {

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
 * Altera o modo de exibição
 * dos arquivos do Google Drive.
 */
export function setDriveViewMode(
    viewMode
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

    if (
        viewMode !== "list" &&
        viewMode !== "grid"
    ) {

        console.error(
            "Modo de exibição inválido:",
            viewMode
        );

        return;

    }

    driveFilesContainer.classList.remove(
        "drive-list-view",
        "drive-grid-view"
    );

    driveFilesContainer.classList.add(
        `drive-${viewMode}-view`
    );

    localStorage.setItem(
        "driveViewMode",
        viewMode
    );

}

/**
 * Retorna um ícone local conforme
 * o tipo do item do Google Drive.
 */
/**
 * Retorna um ícone local conforme
 * o tipo do item do Google Drive.
 */

function getDriveItemFallbackIcon(
    driveItem
) {

    if (
        driveItem.mimeType ===
        FOLDER_MIME_TYPE
    ) {

        return "images/file-type/folder-icon.svg";

    }

    if (
        driveItem.mimeType?.startsWith(
            "image/"
        )
    ) {

        return "images/file-type/image-icon.svg";

    }

    if (
        driveItem.mimeType ===
        "application/pdf"
    ) {

        return "images/file-type/pdf-icon.svg";

    }

    return "images/file-type/file-icon.svg";

}


/**
 * Cria o botão visual usado para
 * representar um item do Drive.
 */
function createDriveItemButton(
    driveItem
) {


    console.log({
        name:
            driveItem.name,

        mimeType:
            driveItem.mimeType,

        hasThumbnail:
            driveItem.hasThumbnail,

        thumbnailLink:
            driveItem.thumbnailLink,

        canDownload:
            driveItem.capabilities?.canDownload,

        webContentLink:
            driveItem.webContentLink,

        iconLink:
            driveItem.iconLink
    });


    /*
     * Botão principal que representa
     * o arquivo ou a pasta.
     */
    const driveItemButton =
        document.createElement(
            "button"
        );

    driveItemButton.type =
        "button";

    driveItemButton.classList.add(
        "drive-file"
    );


    const isFolder =
        driveItem.mimeType ===
        FOLDER_MIME_TYPE;

    driveItemButton.classList.toggle(
        "drive-folder",
        isFolder
    );

    driveItemButton.classList.toggle(
        "drive-document",
        !isFolder
    );


    /*
     * Escolhe a miniatura como imagem principal.
     *
     * Caso o arquivo não tenha miniatura,
     * utiliza o ícone padrão retornado pelo Drive.
     */
    const fallbackImage =
        getDriveItemFallbackIcon(
            driveItem
        );

    const previewImage =
        driveItem.thumbnailLink ??
        fallbackImage;


    /*
     * Cria a imagem do arquivo.
     */
    const imageElement =
        document.createElement(
            "img"
        );

    imageElement.src =
        previewImage;

    imageElement.alt = "";

    imageElement.classList.add(
        "drive-file-icon"
    );


    /*
     * Se a miniatura não puder ser carregada,
     * tenta usar o ícone padrão do Drive.
     */
    imageElement.addEventListener(
        "error",
        () => {

            imageElement.src =
                fallbackImage;

        },
        {
            once: true
        }
    );


    /*
     * Cria o container que agrupa
     * o nome e a data do arquivo.
     */
    const driveItemInformation =
        document.createElement(
            "div"
        );

    driveItemInformation.classList.add(
        "drive-file-info"
    );


    /*
     * Cria o nome do arquivo.
     */
    const driveItemName =
        document.createElement(
            "strong"
        );

    driveItemName.classList.add(
        "drive-file-name"
    );

    driveItemName.textContent =
        driveItem.name ??
        "Arquivo sem nome";


    /*
     * Cria a informação de modificação.
     */
    const driveItemDate =
        document.createElement(
            "span"
        );

    driveItemDate.classList.add(
        "drive-file-date"
    );

    driveItemDate.textContent =
        `Modificado em: ${
            formatDate(
                driveItem.modifiedTime
            )
        }`;


    /*
     * Insere o nome e a data
     * dentro do container de informações.
     */
    driveItemInformation.append(
        driveItemName,
        driveItemDate
    );


    /*
     * Insere a imagem e as informações
     * dentro do botão principal.
     */
    driveItemButton.append(
        imageElement,
        driveItemInformation
    );


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
