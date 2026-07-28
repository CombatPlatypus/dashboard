export async function listDriveFiles(accessToken) {

    const parameters = new URLSearchParams({

        pageSize: "20",

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

        orderBy: "modifiedTime desc",

        q: "trashed = false"

    });

    const url =
        `https://www.googleapis.com/drive/v3/files?${parameters}`;

    const response = await fetch(url, {

        headers: {
            Authorization: `Bearer ${accessToken}`
        }

    });

    if (!response.ok) {

        const error = await response.json();

        throw new Error(
            error.error?.message ??
            `Erro ao consultar o Drive: ${response.status}`
        );

    }

    const data = await response.json();

    return data.files ?? [];

}