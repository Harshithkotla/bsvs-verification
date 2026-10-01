// =====================================
// BSVS Document Verification
// Supports Certificates + LORs
// =====================================

import { db } from "./firebase-config.js";
import {
  doc,
  getDoc
} from "https://www.gstatic.com/firebasejs/11.10.0/firebase-firestore.js";

const params = new URLSearchParams(window.location.search);
const documentId = (params.get("certificate") || "").trim().toUpperCase();

const loadingCard = document.getElementById("loadingCard");
const successCard = document.getElementById("successCard");
const errorCard = document.getElementById("errorCard");
const errorTitle = errorCard?.querySelector("h1");
const errorLead = document.getElementById("errorLead");
const errorPill = errorCard?.querySelector(".error-pill");

function showOnly(card) {
  [loadingCard, successCard, errorCard].forEach((el) => {
    if (el) el.hidden = el !== card;
  });
}

function showError(title, message, pill = "NOT FOUND") {
  if (errorTitle) errorTitle.textContent = title;
  if (errorLead) errorLead.textContent = message;
  if (errorPill) errorPill.textContent = pill;
  showOnly(errorCard);
}

async function verifyDocument(id) {
  try {
    const isLOR = id.startsWith("BSVS-LOR-");
    const collectionName = isLOR ? "lors" : "certificates";
    const reference = doc(db, collectionName, id);
    const snapshot = await getDoc(reference);

    if (!snapshot.exists()) {
      showError(
        "Document Not Found",
        "The document ID entered could not be found in the official BSVS database."
      );
      return;
    }

    const data = snapshot.data();

    document.getElementById("studentName").textContent = data.studentName || "-";
    document.getElementById("certificateNumber").textContent = id;
    document.getElementById("domain").textContent = data.domain || "-";

    const documentType = isLOR
      ? "Letter of Recommendation"
      : "Internship Completion Certificate";

    document.getElementById("documentType").textContent = documentType;
    document.getElementById("documentIdLabel").textContent = isLOR
      ? "LOR ID"
      : "Certificate Number";

    const statusElement = document.getElementById("status");
    const status = String(data.status || "Valid").trim().toUpperCase();
    statusElement.textContent = status;
    statusElement.classList.toggle("valid-text", status === "VALID");

    const issueDateBox = document.getElementById("issueDateBox");
    if (isLOR) {
      issueDateBox.hidden = true;
    } else {
      issueDateBox.hidden = false;
      document.getElementById("issueDate").textContent = data.issueDate || "-";
    }

    document.title = `${isLOR ? "LOR" : "Certificate"} Verification | BSVS`;
    showOnly(successCard);
  } catch (error) {
    console.error("Verification Error:", error);
    showError(
      "Verification Unavailable",
      "We could not connect to the BSVS verification database. Please check your internet connection and try again.",
      "ERROR"
    );
  }
}

// Prevent an endless loading screen if a network/module error occurs.
const loadingTimeout = window.setTimeout(() => {
  if (loadingCard && !loadingCard.hidden) {
    showError(
      "Verification Unavailable",
      "The verification service did not respond in time. Please refresh the page and try again.",
      "ERROR"
    );
  }
}, 15000);

if (!documentId) {
  window.clearTimeout(loadingTimeout);
  showError("Enter a Document ID", "Please return to the verification page and enter a valid Certificate ID or LOR ID.", "MISSING");
} else {
  verifyDocument(documentId).finally(() => window.clearTimeout(loadingTimeout));
}
