// =====================================
// BSVS Application / Course Enquiry
// =====================================

// Paste the deployed Google Apps Script /exec URL here.
const APPS_SCRIPT_URL = "https://script.google.com/macros/s/AKfycbx0duPqkFCCrKgWXExo1_dtu41-WClA38RyW7hKB1LW9uoas3cdTy9AsZhI-tpcO2c/exec";

const form = document.getElementById("applicationForm");
const typeInput = document.getElementById("applicationType");
const pathCards = document.querySelectorAll(".path-card");
const formTypeLabel = document.getElementById("formTypeLabel");
const internshipOnly = document.querySelectorAll(".internship-only");
const courseOnly = document.querySelectorAll(".course-only");
const domain = document.getElementById("domain");
const currentCourse = document.getElementById("currentCourse");
const courseChoice = document.getElementById("courseChoice");
const learningMode = document.getElementById("learningMode");
const successMessage = document.getElementById("successMessage");
const successText = document.getElementById("successText");
const errorMessage = document.getElementById("errorMessage");
const errorText = document.getElementById("errorText");
const submitBtn = document.getElementById("submitBtn");
const branchField = document.getElementById("branch");

function setType(type) {
  const isInternship = type === "internship";
  typeInput.value = isInternship ? "internship" : "course";

  pathCards.forEach((card) => {
    card.classList.toggle("active", card.dataset.type === typeInput.value);
  });

  formTypeLabel.textContent = isInternship
    ? "Internship Application"
    : "Course Enquiry";

  internshipOnly.forEach((el) => {
    el.hidden = !isInternship;
  });

  courseOnly.forEach((el) => {
    el.hidden = isInternship;
  });

  domain.required = isInternship;
  currentCourse.required = !isInternship;
  courseChoice.required = !isInternship;

  // Branch is useful for an internship application; keep it out of course enquiry.
  branchField.closest(".field").hidden = !isInternship;

  submitBtn.innerHTML = isInternship
    ? '<i class="fa-solid fa-paper-plane"></i> Submit Application'
    : '<i class="fa-solid fa-paper-plane"></i> Send Course Enquiry';
}

function hideMessages() {
  successMessage.hidden = true;
  errorMessage.hidden = true;
}

pathCards.forEach((card) => {
  card.addEventListener("click", () => {
    hideMessages();
    setType(card.dataset.type);
  });
});

const query = new URLSearchParams(window.location.search);
const initialType = query.get("type") === "course" ? "course" : "internship";
setType(initialType);

if (initialType === "course" && query.get("course")) {
  courseChoice.value = query.get("course");
}

form.addEventListener("submit", async (event) => {
  event.preventDefault();
  hideMessages();

  if (!form.checkValidity()) {
    form.reportValidity();
    return;
  }

  if (!APPS_SCRIPT_URL || APPS_SCRIPT_URL.includes("PASTE_YOUR")) {
    errorText.textContent = "This form is not connected yet. Please contact BSVS directly.";
    errorMessage.hidden = false;
    errorMessage.scrollIntoView({ behavior: "smooth", block: "center" });
    return;
  }

  // Basic anti-bot honeypot.
  const honeypot = document.getElementById("website").value.trim();
  if (honeypot) return;

  const applicationType = typeInput.value;
  const submissionId = `BSVS-${Date.now()}-${Math.random().toString(36).slice(2, 8).toUpperCase()}`;

  const payload = {
    submissionId,
    applicationType,
    fullName: document.getElementById("fullName").value.trim(),
    email: document.getElementById("email").value.trim(),
    phone: document.getElementById("phone").value.trim(),
    college: document.getElementById("college").value.trim(),
    branch: applicationType === "internship" ? branchField.value.trim() : "",
    level: document.getElementById("level").value,
    domain: applicationType === "internship" ? domain.value : "",
    currentCourse: applicationType === "course" ? currentCourse.value : "",
    courseChoice: applicationType === "course" ? courseChoice.value : "",
    learningMode: applicationType === "course" ? learningMode.value : "",
    message: document.getElementById("message").value.trim(),
    website: honeypot,
    submittedAt: new Date().toISOString()
  };

  submitBtn.disabled = true;
  submitBtn.innerHTML = '<i class="fa-solid fa-spinner fa-spin"></i> Submitting...';

  try {
    // text/plain keeps the request simple so Apps Script can receive it without a CORS preflight.
    // no-cors means the browser cannot read the Apps Script response, but a network-level success
    // indicates the request was sent to the deployed web app.
    await fetch(APPS_SCRIPT_URL, {
      method: "POST",
      mode: "no-cors",
      headers: { "Content-Type": "text/plain;charset=utf-8" },
      body: JSON.stringify(payload),
      cache: "no-store"
    });

    form.reset();
    setType(applicationType);

    successText.textContent = applicationType === "internship"
      ? "Your internship application has been submitted successfully. The BSVS team will contact you soon."
      : "Your course enquiry has been submitted successfully. The BSVS team will contact you soon.";

    successMessage.hidden = false;
    successMessage.scrollIntoView({ behavior: "smooth", block: "center" });

  } catch (error) {
    console.error("Application submission error:", error);
    errorText.textContent = "We could not submit your details right now. Please try again or contact BSVS directly.";
    errorMessage.hidden = false;
    errorMessage.scrollIntoView({ behavior: "smooth", block: "center" });
  } finally {
    submitBtn.disabled = false;
    submitBtn.innerHTML = typeInput.value === "internship"
      ? '<i class="fa-solid fa-paper-plane"></i> Submit Application'
      : '<i class="fa-solid fa-paper-plane"></i> Send Course Enquiry';
  }
});
