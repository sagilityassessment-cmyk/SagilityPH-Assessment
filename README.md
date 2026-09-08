Upload contents to GitHub Pages and enable Pages.

## Firestore history permissions

The history uses anonymous Firebase Authentication. In the Firebase Console, open **Firestore Database > Rules**, replace the rules with the contents of [firestore.rules](firestore.rules), and click **Publish**. The Delete button marks records as deleted in Firestore so the change is shared across browsers.

## Sagi Notes

The [Sagi Notes](notes.html) page stores note titles and links in the `sagiNotes` Firestore collection. Publish the updated [firestore.rules](firestore.rules) file before using Notes so records can sync across devices.

## Typing Test results

The [Typing Test](typing-test/index.html) is available from the portal header. Completed tests and retakes are written to the shared `typingResults` Firestore collection and displayed in the Typing Test Results table on the portal. Publish [firestore.rules](firestore.rules) after deploying this feature so the results can be read and created by authenticated users.