import { BrowserRouter, Routes, Route } from "react-router-dom";
import { Analytics } from "@vercel/analytics/react";
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
      <Analytics />
    </BrowserRouter>
  );
}

export default App;