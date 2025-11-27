import { laraAPI } from "../config/api.js";

class LaraAI {
  constructor() {
    this.isConnected = false;
    this.lastHealthCheck = null;
    // Don't check connection immediately to avoid blocking
    setTimeout(() => this.checkConnection(), 2000);
  }

  async checkConnection() {
    try {
      const health = await laraAPI.healthCheck();
      this.isConnected = health.status === "OK";
      this.lastHealthCheck = new Date().toISOString();
      console.log(
        "Lara AI Backend Connection:",
        this.isConnected ? "✅ Connected" : "❌ Disconnected"
      );
    } catch (error) {
      this.isConnected = false;
      console.warn("Lara AI Backend not available:", error.message);

      // Show user-friendly message about connection
      if (
        error.message.includes("timeout") ||
        error.message.includes("Failed to fetch")
      ) {
        console.warn(
          "💡 Check if AWS Security Group allows port 5000 inbound traffic"
        );
      }
    }
  }

  async askLara(message) {
    try {
      console.log("🤖 Sending message to Lara AI via AWS:", message);

      const response = await laraAPI.ask(message);

      if (response.response) {
        console.log("✅ Received response from AWS backend");
        this.isConnected = true; // Update connection status on success
        return {
          success: true,
          response: response.response,
          timestamp: new Date().toISOString(),
          source: "AWS Backend",
        };
      } else {
        throw new Error("No response received from AI");
      }
    } catch (error) {
      console.error("❌ Error communicating with Lara AI:", error);
      this.isConnected = false;

      let userMessage =
        "I'm sorry, I'm having trouble connecting to my AI service right now.";

      if (
        error.message.includes("timeout") ||
        error.message.includes("Failed to fetch")
      ) {
        userMessage +=
          "\n\n🔧 This might be a connectivity issue. Please check:\n" +
          "• Your internet connection\n" +
          "• AWS Security Group settings (port 5000 should be open)\n" +
          "• Backend server status";
      } else if (error.message.includes("429")) {
        userMessage =
          "I'm receiving too many requests right now. Please wait a moment and try again.";
      }

      return {
        success: false,
        response: userMessage,
        timestamp: new Date().toISOString(),
        source: "Error Handler",
        error: error.message,
      };
    }
  }

  // Legacy method for backward compatibility
  async processMessage(message) {
    return await this.askLara(message);
  }
}

export default new LaraAI();
