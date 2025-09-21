import React, { useEffect, useState } from "react";

function Home() {
  const [message, setMessage] = useState("");

  // useEffect(() => {
  //   fetch("http://127.0.0.1:8000/api/hello")
  //     .then(res => {
  //       if (!res.ok) throw new Error("HTTP error " + res.status);
  //       return res.json();
  //     })
  //     .then(data => setMessage(data.message))
  //     .catch(err => console.error("Fetch error:", err));
  // }, []);

  return (
    <div>
      
    </div>
  );
}

export default Home;
