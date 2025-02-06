// import React, { useState, useEffect } from "react";
// import axios from "axios";

// function App() {
//   const [message, setMessage] = useState("");

//   useEffect(() => {
//     axios.get("http://localhost:5000/api/message")
//       .then(response => setMessage(response.data.message))
//       .catch(error => console.error("Error:", error));
//   }, []);

//   return (
//     <div>
//       <h1>Frontend Connected to Backend</h1>
//       <p>{message}</p>
//     </div>
//   );
// }

// export default App;

//  

import axios from "axios";
import { useEffect, useState } from "react";

function App() {
  const [message, setMessage] = useState("");

  useEffect(() => {
    axios.get("/api/message") // No need for full URL
      .then((res) => setMessage(res.data.message))
      .catch((err) => console.error("Error:", err));
  }, []);

  return (
    <div>
      <h1>Frontend Connected to Backend</h1>
      <h2>HI I am Frontend</h2>
      <p>{message}</p>
    </div>
  );
}

export default App;
