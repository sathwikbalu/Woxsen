// routes/googleFit.js

const express = require('express');
const { google } = require('googleapis');
const fs = require('fs');
const UserHealthData = require('../models/UserHealthData');

const router = express.Router();

// Load credentials and token paths
const CREDENTIALS_PATH = './credentials.json';
const TOKEN_PATH = './token.json';

// Google Fit API scopes
const SCOPES = [
  'https://www.googleapis.com/auth/fitness.activity.read',
  'https://www.googleapis.com/auth/fitness.heart_rate.read',
  'https://www.googleapis.com/auth/fitness.sleep.read',
  'https://www.googleapis.com/auth/fitness.nutrition.read',
];

// Fetch data from Google Fit API
const fetchGoogleFitData = async (auth, userId) => {
  const fitness = google.fitness({ version: 'v1', auth });

  const startTimeMillis = Date.now() - 7 * 24 * 60 * 60 * 1000; // 1 week ago
  const endTimeMillis = Date.now();

  try {
    const response = await fitness.users.dataset.aggregate({
      userId: 'me',
      requestBody: {
        aggregateBy: [
          { dataTypeName: 'com.google.step_count.delta' },
          { dataTypeName: 'com.google.heart_rate.bpm' },
          { dataTypeName: 'com.google.sleep.segment' },
        ],
        bucketByTime: { durationMillis: 86400000 }, // Daily buckets
        startTimeMillis,
        endTimeMillis,
      },
    });

    const data = {
      userId,
      steps: response.data.bucket[0]?.dataset[0]?.point || [],
      heartRate: response.data.bucket[1]?.dataset[1]?.point || [],
      sleep: response.data.bucket[2]?.dataset[2]?.point || [],
      timestamp: Date.now(),
    };

    // Save to database
    await UserHealthData.create(data);
    console.log('Google Fit data saved successfully:', data);
  } catch (error) {
    console.error('Error fetching Google Fit data:', error);
  }
};

// Google Fit data authorization
router.post('/google-fit-data', async (req, res) => {
  const { userId } = req.body;

  // Load credentials
  fs.readFile(CREDENTIALS_PATH, (err, content) => {
    if (err) {
      return res.status(500).send('Error loading credentials');
    }

    const credentials = JSON.parse(content);
    const { client_secret, client_id, redirect_uris } = credentials.installed || credentials.web;
    const oAuth2Client = new google.auth.OAuth2(client_id, client_secret, redirect_uris[0]);

    // Load token
    fs.readFile(TOKEN_PATH, async (err, token) => {
      if (err) {
        return res.status(500).send('Token missing, authenticate first');
      }

      oAuth2Client.setCredentials(JSON.parse(token));
      await fetchGoogleFitData(oAuth2Client, userId);
      res.status(200).send('Google Fit data fetched and saved successfully');
    });
  });
});

module.exports = router;
