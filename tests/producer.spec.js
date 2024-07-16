
import { Verifier, Pact } from '@pact-foundation/pact';
import path from 'path';

const provider = new Pact({
  provider: 'api_provider',
  consumer: 'api_consumer',
  providerBaseUrl: 'http://localhost:8080',
  disableSSLVerification: true,
  pactUrls: [
    path.resolve(
      process.cwd(),
      'tests',
      'pacts',
      'api_consumer-api_provider.json'
    ),
  ],
});

let server;

beforeEach(() => {
  server = require('../producer/producerService')
});

describe("Pact", () => {
  // set up the provider mock server before ANY tests have ran
  beforeAll(async () => {
    await provider.setup();
  });

  // create the finalized contract after ALL tests have ran
  afterAll(async () => {
    server.close();
    await provider.finalize();
  });

  // verify interaction (and clear them) after each test has run
  afterEach(async () => {
    await provider.verify();
  });

  describe("when some request is made", () => {

    it('returns server health', () =>
      server.get('/status').then(health => {
        expect(health.status).toEqual('up');
      }
    ));      
  });
});





