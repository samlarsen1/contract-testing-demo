// consumerPactTest.js

import { Pact } from '@pact-foundation/pact';
import path from 'path';
import ConsumerService from '../consumer/consumerService';
import { consumers } from 'stream';

describe('Pact with Parties Service', () => {
  // pact mock server url
  const mock_port = 8080;
  const mock_server_url = 'http://localhost:' + mock_port;  
  const provider = new Pact({
    consumer: 'web_server',
    provider: 'api_consumer',
    port: mock_port,
    dir: path.resolve(process.cwd(), 'tests', 'pacts'),
    spec: 2,
  });

  const EXPECTED_BODY = {
    accounts: {
      accountId: "789012"
    }
  };

  // Setup Pact mock server
  beforeAll(() => provider.setup());

  beforeEach(() => {
    const interaction = {
      uponReceiving: 'a request for user data',
      withRequest: {
        method: 'GET',
        path: '/parties/123456',
      },
      willRespondWith: {
        status: 200,
        headers: { 'Content-Type': 'application/json' },
        body: EXPECTED_BODY,
      }
    }
    return provider.addInteraction(interaction);
  });

  // Verify interaction and generate Pact file
  it('should fetch party information', async () => {
    const consumerService = new ConsumerService(mock_server_url);
    return consumerService.fetchUserData(123456).then((data) => {
      expect(data).to.deep.equal(EXPECTED_BODY);
    });
  });

  // Finalize and write Pact file
  afterEach(() => provider.verify());
  afterAll(() => provider.finalize());
});