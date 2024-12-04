import React, { useState } from "react";
import "./App.css";
import Header from "./Header";
import Body from "./Body";

function App() {
  const [filter, setFilter] = useState("");
  const [search, setSearch] = useState("");

  return (
    <div>
      <Header setFilter={setFilter} setSearch={setSearch}></Header>
      <Body filter={filter} search={search}></Body>
    </div>
  );
}

export default App;
