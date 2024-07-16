
import { Verifier } from '@pact-foundation/pact';
import path from 'path';
import assert from 'assert';

describe('Pact Verification', () => {
  it('verifies the provider', () => {
    const options = {
      provider: 'api_server',
      providerBaseUrl: 'http://localhost:8080',
      disableSSLVerification: true,
      pactUrls: [
        path.resolve(
          process.cwd(),
          'tests',
          'pacts',
          'web_server-api_server.json'
        ),
      ],
    };
    return new Verifier(options)
      .verifyProvider()
      .then((output) => {
        console.log('Pact Verification Complete!');
        console.log('Result:', output);
      })
      .catch(function (error) {
        console.log(error);
        assert.fail();
      });
  });
});





