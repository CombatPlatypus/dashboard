import { openDriveFolder } from "./auth.js";

export function showUser(user) {

    const loginButton = document.getElementById("loginButton");
    const userInfo = document.getElementById("userInfo");
    const userPhoto = document.getElementById("userPhoto");
    const userName = document.getElementById("userName");
    const userEmail = document.getElementById("userEmail");

    userPhoto.src = user.picture;
    userName.textContent = user.name;
    userEmail.textContent = user.email;

    loginButton.hidden = true;
    userInfo.hidden = false;

}


const FOLDER_MIME_TYPE =
    "application/vnd.google-apps.folder";


export function showDriveFiles(files, handleFolderOpen) {

    const driveFiles =
        document.getElementById("driveFiles");

    driveFiles.innerHTML = "";

    if (files.length === 0) {

        driveFiles.innerHTML =
            "<p>Esta pasta está vazia.</p>";

        return;

    }

    files.forEach((file) => {

        const fileElement =
            document.createElement("button");

        fileElement.type = "button";
        fileElement.classList.add("drive-file");

        fileElement.innerHTML = `
            <img
                src="${file.iconLink}"
                alt=""
                class="drive-file-icon"
            >

            <div class="drive-file-info">

                <strong class="drive-file-name">
                    ${escapeHTML(file.name)}
                </strong>

                <span class="drive-file-date">
                    Modificado em:
                    ${formatDate(file.modifiedTime)}
                </span>

            </div>
        `;

        if (file.mimeType === FOLDER_MIME_TYPE) {

            fileElement.addEventListener(
                "click",
                () => handleFolderOpen(file.id)
            );

        }
        else {

            fileElement.addEventListener(
                "click",
                () => {

                    window.open(
                        file.webViewLink,
                        "_blank",
                        "noopener,noreferrer"
                    );

                }
            );

        }

        driveFiles.appendChild(fileElement);

    });
}

function formatDate(date) {

    return new Intl.DateTimeFormat("pt-BR", {

        dateStyle: "short",
        timeStyle: "short"

    }).format(new Date(date));

}


function escapeHTML(value) {

    const element = document.createElement("div");

    element.textContent = value;

    return element.innerHTML;

}
