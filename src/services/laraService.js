import { laraAPI } from '../config/api.js';

class LaraService {
  async sendMessage(message) {
    try {
      console.log('Sending message to Lara AI:', message);
      
      const response = await laraAPI.ask(message);
      
      console.log('Received response from Lara AI:', response);
      
      return {
        success: true,
        response: response.response,
        timestamp: new Date().toISOString()
      };
    } catch (error) {
      console.error('Error communicating with Lara AI:', error);
      
      return {
        success: false,
        error: error.message,
        response: "I'm sorry, I'm having trouble connecting to my AI service right now. Please try again in a moment."
      };
    }
  }

  async healthCheck() {
    try {
      const response = await laraAPI.healthCheck();
      return response;
    } catch (error) {
      console.error('Health check failed:', error);
      return { status: 'ERROR', error: error.message };
    }
  }
}

export default new LaraService();
