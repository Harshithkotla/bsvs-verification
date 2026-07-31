// =====================================
// BSVS Certificate Verification
// verify.js
// =====================================

import { db } from "./firebase-config.js";

import {
    doc,
    getDoc
} from "https://www.gstatic.com/firebasejs/11.10.0/firebase-firestore.js";

// =====================================
// DEFAULT VALUES
// =====================================

const ISSUE_DATE = "31 July 2026";
const STATUS = "🟢 VALID";

// Domain Codes
const DOMAINS = {
    FE: "Frontend Development",
    FS: "Full Stack Development",
    PY: "Python Development",
    JA: "Java Development",
    AI: "Artificial Intelligence",
    ML: "Machine Learning",
    UI: "UI/UX Design",
    WD: "Web Development",
    AD: "Android Development",
    DS: "Data Science"
};

// =====================================
// Read Certificate Number
// =====================================

const params = new URLSearchParams(window.location.search);
const certificateNumber = params.get("certificate");

// Cards
const loadingCard = document.getElementById("loadingCard");
const successCard = document.getElementById("successCard");
const errorCard = document.getElementById("errorCard");

if (!certificateNumber) {

    loadingCard.style.display = "none";
    errorCard.style.display = "block";

} else {

    verifyCertificate(certificateNumber);

}

// =====================================
// Verify Certificate
// =====================================

async function verifyCertificate(id) {

    try {

        const docRef = doc(db, "certificates", id);

        const docSnap = await getDoc(docRef);

        loadingCard.style.display = "none";

        if (docSnap.exists()) {

            const data = docSnap.data();

            // Student Name
            document.getElementById("studentName").textContent =
                data.studentName || "-";

            // Certificate Number
            document.getElementById("certificateNumber").textContent =
                id;

            // Get Domain Code
            const parts = id.split("-");

            let domain = "-";

            if (parts.length >= 3) {

                const code = parts[2];

                domain = DOMAINS[code] || "Unknown Domain";

            }

            // Domain
            document.getElementById("domain").textContent = domain;

            // Issue Date
            document.getElementById("issueDate").textContent =
                ISSUE_DATE;

            // Status
            document.getElementById("status").textContent =
                STATUS;

            successCard.style.display = "block";

        } else {

            errorCard.style.display = "block";

        }

    } catch (error) {

        console.error("Verification Error:", error);

        loadingCard.style.display = "none";
        errorCard.style.display = "block";

    }

}