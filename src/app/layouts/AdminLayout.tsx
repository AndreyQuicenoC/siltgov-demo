import { Outlet, useLocation } from "react-router";
import { Navbar } from "../components/Navbar";
import { Footer } from "../components/Footer";
import { MobileWarningOverlay } from "../components/MobileWarningOverlay";

export function AdminLayout() {
  const location = useLocation();
  const role = location.pathname.split("/")[1]; // superuser, admin, liquidator, payer

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <Navbar role={role} />
      <main id="main-content" className="flex-1" tabIndex={-1}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <Outlet />
        </div>
      </main>
      <Footer />
      {/* Mobile device warning — shows only on first login, only on mobile */}
      <MobileWarningOverlay />
    </div>
  );
}