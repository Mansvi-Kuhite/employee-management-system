import { useEffect, useState } from "react";
import api from "./lib/axios";

function App() {
  const [message, setMessage] = useState("Loading...");

  useEffect(() => {
    api
      .get("/health")
      .then((res) => setMessage(res.data.message))
      .catch(() => setMessage("Could not reach the server"));
  }, []);

  return <h1 className="p-8 text-2xl font-bold text-pink-600">{message}</h1>;
}

export default App;
