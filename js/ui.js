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
