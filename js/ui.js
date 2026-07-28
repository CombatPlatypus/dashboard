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


export function showDriveFiles(files) {

    const driveFiles = document.getElementById("driveFiles");

    driveFiles.innerHTML = "";

    if (files.length === 0) {

        driveFiles.innerHTML = `
            <p>Nenhum arquivo encontrado.</p>
        `;

        return;

    }

    files.forEach((file) => {

        const fileElement = document.createElement("a");

        fileElement.classList.add("drive-file");

        fileElement.href = file.webViewLink;

        fileElement.target = "_blank";

        fileElement.rel = "noopener noreferrer";

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
