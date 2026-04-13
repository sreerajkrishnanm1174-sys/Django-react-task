import { useState } from "react";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import LoginPage from "./components/pages/login/LoginPage";
import SignUpPage from "./components/pages/registration/SignUpPage";
import LandingPage from "./components/pages/landingPage/LandingPage";

import MenuListPage from "./components/pages/dashboard/menu/MenuListPage";
import Menu from "./components/pages/dashboard/menu/Menu";
import RoleProtectedRoute from "./routes/RoleProtectedRoute";
import AddMenu from "./components/pages/dashboard/menu/AddMenu";
import OrderDashboard from "./components/pages/dashboard/orders/OrderDashboard";
import CreateOrder from "./components/pages/dashboard/orders/CreateOrder";

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
          <Route
            path="/menu"
            element={
              <RoleProtectedRoute allowedRoles={["chef"]}>
                <Menu />
              </RoleProtectedRoute>
            }
          >
            {/* <Route path="categories" element={<CategoriesPage />} /> */}
            <Route path="add-menu" element={<AddMenu />} />
            <Route path="list" element={<MenuListPage />} />

            {/* default page */}
            <Route index element={<MenuListPage />} />
          </Route>

          <Route path="/orders" element={
            <OrderDashboard />
         
          }>
            <Route path="create-order" element={<CreateOrder />} />
            {/* <Route path="/orders/view" element={<ViewOrders />} /> */}
          </Route>
        </Routes>
        
      </BrowserRouter>
    </>
  );
}

export default App;
