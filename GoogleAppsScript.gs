/**
 * Google Apps Script backend for the Sagility assessment email form.
 *
 * Deploy as a Web app:
 *   Execute as: Me
 *   Who has access: Anyone with the link
 * Then paste the deployment URL into GOOGLE_SCRIPT_URL in index.html.
 */

const ADMIN_EMAIL = 'PHLTestAdmin@Sagilityhealth.com';
const MEETING_TIME = '11am-8pm MNL';
const MEETING_LINK = 'https://teams.microsoft.com/l/meetup-join/19%3ameeting_YWUyMzUzYzYtNTgxYS00ZWVhLWJjN2UtNTA4YWM2Mzg1Zjdk%40thread.v2/0?context=%7b%22Tid%22%3a%22c0745124-84a4-4909-bb95-307ad5a8ae15%22%2c%22Oid%22%3a%22e7eb26f1-7544-4bac-bfac-c4674034791e%22%7d';
const MEETING_ID = '479 656 747 406 7';
const MEETING_PASSCODE = 'vi3nV3NB';

function doPost(e) {
  try {
    const request = JSON.parse(e.postData.contents);
    const candidateName = String(request.name || '').trim();
    const candidateEmail = String(request.email || '').trim();
    const location = String(request.location || '').trim();
    const packages = Array.isArray(request.packages) ? request.packages : [];

    if (!candidateName || !candidateEmail || !location || packages.length === 0) {
      return jsonResponse({ success: false, error: 'Name, email, location, and at least one package are required.' });
    }

    const subject = `Sagility Assessment_ ${candidateName}_${location}`;
    const plainTextBody = buildPlainTextBody(candidateName, location, packages);
    const htmlBody = buildHtmlBody(candidateName, location, packages);

    MailApp.sendEmail({
      to: candidateEmail,
      subject: subject,
      body: plainTextBody,
      htmlBody: htmlBody,
      replyTo: ADMIN_EMAIL,
      name: 'SagilityPH Assessment'
    });

    return jsonResponse({ success: true });
  } catch (error) {
    return jsonResponse({ success: false, error: error.message });
  }
}

function buildPlainTextBody(candidateName, location, packages) {
  const packageLines = packages.map(item => `${item.name} - ${item.url}`).join('\n');

  return `Hi ${candidateName},

Good Day!

Please click link/s below to start your assessment.

${packageLines}

BEFORE YOU START:

• We recommend using a Laptop/PC and a headset.
• Make sure you are in a quiet environment.
• Use your active email address and enter the security code when prompted.
• Read all instructions carefully before taking the assessment.

NEED ASSISTANCE?

If you need assistance, you may join our Virtual Assessment session so we can guide you on how to take your assessment or provide any necessary follow-ups.

Time: ${MEETING_TIME}
Link: ${MEETING_LINK}
Meeting ID: ${MEETING_ID}
Passcode: ${MEETING_PASSCODE}

***********************************************

IMPORTANT REMINDERS:

⚠️ Use the assessment link only once.
🔒 Do not share or forward the link.
📍 The system records IP address and location.
📇 Assessment materials are confidential. Any misuse may affect your application.

For questions or assistance, please contact:
${ADMIN_EMAIL}

Thank you, and good luck with your assessment!

Best Regards,

Talent Acquisition- Sagility Recruitment - Test Admin
${location}`;
}

function buildHtmlBody(candidateName, location, packages) {
  const packageLinks = packages.map(item =>
    `<li><strong>${escapeHtml(item.name)}:</strong> <a href="${escapeAttribute(item.url)}">${escapeHtml(item.url)}</a></li>`
  ).join('');

  return `<p>Hi ${escapeHtml(candidateName)},</p>
<p>Good Day!</p>
<p>Please click link/s below to start your assessment.</p>
<ol>${packageLinks}</ol>
<h3>Before You Start:</h3>
<ul>
<li>We recommend using a Laptop/PC and a headset.</li>
<li>Make sure you are in a quiet environment.</li>
<li>Use your active email address and enter the security code when prompted.</li>
<li>Read all instructions carefully before taking the assessment.</li>
</ul>
<h3>Need Assistance?</h3>
<p>If you need assistance, you may join our Virtual Assessment session so we can guide you on how to take your assessment or provide any necessary follow-ups.</p>
<p>Time: ${MEETING_TIME}<br>Link: <a href="${escapeAttribute(MEETING_LINK)}">Meeting Invite</a><br>Meeting ID: ${MEETING_ID}<br>Passcode: ${MEETING_PASSCODE}</p>
<hr>
<h3>Important Reminders:</h3>
<ul>
<li>⚠️ Use the assessment link only once.</li>
<li>🔒 Do not share or forward the link.</li>
<li>📍 The system records IP address and location.</li>
<li>📇 Assessment materials are confidential. Any misuse may affect your application.</li>
</ul>
<p>For questions or assistance, please contact:<br><a href="mailto:${ADMIN_EMAIL}">${ADMIN_EMAIL}</a></p>
<p>Thank you, and good luck with your assessment!</p>
<p><strong>Best Regards,<br>Talent Acquisition- Sagility Recruitment - Test Admin<br>${escapeHtml(location)}</strong></p>`;
}

function escapeHtml(value) {
  return String(value).replace(/[&<>"']/g, character => ({
    '&': '&amp;',
    '<': '&lt;',
    '>': '&gt;',
    '"': '&quot;',
    "'": '&#39;'
  }[character]));
}

function escapeAttribute(value) {
  return escapeHtml(value).replace(/javascript:/gi, '');
}

function jsonResponse(data) {
  return ContentService
    .createTextOutput(JSON.stringify(data))
    .setMimeType(ContentService.MimeType.JSON);
}
