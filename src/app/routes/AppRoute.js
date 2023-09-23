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

export function AppRoute() {
  return (
    <Routes>
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
