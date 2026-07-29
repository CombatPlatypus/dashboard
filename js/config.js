// DEFINE AS CONFIGURAÇÕES GERAIS DA INTEGRAÇÃO COM O GOOGLE

export const CONFIG = {

    google: {

        clientId:
            "671842519306-an0e8ahhftppp3v0bshjdq5d384ab1b9.apps.googleusercontent.com", // ID DA API GERADO PELO GOOGLE

        folderId:
            "1xnyeHACpXe5r0g5cKixaHAFEflh6SWf0", // ID DA PASTA DO DRIVE A SER MOSTRADA

        scopes: [
            "openid",
            "email",
            "profile",
            "https://www.googleapis.com/auth/drive.readonly"
        ]
    }
};
