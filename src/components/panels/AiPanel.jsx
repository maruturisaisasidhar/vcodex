import React, { useState, useRef, useEffect } from "react";
import laraAI from "../../routes/laraAI.js";

const AiPanel = () => {
  const [input, setInput] = useState("");
  const [messages, setMessages] = useState([
    {
      from: "lara",
      text: "👋 Hi! I'm Lara, your AI assistant. How can I help you today?",
    },
  ]);
  const [isLoading, setIsLoading] = useState(false);
  const [connectionStatus, setConnectionStatus] = useState("checking");
  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  useEffect(() => {
    // Check connection status periodically
    const checkConnection = async () => {
      try {
        await laraAI.checkConnection();
        setConnectionStatus(laraAI.isConnected ? "connected" : "disconnected");
      } catch (error) {
        setConnectionStatus("disconnected");
      }
    };

    checkConnection();
    const interval = setInterval(checkConnection, 30000); // Check every 30 seconds

    return () => clearInterval(interval);
  }, []);

  const handleSendMessage = async (messageText) => {
    if (!messageText.trim()) return;

    const userMessage = {
      id: Date.now(),
      text: messageText,
      sender: "user",
      timestamp: new Date().toISOString(),
    };

    setMessages((prev) => [...prev, userMessage]);
    setInput("");
    setIsLoading(true);

    try {
      // Use AWS backend instead of localhost
      console.log("🚀 Sending message to AWS backend:", messageText);

      const result = await laraAI.askLara(messageText);

      const laraMessage = {
        id: Date.now() + 1,
        text: result.response,
        sender: "lara",
        timestamp: result.timestamp,
        source: result.source || "AWS Backend",
      };

      setMessages((prev) => [...prev, laraMessage]);

      if (result.success) {
        console.log("✅ Successfully received response from AWS backend");
      } else {
        console.warn("⚠️ Received error response from backend");
      }
    } catch (error) {
      console.error("❌ Failed to send message:", error);

      const errorMessage = {
        id: Date.now() + 1,
        text: "Sorry, I'm having trouble connecting to my AI service. Please check your connection and try again.",
        sender: "lara",
        timestamp: new Date().toISOString(),
        source: "Error Handler",
      };

      setMessages((prev) => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  // Fix form submission to prevent page refresh
  const handleFormSubmit = (e) => {
    e.preventDefault(); // Prevent form from refreshing the page
    const formData = new FormData(e.target);
    const messageText = formData.get("message");
    handleSendMessage(messageText);
    e.target.reset(); // Clear the form
  };

  const getConnectionStatusDisplay = () => {
    switch (connectionStatus) {
      case "connected":
        return <span style={{ color: "green" }}>🟢 AWS Backend Connected</span>;
      case "disconnected":
        return (
          <span style={{ color: "red" }}>🔴 AWS Backend Disconnected</span>
        );
      default:
        return (
          <span style={{ color: "orange" }}>🟡 Checking Connection...</span>
        );
    }
  };

  return (
    <div className="h-full flex flex-col bg-gray-900 text-white">
      {/* Header */}
      <div className="p-4 border-b border-gray-700 bg-gradient-to-r from-blue-600 to-purple-600">
        <h3 className="font-bold text-lg flex items-center gap-2">
          <span className="animate-pulse">✨</span>
          Lara AI Assistant
        </h3>
        <p className="text-xs text-gray-200 mt-1">Powered by Google Gemini</p>
      </div>

      {/* Connection Status */}
      <div style={{ padding: "10px", borderBottom: "1px solid #eee" }}>
        {getConnectionStatusDisplay()}
      </div>

      {/* Messages Container */}
      <div className="flex-1 p-4 overflow-y-auto space-y-4">
        {messages.map((msg, index) => (
          <div
            key={index}
            className={`flex ${
              msg.from === "user" ? "justify-end" : "justify-start"
            }`}
          >
            <div
              className={`max-w-xs lg:max-w-md px-4 py-2 rounded-lg ${
                msg.from === "user"
                  ? "bg-blue-600 text-white"
                  : "bg-gray-700 text-gray-100"
              }`}
            >
              <p className="text-sm whitespace-pre-wrap">{msg.text}</p>
            </div>
          </div>
        ))}

        {/* Loading indicator */}
        {isLoading && (
          <div className="flex justify-start">
            <div className="bg-gray-700 text-gray-100 max-w-xs px-4 py-2 rounded-lg">
              <p className="text-sm">
                <span className="animate-pulse">Lara is thinking...</span>
              </p>
            </div>
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* Input Form */}
      <form
        onSubmit={handleFormSubmit}
        className="p-4 border-t border-gray-700"
      >
        <div className="flex gap-2">
          <input
            type="text"
            name="message"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Ask Lara anything..."
            disabled={isLoading}
            className="flex-1 bg-gray-800 text-white border border-gray-600 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50"
          />
          <button
            type="submit"
            disabled={isLoading || !input.trim()}
            className="bg-blue-600 hover:bg-blue-700 disabled:bg-gray-600 disabled:cursor-not-allowed text-white font-medium px-6 py-2 rounded-lg transition-colors"
          >
            {isLoading ? "..." : "Send"}
          </button>
        </div>
      </form>
    </div>
  );
};

export default AiPanel;
