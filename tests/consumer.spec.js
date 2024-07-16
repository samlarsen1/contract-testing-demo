// consumerPactTest.js

import { Pact } from '@pact-foundation/pact';
import path from 'path';
import ConsumerService from '../consumer/consumerService';
import { consumers } from 'stream';

describe('Test the parties service contract', () => {
  // pact mock server url
  const mock_port = 8080;
  const mock_server_url = 'http://localhost:' + mock_port;  
  const provider = new Pact({
    consumer: 'api_consumer',
    provider: 'api_provider',
    port: mock_port,
    dir: path.resolve(process.cwd(), 'tests', 'pacts'),
    spec: 2,
  });

  const EXPECTED_BODY = {"Data":{"Party":{"partyId":"123456","partyName":"John Smith","partyType":"INDIVIDUAL","addresses":[{"addressType":"RESIDENTIAL","addressLine1":"123 Main St","city":"Anytown","countrySubDivision":"Anycounty","postalCode":"12345","country":"GB"}],"emailAddresses":["john.smith@example.com"],"phoneNumbers":[{"phoneNumberType":"MOBILE","phoneNumber":"+441234567890"}],"accounts":[{"accountId":"789012","accountType":"PERSONAL","accountSubType":"CURRENT_ACCOUNT","currency":"GBP","accountIdentifications":[{"identificationType":"SORT_CODE","identification":"40-47-84"},{"identificationType":"ACCOUNT_NUMBER","identification":"12345678"}],"accountName":"John Smith Current Account"}]}},"Links":{"Self":""},"Meta":{"TotalPages":1}};

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
        body: {"Data":{"Party":{"partyId":"123456","partyName":"John Smith","partyType":"INDIVIDUAL","addresses":[{"addressType":"RESIDENTIAL","addressLine1":"123 Main St","city":"Anytown","countrySubDivision":"Anycounty","postalCode":"12345","country":"GB"}],"emailAddresses":["john.smith@example.com"],"phoneNumbers":[{"phoneNumberType":"MOBILE","phoneNumber":"+441234567890"}],"accounts":[{"accountId":"789012","accountType":"PERSONAL","accountSubType":"CURRENT_ACCOUNT","currency":"GBP","accountIdentifications":[{"identificationType":"SORT_CODE","identification":"40-47-84"},{"identificationType":"ACCOUNT_NUMBER","identification":"12345678"}],"accountName":"John Smith Current Account"}]}},"Links":{"Self":""},"Meta":{"TotalPages":1}},
      }
    }
    return provider.addInteraction(interaction);
  });
  describe('Given a request for the party data for John Smith', () => {
    // Verify interaction and generate Pact file
    it('Then we should see the account number 123456', async () => {
      const consumerService = new ConsumerService(mock_server_url);
      return consumerService.fetchUserData(123456).then((data) => {
        expect(data).toMatchObject(EXPECTED_BODY);
      });
    });
  });

  // Finalize and write Pact file
  afterEach(() => provider.verify());
  afterAll(() => provider.finalize());
});