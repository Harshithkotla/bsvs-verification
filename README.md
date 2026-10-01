# BSVS Final Website

This package keeps `index.html` as the permanent document verification entry point because existing certificate QR codes point to the current BSVS root URL. The new public-facing BSVS website is available at `home.html`.

## Pages

- `index.html` — Certificate + LOR verification. Keep this URL unchanged for existing QR codes.
- `verify.html` — Verification result page.
- `home.html` — Main BSVS website: courses, internship, about, contacts and CTAs.
- `apply.html` — Course enquiry + internship application form.

## Firebase

`js/firebase-config.js` uses the existing BSVS Firebase project. `js/verify.js` reads `certificates` for certificate IDs and `lors` for IDs beginning with `BSVS-LOR-`.

## Application notifications

The form is designed to POST to a Google Apps Script web app. See `GOOGLE_APPS_SCRIPT_SETUP.md` and `google-apps-script/Code.gs`.

Important: after deploying the Apps Script web app, paste its `/exec` URL into `js/apply.js` in the `APPS_SCRIPT_URL` constant.
