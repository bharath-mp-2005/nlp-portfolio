BHARATH NLP PORTFOLIO - HOW TO ADD YOUR FILES
=============================================
Open index.html in a browser. No internet or server is needed.
Put each file in the folder shown, with exactly this name. If a name differs, the site will not find it.

1. HANDWRITTEN WORK PHOTOS  ->  folder: img/
   Format: .jpeg (or .jpg)
   img/edit-distance.jpeg   photo of your edit distance working (Edit distance demo)
   img/viterbi.jpeg         photo of your Viterbi working (Viterbi demo)
   img/morphotactics.jpeg   photo of your morphotactics takeaway (Morphotactics demo)
   Until a photo is added, its place shows an orange dashed box naming the file it needs.

2. NOTEBOOK PDFs (the two GitHub activities)  ->  folder: assets/pdf/
   assets/pdf/git-activity-31-07-2026.pdf   inaugural addresses notebook
   assets/pdf/git-activity-21-08-2026.pdf   name classifier and bag of words notebook
   These two are already included. Replace them with your own PDFs using the same names if you want.

3. PROJECT PPT (PDF)  ->  folder: assets/project/
   assets/project/project-ppt.pdf   the cyberbullying project slides
   Already included. Replace it with the same name to update it.

4. DEMO VIDEO  ->  folder: assets/project/
   assets/project/demo-video.mp4   the project demo video (H.264 video + AAC audio .mp4 plays everywhere)
   Put your video in assets/project/ and name it exactly demo-video.mp4 (lowercase, with hyphens).
   The player in the Project section already points to that path, so no code change is needed.
   Until the file is added the player stays empty.

5. PORTRAIT  ->  folder: img/
   img/me.png   your portrait (transparent PNG, standing, cut out). Replace it with the same name.

6. VIBHA RADIO APP (APK)  ->  folder: assets/app/
   assets/app/vibha-radio.apk   your Android app file
   Put the APK in the assets/app/ folder and name it exactly vibha-radio.apk (lowercase, with hyphens).
   The "Download the app (APK)" button in the Vibha Radio section already points to that path, so no code change is needed.
   If you want a different file name, search index.html for assets/app/vibha-radio.apk and change both places it appears.
   Until the file is added the button leads to a "file not found" page.
   The four app screenshots are img/radio-globe.jpg, radio-browse.jpg, radio-search.jpg, radio-favorites.jpg.

7. OTHER PHOTOS  ->  folder: img/
   img/faculty.jpg      small round faculty portrait in the second hero
   img/presenting.jpg   you presenting the project (Project section)
   img/class-photo.jpg  final class photo (bottom of the page)

Other folders (do not rename): css/, js/, fonts/
Note: PDF viewing inside the page works in desktop Chrome, Edge and Firefox. On phones the Download PDF button is the way to open them.

Notes
- Click any photo on the page to view it larger (Esc or tap to close).
- On phones and tablets the PDFs are drawn with the bundled pdf.js (assets/vendor/pdfjs/, do not delete). The first 3 pages show, with a button for the rest. Desktop browsers keep their built-in PDF viewer.
- pdf.js needs the site to be served from a web address (your hosting is fine). Opening index.html straight from a phone's files app will not load the PDFs; the Download PDF button still works.
- The page opens with a 0 to 100% loading screen and shows the site only after all images and fonts have loaded (it gives up waiting after 12 seconds so it can never get stuck). Then the name Bharath animates in letter by letter. Visitors with "reduce motion" turned on see no animation.
