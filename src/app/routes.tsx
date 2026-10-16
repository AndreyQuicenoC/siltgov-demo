import { createBrowserRouter } from "react-router";
import { Home } from "./pages/Home";
import { Login } from "./pages/Login";
import { ForgotPassword } from "./pages/ForgotPassword";
import { TwoFactorAuth } from "./pages/TwoFactorAuth";
import { FAQ } from "./pages/FAQ";
import { About } from "./pages/About";
import { AdminLayout } from "./layouts/AdminLayout";
import { SuperuserDashboard } from "./pages/superuser/Dashboard";
import { Departments } from "./pages/superuser/Departments";
import { Sectors } from "./pages/superuser/Sectors";
import { Entities } from "./pages/superuser/Entities";
import { Offices } from "./pages/superuser/Offices";
import { Administrators } from "./pages/superuser/Administrators";
import { Audit } from "./pages/superuser/Audit";
import { AdminDashboard } from "./pages/admin/Dashboard";
import { Sentences } from "./pages/admin/Sentences";
import { Liquidators } from "./pages/admin/Liquidators";
import { Payers } from "./pages/admin/Payers";
import { Statistics } from "./pages/admin/Statistics";
import { EditRequests } from "./pages/admin/EditRequests";
import { LiquidatorDashboard } from "./pages/liquidator/Dashboard";
import { LiquidatorPending } from "./pages/liquidator/Pending";
import { LiquidatorCompleted } from "./pages/liquidator/Completed";
import { ProcessLiquidation } from "./pages/liquidator/ProcessLiquidation";
import { CalculateLiquidation } from "./pages/liquidator/CalculateLiquidation";
import { PayerDashboard } from "./pages/payer/Dashboard";
import { PayerPending } from "./pages/payer/Pending";
import { PayerPaid } from "./pages/payer/Paid";
import { PayerHistory } from "./pages/payer/History";
import { RegisterPayment } from "./pages/payer/RegisterPayment";
import { Profile } from "./pages/common/Profile";
import { ViewPayment } from "./pages/payer/ViewPayment";

export const router = createBrowserRouter([
  {
    path: "/",
    Component: Home,
  },
  {
    path: "/login",
    Component: Login,
  },
  {
    path: "/forgot-password",
    Component: ForgotPassword,
  },
  {
    path: "/two-factor-auth",
    Component: TwoFactorAuth,
  },
  {
    path: "/faq",
    Component: FAQ,
  },
  {
    path: "/about",
    Component: About,
  },
  {
    path: "/superuser",
    Component: AdminLayout,
    children: [
      { index: true,                  Component: SuperuserDashboard },
      { path: "departments",          Component: Departments        },
      { path: "sectors",              Component: Sectors            },
      { path: "entities",             Component: Entities           },
      { path: "offices",              Component: Offices            },
      { path: "administrators",       Component: Administrators     },
      { path: "audit",                Component: Audit              },
      { path: "profile",              Component: Profile            },
    ],
  },
  {
    path: "/admin",
    Component: AdminLayout,
    children: [
      { index: true,                  Component: AdminDashboard     },
      { path: "sentences",            Component: Sentences          },
      { path: "liquidators",          Component: Liquidators        },
      { path: "payers",               Component: Payers             },
      { path: "statistics",           Component: Statistics         },
      { path: "edit-requests",        Component: EditRequests       },
      { path: "profile",              Component: Profile            },
    ],
  },
  {
    path: "/liquidator",
    Component: AdminLayout,
    children: [
      { index: true,                  Component: LiquidatorPending    },
      { path: "pending",              Component: LiquidatorPending    },
      { path: "completed",            Component: LiquidatorCompleted  },
      { path: "dashboard",            Component: LiquidatorDashboard  },
      { path: "process/:id",          Component: ProcessLiquidation   },
      { path: "calculate",            Component: CalculateLiquidation },
      { path: "profile",              Component: Profile              },
    ],
  },
  {
    path: "/payer",
    Component: AdminLayout,
    children: [
      { index: true,                  Component: PayerHistory     },
      { path: "pending",              Component: PayerPending     },
      { path: "paid",                 Component: PayerPaid        },
      { path: "register/:id",         Component: RegisterPayment  },
      { path: "dashboard",            Component: PayerDashboard   },
      { path: "history",              Component: PayerHistory     },
      { path: "view/:id",             Component: ViewPayment      },
      { path: "profile",              Component: Profile          },
    ],
  },
]);