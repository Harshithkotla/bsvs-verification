# BSVS Final Deployment Checklist

## Preserve certificate QR behavior
- Keep `index.html` as the document verification page.
- Do not redirect `/` to `home.html`.
- Existing QR codes pointing to `https://bsvs-verification.netlify.app/` must continue to open verification.

## Firebase
- `certificates` collection: public read, no client write.
- `lors` collection: public read, no client write.
- Confirm `bsvs-verify` project is the Firebase project used by `js/firebase-config.js`.

Recommended Firestore rules:

```text
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    match /certificates/{certificateId} {
      allow read: if true;
      allow write: if false;
    }
    match /lors/{lorId} {
      allow read: if true;
      allow write: if false;
    }
  }
}
```

## Application form
- Set `SPREADSHEET_ID` in `google-apps-script/Code.gs`.
- Replace `YOUR_SISTER_EMAIL_HERE` with the CEO notification email.
- Deploy Apps Script as a Web App with access for anyone.
- Put the resulting `/exec` URL into `js/apply.js`.
- Test one internship application.
- Test one course enquiry.
- Confirm both notification recipients receive the email.

## Netlify
Deploy the project root containing `index.html`, `verify.html`, `home.html`, `apply.html`, `assets`, `css`, and `js`.

After deployment test:

- `/` → Document verification
- `/verify.html?certificate=BSVS-CLP26-FE-0001` → certificate result
- `/verify.html?certificate=BSVS-LOR-001` → LOR result
- `/home.html` → main BSVS site
- `/apply.html?type=internship` → internship form
- `/apply.html?type=course&course=Python%20Full%20Stack` → course enquiry form

## Final smoke test
1. Verify one existing certificate.
2. Verify one LOR.
3. Scan an old certificate QR and confirm it opens verification.
4. Submit one internship application.
5. Submit one course enquiry.
6. Confirm the success message is hidden before submission.
7. Confirm the application spreadsheet receives both records.
8. Confirm email notifications reach the configured recipients.
