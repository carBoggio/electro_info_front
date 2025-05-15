import { Route, Routes } from "react-router-dom";

import IndexPage from "@/pages/index";
import ActiveLoansPage from "@/pages/activeLoans";
import LoansHistoryPage from "@/pages/loansHistory";
import NewLoanPage from "@/pages/newLoan";
import OverdueLoansPage from "@/pages/overdueLoans";
import UserProfilePage from "@/pages/userProfile";
import RenewLoanPage from "@/pages/renewLoan";
import UserHistoryPage from "@/pages/userHistory";
import LoanPage from "@/pages/loan";
import ReturnLoanPage from "@/pages/returnLoan";

function App() {
  return (
    <Routes>
      <Route element={<IndexPage />} path="/" />
      <Route element={<ActiveLoansPage />} path="/prestamos-activos" />
      <Route element={<LoansHistoryPage />} path="/historial-prestamos" />
      <Route element={<NewLoanPage />} path="/nuevo-prestamo" />
      <Route element={<OverdueLoansPage />} path="/prestamos-vencidos" />
      <Route element={<UserProfilePage />} path="/usuarios/:userId" />
      <Route element={<RenewLoanPage />} path="/prestamos/:loanId/renovar" />
      <Route element={<ReturnLoanPage />} path="/prestamos/:loanId/devolver" />
      <Route element={<UserHistoryPage />} path="/usuarios/:userId/historial" />
      <Route element={<LoanPage />} path="/prestamos/:loanId" />
    </Routes>
  );
}

export default App;