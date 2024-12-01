import "./App.css";
import Header from "./Header";
import Body from "./Body";

function App() {
  return (
    <div>
      <Header>{console.log("header")}</Header>
      <Body>{console.log("body")}</Body>
    </div>
  );
}

export default App;
