# BSVS Application Form – Google Apps Script Setup

The website uses a Google Apps Script Web App to receive internship applications and course enquiries.

## 1. Create the response spreadsheet
Create a Google Sheet, for example:

`BSVS Website Applications`

Copy the Spreadsheet ID from the URL:

`https://docs.google.com/spreadsheets/d/SPREADSHEET_ID/edit`

## 2. Add the Apps Script
Open **Extensions → Apps Script** in that spreadsheet and replace the script with `google-apps-script/Code.gs` from this project.

Set:

```javascript
const SPREADSHEET_ID = "YOUR_REAL_SPREADSHEET_ID";
```

Then add both people who should receive notifications:

```javascript
const RECIPIENTS = [
  "bsvsinternships@gmail.com",
  "YOUR_SISTER_EMAIL"
];
```

The script automatically creates an `Applications` sheet with headers the first time an application arrives.

## 3. Deploy the script
In Apps Script:

**Deploy → New deployment → Web app**

Use:

- **Execute as:** Me
- **Who has access:** Anyone

Authorize the requested Google permissions.

Copy the resulting **`/exec` URL**.

## 4. Connect the website
Open `js/apply.js` and replace:

```javascript
const APPS_SCRIPT_URL = "PASTE_YOUR_GOOGLE_APPS_SCRIPT_WEB_APP_URL_HERE";
```

with your real `/exec` URL.

Commit/push the website to GitHub and let Netlify deploy it.

## 5. Test before sharing
Open:

`https://YOUR-SITE/apply.html?type=internship`

Submit one test application.

Check:

1. The success message appears **only after pressing Submit**.
2. A new row appears in the `Applications` sheet.
3. You receive the notification email.
4. Your sister receives the notification email.

Then test a course enquiry:

`https://YOUR-SITE/apply.html?type=course`

For internship applications, the form does **not** ask for the current course or preferred course. For course enquiries, those course-specific fields appear.

## 6. Verification routing
Keep `index.html` as the root page because your already-issued QR codes point to the BSVS root URL. Scanning them therefore opens document verification directly.

The same verification page supports:

- Internship Certificates → `certificates` collection
- LORs → `lors` collection

The main BSVS site remains available at `/home.html` (and `/home`).
