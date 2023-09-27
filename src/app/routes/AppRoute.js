import { Routes, Route } from "react-router-dom";

// User
import { UserList } from "../views/setting/user/UserList";
import { UserInsert } from "../views/setting/user/UserInsert";
import { UserUpdate } from "../views/setting/user/UserUpdate";
// import { UserResetPassword } from "../views/setting/user/UserResetPassword";

// Group
import { GroupList } from "../views/setting/group/GroupList";
import { GroupInsert } from "../views/setting/group/GroupInsert";
import { GroupUpdate } from "../views/setting/group/GroupUpdate";
import { GroupAccess } from "../views/setting/group/GroupAccess";

// Access
import { AccessList } from "../views/setting/access/AccessList";
import { AccessInsert } from "../views/setting/access/AccessInsert";
import { AccessUpdate } from "../views/setting/access/AccessUpdate";

// External Cash
import { ExternalCash } from "../views/dashboard/twrr/external_cash";
import { ComparisonTWRR } from "../views/dashboard/twrr/comparison";
import { DetailTWRR } from "../views/dashboard/twrr/detail";

// CKPN
import { SummaryCKPN } from "../views/dashboard/ckpn/summary";
import { DepositoCKPN } from "../views/dashboard/ckpn/deposito";
import { ObligasiCKPN } from "../views/dashboard/ckpn/obligasi";
import { ComparisonCKPN } from "../views/dashboard/ckpn/comparison";
import { DetailCKPN } from "../views/dashboard/ckpn/detail";

// Porto
import { SummaryPorto } from "../views/dashboard/porto/summary";
import { DepositoPorto } from "../views/dashboard/porto/deposito";
import { SBNPorto } from "../views/dashboard/porto/sbn";
import { ObligasiPorto } from "../views/dashboard/porto/obligasi";
import { SBIPorto } from "../views/dashboard/porto/sbi";
import { ComparisonPorto } from "../views/dashboard/porto/comparison";
import { DetailDepositoPorto } from "../views/dashboard/porto/detailDeposito";
import { DetailSBIPorto } from "../views/dashboard/porto/detailSBI";
import { DetailSBNPorto } from "../views/dashboard/porto/detailSBN";

// TWRR COA
import { TWRRCOAList } from "../views/master/twrr_coa/twrrCoaList";
import { TWRRCOAInsert } from "../views/master/twrr_coa/twrrCoaInsert";
import { TWRRCOAUpdate } from "../views/master/twrr_coa/twrrCoaUpdate";

export function AppRoute() {
  return (
    <Routes>
      <Route path="/twrr/external_cash" Component={ExternalCash} />
      <Route path="/twrr/comparison" Component={ComparisonTWRR} />
      <Route path="/twrr/detail" Component={DetailTWRR} />

      <Route path="/ckpn/summary" Component={SummaryCKPN} />
      <Route path="/ckpn/deposito" Component={DepositoCKPN} />
      <Route path="/ckpn/obligasi" Component={ObligasiCKPN} />
      <Route path="/ckpn/comparison" Component={ComparisonCKPN} />
      <Route path="/ckpn/detail" Component={DetailCKPN} />

      <Route path="/porto/summary" Component={SummaryPorto} />
      <Route path="/porto/deposito" Component={DepositoPorto} />
      <Route path="/porto/sbn" Component={SBNPorto} />
      <Route path="/porto/obligasi" Component={ObligasiPorto} />
      <Route path="/porto/sbi" Component={SBIPorto} />
      <Route path="/porto/comparison" Component={ComparisonPorto} />
      <Route path="/porto/summary/deposito" Component={DetailDepositoPorto} />
      <Route path="/porto/summary/sbi" Component={DetailSBIPorto} />
      <Route path="/porto/summary/sbn" Component={DetailSBNPorto} />

      <Route path="/setting/twrr_coa" Component={TWRRCOAList} />
      <Route path="/setting/twrr_coa/insert" Component={TWRRCOAInsert} />
      <Route path="/setting/twrr_coa/:id" Component={TWRRCOAUpdate} />

      <Route path="/setting/user/list" Component={UserList} />
      <Route path="/setting/user/insert" Component={UserInsert} />
      <Route path="/setting/user/:id" Component={UserUpdate} />
      {/* <Route path="/setting/user/reset/:id" Component={UserResetPassword} /> */}

      <Route path="/setting/group/list" Component={GroupList} />
      <Route path="/setting/group/insert" Component={GroupInsert} />
      <Route path="/setting/group/:id" Component={GroupUpdate} />
      <Route path="/setting/group/access/:id" Component={GroupAccess} />

      <Route path="/setting/access/list" Component={AccessList} />
      <Route path="/setting/access/:id/:pid" Component={AccessList} />
      <Route path="/setting/access/:id" Component={AccessUpdate} />
      <Route path="/setting/access_child/:id" Component={AccessInsert} />
    </Routes>
  );
}
