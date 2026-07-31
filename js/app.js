// =============================
// BSVS Certificate Portal
// app.js
// =============================

const verifyForm = document.getElementById("verifyForm");
const certificateInput = document.getElementById("certificateNumber");

verifyForm.addEventListener("submit", function (e) {

    e.preventDefault();

    let certificateNumber = certificateInput.value.trim().toUpperCase();

    if (certificateNumber === "") {

        alert("Please enter a Certificate Number.");

        certificateInput.focus();

        return;

    }

    // Redirect to verification page
    window.location.href =
        `verify.html?certificate=${encodeURIComponent(certificateNumber)}`;

});