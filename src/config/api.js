// API Configuration for Lara AI Backend and Execution Server

// Get API URL from environment variable or fallback to localhost
export const API_BASE_URL =
  import.meta.env.VITE_API_URL || "http://localhost:5000";
export const EXECUTION_SERVER_URL =
  import.meta.env.VITE_EXECUTION_SERVER_URL || "ws://localhost:3000";

// API Endpoints
export const API_ENDPOINTS = {
  health: `${API_BASE_URL}/health`,
  laraAsk: `${API_BASE_URL}/api/lara/ask`,
};

// WebSocket Endpoints for Execution Server
export const EXECUTION_SERVER_URL =
  import.meta.env.VITE_EXECUTION_SERVER_URL || "ws://100.26.140.182:3000";

export const WS_ENDPOINTS = {
  codeRunner: `${EXECUTION_SERVER_URL}/runner`,
  shell: `${EXECUTION_SERVER_URL}/shell`,
  judge: `${EXECUTION_SERVER_URL}/judge`,
};

// API call wrapper with error handling
export const apiCall = async (url, options = {}) => {
  try {
    const response = await fetch(url, {
      headers: {
        "Content-Type": "application/json",
        ...options.headers,
      },
      ...options,
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    return await response.json();
  } catch (error) {
    console.error("API call failed:", error);
    throw error;
  }
};

// Lara AI specific API calls with timeout
export const laraAPI = {
  // Send message to Lara AI
  ask: async (prompt) => {
    try {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 30000); // 30 second timeout

      const response = await fetch(API_ENDPOINTS.laraAsk, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ prompt }),
        signal: controller.signal,
      });

      clearTimeout(timeoutId);

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      return await response.json();
    } catch (error) {
      if (error.name === "AbortError") {
        throw new Error(
          "Request timeout - please check if the server is running"
        );
      }
      console.error("API call failed:", error);
      throw error;
    }
  },

  // Health check
  healthCheck: async () => {
    try {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 5000); // 5 second timeout for health check

      const response = await fetch(API_ENDPOINTS.health, {
        signal: controller.signal,
      });

      clearTimeout(timeoutId);

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      return await response.json();
    } catch (error) {
      if (error.name === "AbortError") {
        throw new Error("Health check timeout");
      }
      console.error("Health check failed:", error);
      throw error;
    }
  },
};

// Code execution service
export const codeExecutionAPI = {
  executeCode: (language, code, input = "") => {
    return new Promise((resolve, reject) => {
      console.log(
        "🚀 Connecting to execution server:",
        WS_ENDPOINTS.codeRunner
      );
      const ws = new WebSocket(WS_ENDPOINTS.codeRunner);
      let output = "";

      ws.onopen = () => {
        console.log("✅ Connected to execution server");
        ws.send(
          JSON.stringify({
            type: "execute",
            language: language,
            code: code,
            input: input,
          })
        );
      };

      ws.onmessage = (event) => {
        const data = JSON.parse(event.data);
        console.log("📨 Received from execution server:", data);

        if (data.type === "output") {
          output += data.data;
        } else if (data.type === "error") {
          reject(new Error(data.data));
          ws.close();
        } else if (data.type === "exit") {
          resolve(output);
          ws.close();
        }
      };

      ws.onerror = (error) => {
        console.error("❌ WebSocket error:", error);
        reject(error);
      };

      ws.onclose = () => {
        console.log("🔌 WebSocket connection closed");
      };
    });
  },
};
