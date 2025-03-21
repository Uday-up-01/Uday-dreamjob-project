const loginBtn = document.getElementById("login-btn");
const signupBtn = document.getElementById("signup-btn");
const loginForm = document.getElementById("login-form");
const signupForm = document.getElementById("signup-form");
const formHeading = document.getElementById("form-title");
const toggleContainer = document.getElementById("toggle-container");
const switchtosignup = document.getElementById("switch-to-signup");
const switchtologin = document.getElementById("switch-to-login");

function showLogin() {
    loginForm.classList.remove("hidden");
    signupForm.classList.add("hidden");
    loginBtn.classList.add("active");
    signupBtn.classList.remove("active");
    formHeading.textContent = "User Login Form";
    toggleContainer.classList.add("left");
    toggleContainer.classList.remove("right");
}

function showSignup() {
    signupForm.classList.remove("hidden");
    loginForm.classList.add("hidden");
    signupBtn.classList.add("active");
    loginBtn.classList.remove("active");
    formHeading.textContent = "User Signup Form";
    toggleContainer.classList.add("right");
    toggleContainer.classList.remove("left");
}

showLogin();

loginBtn.addEventListener("click", showLogin);
signupBtn.addEventListener("click", showSignup);
switchtosignup.addEventListener("click", showSignup);
switchtologin.addEventListener("click", showLogin);