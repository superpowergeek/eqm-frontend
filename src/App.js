import React from 'react';
import { Route, Switch } from 'react-router';
import ProtectedRoute from 'containers/ProtectedRoute';
import Login from 'pages/Login';
// import Home from 'pages/Home';
import Dashboard from 'pages/Dashboard';
import Register from 'pages/Register';
import ForgotPassword from 'pages/ForgotPassword';
import ForgotPasswordSuccess from 'pages/ForgotPassword/ForgotPasswordSuccess';
import ResetPassword from 'pages/ForgotPassword/ResetPassword';
import ResetPasswordSuccess from 'pages/ForgotPassword/ResetPasswordSuccess';
import Analytics from 'pages/Analytics';
import Reports from 'pages/Reports';
import Accounts from 'pages/Accounts';
import AssetGroupTab from 'pages/DataManagement/AssetGroup';
import TravelTab from 'pages/DataManagement/TravelTab';
import CommuteTab from 'pages/DataManagement/CommuteTab';
import AssignTab from 'pages/DataManagement/AssignTab';
import PurchasesTab from 'pages/DataManagement/PurchasesTab';
import UtilityTab from 'pages/DataManagement/UtilityTab';
import WasteTab from 'pages/DataManagement/WasteTab';
import EmployeeTab from 'pages/DataManagement/EmployeeTab';
import ProductTab from 'pages/DataManagement/ProductTab';
import EditAnalytic from 'pages/Analytics/EditAnalytic';
import EditReport from 'pages/Reports/EditReport';
import SDGPage from 'pages/SDGPage';
import Invitation from 'pages/Invitation';

const App = () => {
  return (
    <Switch>
      <Route exact path="/">
        <Login />
      </Route>
      <Route key="login" path="/login" component={Login} />
      <Route
        key="invitation"
        path="/invitation" 
        component={Invitation}
      />
      <Route key="register" path="/register">
        <Register />
      </Route>
      <Route key="forgot-password" path="/forgot-password">
        <ForgotPassword />
      </Route>
      <Route key="forgot-password-success" path="/forgot-password-success">
        <ForgotPasswordSuccess />
      </Route>
      <Route key="reset-password-success" path="/reset-password-success">
        <ResetPasswordSuccess />
      </Route>
      <Route key="reset-password" path="/forgotpassword" component={ResetPassword} />

      <ProtectedRoute key="dashboard" path="/dashboard" component={Dashboard} />
      <ProtectedRoute key="analytic" path="/analytics/:id" component={EditAnalytic} />
      <ProtectedRoute key="analytics" path="/analytics" component={Analytics} />
      <ProtectedRoute key="report" path="/reports/:id" component={EditReport} />
      <ProtectedRoute key="reports" path="/reports" component={Reports} />
      <ProtectedRoute key="sdg" path="/SDG" component={SDGPage} />
      <ProtectedRoute key="data-management-asset-detail" path="/data-management/assetGroup/:assetGroupId/:assetId/:leaseAssetId/:assetType" component={AssetGroupTab} />
      <ProtectedRoute key="data-management-asset" path="/data-management/assetGroup/:assetGroupId/:assetId/:leaseAssetId" component={AssetGroupTab} />
      <ProtectedRoute key="data-management-group" path="/data-management/assetGroup/:assetGroupId" component={AssetGroupTab} />
      <ProtectedRoute key="data-management-travel" path="/data-management/travel" component={TravelTab} />
      <ProtectedRoute key="data-management-commute" path="/data-management/commute" component={CommuteTab} />
      <ProtectedRoute key="data-management-assign" path="/data-management/assign" component={AssignTab} />
      <ProtectedRoute key="data-management-purchases" path="/data-management/purchases" component={PurchasesTab} />
      <ProtectedRoute key="data-management-utility" path="/data-management/utility" component={UtilityTab} />
      <ProtectedRoute key="data-management-waste" path="/data-management/waste" component={WasteTab} />
      <ProtectedRoute key="data-management-employee" path="/data-management/employee" component={EmployeeTab} />
      <ProtectedRoute key="data-management-product" path="/data-management/product" component={ProductTab} />

      <ProtectedRoute key="data-management" path="/data-management" component={AssetGroupTab} />

      <ProtectedRoute key="accounts" path="/accounts" component={Accounts}/>
      <Route path="*">
        <div>404, not found</div>
      </Route>
    </Switch>
  );
}

export default App;
