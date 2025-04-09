import { Switch, Route } from "wouter";
import CartPage from "../pages/buyer/CartPage";

const Router = () => {
  return (
    <Switch>
      {/* Other routes */}
      <Route path="/buyer/cart" component={CartPage} />
      {/* Other routes */}
    </Switch>
  );
};

export default Router;