// api/clock.js
// Node.js serverless handler for Vercel

const FIREBASE_PROJECT_ID = "dailylifetrackingsystem";
const FIREBASE_API_KEY = "AIzaSyClUlfeU8qovcZKqg_gwkV1IFOoBQJFsOE";
const SECRET_CRON_KEY = "super_secure_cron_secret_123_abc";

// Secure login credentials inside the serverless container
const USER_EMAIL = "lipalambenjie@gmail.com";
const USER_PASSWORD = "Judith082818#";

export default async function handler(req, res) {
  if (req.method !== 'POST' && req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { auth, action, uid, note } = { ...req.query, ...req.body };

  // 1. Simple Security Authentication
  if (auth !== SECRET_CRON_KEY) {
    return res.status(401).json({ error: 'Unauthorized: Invalid secret key' });
  }

  if (!uid) {
    return res.status(400).json({ error: 'Missing parameter: uid' });
  }

  if (action !== 'in' && action !== 'out') {
    return res.status(400).json({ error: 'Invalid action: must be "in" or "out"' });
  }

  try {
    // 2. Perform Firebase Auth Login to get a valid ID Token
    const authUrl = `https://identitytoolkit.googleapis.com/v1/accounts:signInWithPassword?key=${FIREBASE_API_KEY}`;
    const authRes = await fetch(authUrl, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        email: USER_EMAIL,
        password: USER_PASSWORD,
        returnSecureToken: true
      })
    });

    if (!authRes.ok) {
      const authErr = await authRes.json();
      return res.status(401).json({ error: 'Auth Login failed internally', details: authErr });
    }

    const authData = await authRes.json();
    const idToken = authData.idToken; // JWT Token to authorize Firestore requests

    // 3. Authorized Firestore Document URL
    const docUrl = `https://firestore.googleapis.com/v1/projects/${FIREBASE_PROJECT_ID}/databases/(default)/documents/users/${uid}`;

    // A. Fetch current user document with Authorization header
    const getRes = await fetch(docUrl, {
      headers: {
        'Authorization': `Bearer ${idToken}`
      }
    });

    if (!getRes.ok) {
      const getErr = await getRes.json();
      return res.status(getRes.status).json({ error: 'Failed to fetch user data from Firestore', details: getErr });
    }

    const userData = await getRes.json();
    const currentFields = userData.fields || {};

    const getBoolean = (field) => field && field.booleanValue ? true : false;
    const getString = (field) => field && field.stringValue ? field.stringValue : null;
    
    let logs = [];
    if (currentFields.workTimeLogs && currentFields.workTimeLogs.arrayValue && currentFields.workTimeLogs.arrayValue.values) {
      logs = currentFields.workTimeLogs.arrayValue.values;
    }

    const isCurrentlyClockedIn = getBoolean(currentFields.isClockedIn);
    const activeClockInLogId = getString(currentFields.activeClockInLogId);

    const now = new Date();
    const today = now.toLocaleDateString('en-CA'); // YYYY-MM-DD format in local timezone

    let responseMessage = "";

    // B. Handle CLOCK-IN Logic
    if (action === 'in') {
      if (isCurrentlyClockedIn) {
        return res.status(200).json({ success: true, message: 'Already clocked in', status: 'NO_ACTION' });
      }

      const logId = Date.now().toString();
      const newLogVal = {
        mapValue: {
          fields: {
            id: { stringValue: logId },
            date: { stringValue: today },
            clockIn: { stringValue: now.toISOString() },
            clockOut: { nullValue: null },
            duration: { nullValue: null },
            note: { stringValue: note || 'Auto clock-in via n8n' }
          }
        }
      };

      logs.push(newLogVal);

      const patchPayload = {
        fields: {
          isClockedIn: { booleanValue: true },
          activeClockInLogId: { stringValue: logId },
          workTimeLogs: { arrayValue: { values: logs } }
        }
      };

      const patchUrl = `${docUrl}?updateMask.fieldPaths=isClockedIn&updateMask.fieldPaths=activeClockInLogId&updateMask.fieldPaths=workTimeLogs`;
      const patchRes = await fetch(patchUrl, {
        method: 'PATCH',
        headers: { 
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${idToken}`
        },
        body: JSON.stringify(patchPayload)
      });

      if (!patchRes.ok) {
        const patchErr = await patchRes.json();
        return res.status(500).json({ error: 'Failed to update Firestore for clock-in', details: patchErr });
      }

      responseMessage = "Clocked in successfully!";
    }

    // C. Handle CLOCK-OUT Logic
    if (action === 'out') {
      if (!isCurrentlyClockedIn || !activeClockInLogId) {
        return res.status(200).json({ success: true, message: 'Not currently clocked in', status: 'NO_ACTION' });
      }

      let activeIndex = -1;
      for (let i = 0; i < logs.length; i++) {
        const logItem = logs[i].mapValue?.fields;
        if (logItem && logItem.id?.stringValue === activeClockInLogId) {
          activeIndex = i;
          break;
        }
      }

      if (activeIndex !== -1) {
        const activeFields = logs[activeIndex].mapValue.fields;
        const clockInStr = activeFields.clockIn?.stringValue;
        let durationMins = 0;

        if (clockInStr) {
          const clockInTime = new Date(clockInStr);
          const diffMs = now - clockInTime;
          durationMins = Math.max(0, Math.round(diffMs / 60000));
        }

        activeFields.clockOut = { stringValue: now.toISOString() };
        activeFields.duration = { integerValue: durationMins.toString() };
        if (note) {
          activeFields.note = { stringValue: note };
        }
      }

      const patchPayload = {
        fields: {
          isClockedIn: { booleanValue: false },
          activeClockInLogId: { nullValue: null },
          workTimeLogs: { arrayValue: { values: logs } }
        }
      };

      const patchUrl = `${docUrl}?updateMask.fieldPaths=isClockedIn&updateMask.fieldPaths=activeClockInLogId&updateMask.fieldPaths=workTimeLogs`;
      const patchRes = await fetch(patchUrl, {
        method: 'PATCH',
        headers: { 
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${idToken}`
        },
        body: JSON.stringify(patchPayload)
      });

      if (!patchRes.ok) {
        const patchErr = await patchRes.json();
        return res.status(500).json({ error: 'Failed to update Firestore for clock-out', details: patchErr });
      }

      responseMessage = "Clocked out successfully!";
    }

    return res.status(200).json({ success: true, message: responseMessage, status: 'SUCCESS' });

  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: 'Internal Server Error', details: error.message });
  }
}
