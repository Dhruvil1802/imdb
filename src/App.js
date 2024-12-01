import React, { useState } from "react";
import "./App.css";
import Header from "./Header";
import Body from "./Body";

function App() {
  const [filter, setFilter] = useState("");
  return (
    <div>
      <Header filter={filter} setFilter={setFilter}></Header>
      <Body filter={filter} setFilter={setFilter}></Body>
    </div>
  );
}

export default App;
