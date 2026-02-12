import Dashboard from "./pages/Dashboard";

/**
 * Root Application Component
 * 
 * Purpose:
 * - Acts as the main entry point of the frontend
 * - Renders the AI Dashboard
 * - Keeps architecture clean and scalable
 */
function App() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-black via-gray-900 to-black">
      <Dashboard />
    </div>
  );
}

export default App;
