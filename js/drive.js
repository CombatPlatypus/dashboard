// DEFINE O ENDPOINT PRINCIPAL DA API DO GOOGLE DRIVE

const DRIVE_FILES_ENDPOINT =
    "https://www.googleapis.com/drive/v3/files";

// CONSULTA AS INFORMAÇÕES BÁSICAS DE UMA PASTA

export async function getDriveFolderInformation(
    accessToken,
    folderId
) {

    if (!accessToken) {

        throw new Error(
            "Token de acesso não informado."
        );
    }

    if (!folderId) {

        throw new Error(
            "ID da pasta não informado."
        );
    }

    // DEFINE OS PARÂMETROS DA CONSULTA

    const queryParameters =
        new URLSearchParams({

            fields:
                "id,name,mimeType"
        });

    // MONTA A URL DA REQUISIÇÃO

    const requestUrl =
        `${DRIVE_FILES_ENDPOINT}/${encodeURIComponent(folderId)}` +
        `?${queryParameters.toString()}`;

    // REALIZA A REQUISIÇÃO À API

    const response =
        await fetch(
            requestUrl,
            {
                headers: {
                    Authorization:
                        `Bearer ${accessToken}`
                }
            }
        );

    // TRATA POSSÍVEIS ERROS DA REQUISIÇÃO

    if (!response.ok) {

        const errorMessage =
            await getDriveErrorMessage(
                response
            );

        throw new Error(
            errorMessage
        );
    }

    return response.json();
}

// LISTA TODOS OS ARQUIVOS E PASTAS DE UM DIRETÓRIO

export async function listDriveFiles(
    accessToken,
    folderId
) {

    if (!accessToken) {

        throw new Error(
            "Token de acesso não informado."
        );
    }

    if (!folderId) {

        throw new Error(
            "ID da pasta não informado."
        );
    }

    const driveItems = [];

    let nextPageToken = null;

    do {

        // DEFINE OS PARÂMETROS DA CONSULTA

        const queryParameters =
            new URLSearchParams({

                pageSize:
                    "100",

                fields: [

                    "nextPageToken,",

                    "files(",

                        "id,",
                        "name,",
                        "mimeType,",
                        "webViewLink,",
                        "webContentLink,",
                        "iconLink,",
                        "hasThumbnail,",
                        "thumbnailLink,",
                        "capabilities(canDownload),",
                        "modifiedTime",

                    ")"

                ].join(""),

                orderBy:
                    "folder,name",

                q:
                    `'${folderId}' in parents and trashed = false`

            });

        // ADICIONA O TOKEN DA PRÓXIMA PÁGINA QUANDO NECESSÁRIO

        if (nextPageToken) {

            queryParameters.set(
                "pageToken",
                nextPageToken
            );
        }

        // MONTA A URL DA REQUISIÇÃO

        const requestUrl =
            `${DRIVE_FILES_ENDPOINT}?${queryParameters.toString()}`;

        // REALIZA A REQUISIÇÃO À API

        const response =
            await fetch(
                requestUrl,
                {
                    headers: {
                        Authorization:
                            `Bearer ${accessToken}`
                    }
                }
            );

        // TRATA POSSÍVEIS ERROS DA REQUISIÇÃO

        if (!response.ok) {

            const errorMessage =
                await getDriveErrorMessage(
                    response
                );

            throw new Error(
                errorMessage
            );
        }

        // PROCESSA A RESPOSTA DA API

        const responseData =
            await response.json();

        driveItems.push(
            ...(responseData.files ?? [])
        );

        nextPageToken =
            responseData.nextPageToken ??
            null;

    }
    while (nextPageToken);

    return driveItems;
}

// OBTÉM A MENSAGEM DE ERRO RETORNADA PELA API

async function getDriveErrorMessage(
    response
) {

    const defaultMessage =
        `Erro ao consultar o Drive: ${response.status}`;

    try {
        const errorData =
            await response.json();

        return (
            errorData.error?.message ??
            defaultMessage
        );
    }
    catch {

        return defaultMessage;

    }
}
