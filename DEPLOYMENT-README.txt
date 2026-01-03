====================================================
THE LANDLORD YEARBOOK 2026 - CLOUDWAYS DEPLOYMENT
====================================================
Target URL: https://affiliate-manager.io/calendar
====================================================

FOLDER STRUCTURE TO UPLOAD:
---------------------------
calendar/
├── index.html          (Main HTML file - 1.4 KB)
├── css/
│   └── styles.css      (Stylesheet - 14.9 KB)
└── js/
    ├── calendar-app.js  (Application logic - 30.6 KB)
    ├── events-data.js   (402 events - 273.1 KB)
    └── experts-data.js  (Expert profiles - 5.7 KB)


DEPLOYMENT STEPS:
-----------------
1. Login to Cloudways
2. Access your application's File Manager (or use SFTP)
3. Navigate to: public_html/
4. Create folder: calendar
5. Upload all files maintaining the folder structure:
   - index.html → public_html/calendar/
   - css folder → public_html/calendar/css/
   - js folder → public_html/calendar/js/

6. Test at: https://affiliate-manager.io/calendar


ALTERNATIVE (Standalone Version):
---------------------------------
If you prefer a single file deployment, use:
- index-standalone.html (325 KB)
- Rename to index.html when uploading


UPDATING EVENTS:
----------------
To add/update events in the future:
1. Edit js/events-data.js
2. Upload only the updated events-data.js file
3. No need to re-upload other files


UPDATING STYLES:
----------------
To modify appearance:
1. Edit css/styles.css
2. Upload only the updated styles.css file


TOTAL SIZE: ~325 KB (modular) or ~325 KB (standalone)
====================================================

