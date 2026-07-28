const DRIVE_FILES_ENDPOINT =
    "https://www.googleapis.com/drive/v3/files";


/**
 * Consulta as informações básicas de uma pasta.
 *
 * O nome retornado é utilizado no breadcrumb
 * e no histórico de navegação.
 */
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

    const queryParameters =
        new URLSearchParams({

            fields:
                "id,name,mimeType"

        });

    const requestUrl =
        `${DRIVE_FILES_ENDPOINT}/${encodeURIComponent(folderId)}` +
        `?${queryParameters.toString()}`;

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


/**
 * Lista todos os itens diretamente contidos
 * em uma pasta do Google Drive.
 *
 * A paginação é processada automaticamente
 * até não haver mais resultados.
 */
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

        const queryParameters =
            new URLSearchParams({

                pageSize: "100",

                fields: [

                    "nextPageToken,",

                    "files(",

                        "id,",

                        "name,",

                        "mimeType,",

                        "webViewLink,",

                        "iconLink,",

                        "modifiedTime",

                    ")"

                ].join(""),

                orderBy:
                    "folder,name",

                q:
                    `'${folderId}' in parents and trashed = false`

            });

        if (nextPageToken) {

            queryParameters.set(
                "pageToken",
                nextPageToken
            );

        }

        const requestUrl =
            `${DRIVE_FILES_ENDPOINT}?${queryParameters.toString()}`;

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

        if (!response.ok) {

            const errorMessage =
                await getDriveErrorMessage(
                    response
                );

            throw new Error(
                errorMessage
            );

        }

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
/**
 * Obtém a mensagem de erro retornada pela API.
 *
 * Caso não seja possível ler a resposta,
 * utiliza uma mensagem padrão.
 */
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
