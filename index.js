const express = require('express');

const app = express();
const PORT = process.env.PORT || 3000;

// המפתח נקרא ממשתנה סביבה בלבד - לא נשמר בקוד
const RENDER_API_KEY = process.env.RENDER_API_KEY;

app.get('/', (req, res) => {
  res.send('Render services API is running. Go to /services');
});

// מחזיר את רשימת האפליקציות בחשבון ה-Render כ-JSON
app.get('/services', async (req, res) => {
  if (!RENDER_API_KEY) {
    return res.status(500).json({ error: 'RENDER_API_KEY is not set' });
  }

  try {
    const response = await fetch('https://api.render.com/v1/services?limit=20', {
      headers: {
        accept: 'application/json',
        authorization: `Bearer ${RENDER_API_KEY}`
      }
    });

    if (!response.ok) {
      return res.status(response.status).json({ error: await response.text() });
    }

    const data = await response.json();
    res.json(data);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.listen(PORT, () => {
  console.log(`Server is listening on port ${PORT}`);
});
