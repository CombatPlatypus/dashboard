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

    const files = [];

    let nextPageToken = null;

    do {

        const parameters = new URLSearchParams({

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

            orderBy: "folder,name",

            q: `'${folderId}' in parents and trashed = false`

        });

        if (nextPageToken) {
            parameters.set(
                "pageToken",
                nextPageToken
            );
        }

        const url =
            "https://www.googleapis.com/drive/v3/files?" +
            parameters.toString();

        const response = await fetch(url, {

            headers: {
                Authorization:
                    `Bearer ${accessToken}`
            }

        });

        if (!response.ok) {

            let errorMessage =
                `Erro ao consultar o Drive: ${response.status}`;

            try {

                const errorData =
                    await response.json();

                errorMessage =
                    errorData.error?.message ??
                    errorMessage;

            }
            catch {
                // Mantém a mensagem padrão.
            }

            throw new Error(errorMessage);

        }

        const data =
            await response.json();

        files.push(
            ...(data.files ?? [])
        );

        nextPageToken =
            data.nextPageToken ?? null;

    }
    while (nextPageToken);

    return files;

}
