import { Route, Routes } from "react-router-dom";

import IndexPage from "@/pages/index";
import ActiveLoansPage from "@/pages/activeLoans";
import LoansHistoryPage from "@/pages/loansHistory";
import NewLoanPage from "@/pages/newLoan";
import OverdueLoansPage from "@/pages/overdueLoans";

function App() {
  return (
    <Routes>
      <Route element={<IndexPage />} path="/" />
      <Route element={<ActiveLoansPage />} path="/prestamos-activos" />
      <Route element={<LoansHistoryPage />} path="/historial-prestamos" />
      <Route element={<NewLoanPage />} path="/nuevo-prestamo" />
      <Route element={<OverdueLoansPage />} path="/prestamos-vencidos" />
    </Routes>
  );
}

export default App;