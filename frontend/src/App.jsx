import { useState } from "react";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import LoginPage from "./components/pages/login/LoginPage";
import SignUpPage from "./components/pages/registration/SignUpPage";
import LandingPage from "./components/pages/landingPage/LandingPage";
import CategoriesPage from "./components/pages/dashboard/menu/CategoriesPage";
import AddItemPage from "./components/pages/dashboard/menu/AddItemPage";
import MenuListPage from "./components/pages/dashboard/menu/MenuListPage";
import Menu from "./components/pages/dashboard/menu/Menu";


function App() {
  const [count, setCount] = useState(0);

  return (
    <>
      <BrowserRouter>
        <Routes>
          {/* Public pages */}
          <Route path="/" element={<LandingPage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<SignUpPage />} />

          {/* Dashboard layout */}
          <Route path="/menu" element={<Menu />}>
            <Route path="categories" element={<CategoriesPage />} />
            <Route path="add-item" element={<AddItemPage />} />
            <Route path="list" element={<MenuListPage />} />

            {/* default page */}
            <Route index element={<MenuListPage />} />
          </Route>
        </Routes>
      </BrowserRouter>
    </>
  );
}

export default App;
