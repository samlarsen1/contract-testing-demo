// producerService.js

import express from 'express';
const app = express();
const port = 8080;

app.use(express.json());

// Mock database of parties
import partiesData from '../data/parties.json' assert { type: 'json' };
const parties = partiesData.parties;
// Create an ISO response object
let isoResponse = { Data: { Party: {} }, Links: { Self: "" }, Meta: { TotalPages: 1 }}

app.get('/parties', (req, res) => {
  isoResponse.Data.Party = parties;
  console.log('returning list of parties');
  res.append('Content-Type', 'application/json')
    .status(200)
    .json(isoResponse);
});

app.get('/parties/:partyId', (req, res) => {
  const party = parties[req.params.partyId];
  isoResponse.Data.Party = party;
  if (party) {
    console.log('returning party with id ' + req.params.partyId);
    res.append('Content-Type', 'application/json')
      .status(200)
      .json(isoResponse);
  } else {
    res.status(404).send('Party not found');
  }
});

app.listen(port, () => {
  console.log(`Party service provider running at http://localhost:${port}`);
});