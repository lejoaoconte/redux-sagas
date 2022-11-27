import { Route, Routes } from "react-router-dom";
import User from "src/pages/User";
import MoreInfos from "./pages/MoreInfos";

export function App() {
  return (
    <div>
      <Routes>
        <Route path="/" element={<User />} />
        <Route path="/infos" element={<MoreInfos />} />
      </Routes>
    </div>
  );
}
