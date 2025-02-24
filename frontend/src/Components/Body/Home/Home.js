import { Navigate, Route, Routes } from "react-router-dom";
import "./home.css";
import { Header } from "./Header/Header";
import { Footer } from "./Footer/Footer";

import { HomeScreen } from "./HomeScreen/HomeScreen";
import { Quiz } from "./HomeScreen/Quiz/Quiz";
import { Careers } from "./Careers/Careers";
import { About } from "./About/About";

export const Home = () => {
  return (
    <div className="app-container">
      <Header />
      <div>
        <Routes>
          {/* Default route for homepage */}

          <Route path="/" element={<HomeScreen />} />
          <Route path="resources" element={<Careers />} />
          <Route path="about" element={<About />} />
          

          <Route path="quiz/*" element={<Quiz />} />
          {/* Catch-all for invalid routes, redirecting to homepage */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </div>
      <Footer />
    </div>
  );
};
