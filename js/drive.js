export async function listDriveFiles(accessToken, folderId) {

    const parameters = new URLSearchParams({

        pageSize: "100",

        fields: [
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

    const url =
        `https://www.googleapis.com/drive/v3/files?${parameters.toString()}`;

    const response = await fetch(url, {

        headers: {
            Authorization: `Bearer ${accessToken}`
        }

    });

    if (!response.ok) {

        const errorData = await response.json();

        throw new Error(
            errorData.error?.message ??
            `Erro ao consultar o Drive: ${response.status}`
        );

    }

    const data = await response.json();

    return data.files ?? [];

}
