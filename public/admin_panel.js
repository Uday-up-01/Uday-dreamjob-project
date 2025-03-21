const logoutBtn = document.querySelector(".logout");

logoutBtn.addEventListener("click", () => {
    alert("Logged out successfully!");
    window.location.href = "/AdminLogin"; 
});