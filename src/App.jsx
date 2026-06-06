import { BrowserRouter, Routes, Route } from "react-router-dom";
import Loginpage from "./Login/Loginpage";
import Calculator from "./Calculator/Calculator";
import Details from "./Details/Details";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Loginpage />} />
        <Route path="/details" element={<Details />} />
        <Route path="/calculator" element={<Calculator />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;