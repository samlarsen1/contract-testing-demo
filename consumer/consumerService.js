// consumerService.js

import axios from 'axios';

class ConsumerService {
  constructor(baseUrl) {
    this.baseUrl = baseUrl;
  }

  // Function to fetch user data from the producer
  async fetchUserData(userId) {
    try {
      const response = await axios.get(`${this.baseUrl}/parties/${userId}`, {
        headers: {
          'Accept': 'application/json'
        },
        proxy: false
      });
      return response.data;
    } catch (error) {
      throw new Error('Failed to fetch user data');
    }
  }
}

export default ConsumerService;