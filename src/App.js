import React, { useState } from "react";
import "./App.css";
import Header from "./Header";
import Body from "./Body";

function App() {
  const [filter, setFilter] = useState("");
  const [search, setSearch] = useState("game");

  const [favOpen, setFavOpen] = useState(false);

  return (
    <div>
      <Header
        setFilter={setFilter}
        setSearch={setSearch}
        setFavOpen={setFavOpen}
      ></Header>
      <Body filter={filter} search={search} favOpen={favOpen}></Body>
    </div>
  );
}

export default App;
