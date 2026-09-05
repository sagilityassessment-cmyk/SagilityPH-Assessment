Upload contents to GitHub Pages and enable Pages.

## Firestore history permissions

The history uses anonymous Firebase Authentication. In the Firebase Console, open **Firestore Database > Rules**, replace the rules with the contents of [firestore.rules](firestore.rules), and click **Publish**. The Delete button marks records as deleted in Firestore so the change is shared across browsers.