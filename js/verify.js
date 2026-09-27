// =====================================
// BSVS Verification
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

const DEFAULT_STATUS = "🟢 VALID";

// =====================================
// Read Verification ID
// =====================================

const params = new URLSearchParams(window.location.search);
const certificateNumber = params.get("certificate");

// Cards
const loadingCard = document.getElementById("loadingCard");
const successCard = document.getElementById("successCard");
const errorCard = document.getElementById("errorCard");

// =====================================
// Start Verification
// =====================================

if (!certificateNumber) {

    loadingCard.style.display = "none";
    errorCard.style.display = "block";

} else {

    verifyCertificate(certificateNumber.trim());

}

// =====================================
// Verify Certificate / LOR
// =====================================

async function verifyCertificate(id) {

    try {

        // -------------------------------------
        // Decide which Firestore collection
        // -------------------------------------

        const isLOR = id.toUpperCase().startsWith("BSVS-LOR-");

        const collectionName = isLOR
            ? "lors"
            : "certificates";

        // -------------------------------------
        // Get document
        // -------------------------------------

        const docRef = doc(db, collectionName, id);

        const docSnap = await getDoc(docRef);

        loadingCard.style.display = "none";

        // -------------------------------------
        // Document Found
        // -------------------------------------

        if (docSnap.exists()) {

            const data = docSnap.data();

            // Student Name
            document.getElementById("studentName").textContent =
                data.studentName || "-";

            // Certificate / LOR Number
            document.getElementById("certificateNumber").textContent =
                id;

            // Domain
            document.getElementById("domain").textContent =
                data.domain || "-";

            // -------------------------------------
            // Issue Date
            // -------------------------------------

            if (isLOR) {

                document.getElementById("issueDate").textContent =
                    "-";

            } else {

                document.getElementById("issueDate").textContent =
                    data.issueDate || "-";

            }

            // -------------------------------------
            // Status
            // -------------------------------------

            if (isLOR) {

                document.getElementById("status").textContent =
                    "🟢 VALID";

            } else {

                const status = data.status || "Valid";

                document.getElementById("status").textContent =
                    status.toLowerCase() === "valid"
                        ? DEFAULT_STATUS
                        : status;

            }

            // Show success
            successCard.style.display = "block";

        } else {

            // -------------------------------------
            // Document Not Found
            // -------------------------------------

            errorCard.style.display = "block";

        }

    } catch (error) {

        console.error("Verification Error:", error);

        loadingCard.style.display = "none";
        errorCard.style.display = "block";

    }

}
