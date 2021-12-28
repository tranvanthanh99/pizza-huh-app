import React, { Component } from 'react';
import { Redirect, Route, withRouter, Switch } from "react-router-dom";
import './static/css/App.css';
import NavBar from './components/NavBar'
import Menu from './components/Menu'
import Profile from './components/Profile'
import Order from './components/Order'
import MenuCart from './components/MenuCart'
import Carousel from './components/Carousel'
import CartContextProvider from './context/CartContext';
import OrderManagement from './components/OrderManagement';
import OrderStatus from './components/OrderStatus';
import PrivateRoute from './utils/PrivateRoute'


class App extends Component {

  state = {
    user: null,
    authed: false,
    role: null,
  }

  UNSAFE_componentWillMount() {
    const user = JSON.parse(window.localStorage.getItem("user"))
    this.setState({
      user: user,
      authed: user != null ? true : false,
      role: user != null ? user.role : null,
    })
  }

  render() {
    console.log(this.props);
    return (
      <>
        <CartContextProvider>
          <NavBar />
          <Switch>
            <Route exact path="/" render={() => <Carousel />} />
            <Route path="/Menu" render={() => <Menu />} />
            <Route path="/Tracking" render={() => <OrderStatus />} />
            <PrivateRoute authed={true} path="/Cart" component={renderMenuCart}/>
            <PrivateRoute authed={this.state.authed} path="/Profile" component={Profile}/>
            <PrivateRoute authed={this.state.authed && this.state.role === "user"} path="/Order" component={Order}/>
            <PrivateRoute authed={this.state.authed && this.state.role ==="staff"} path="/OrderManagement" component={OrderManagement}/>

            {/* <Route path="/Cart" render={() => <div className="container mt-3"><MenuCart isConfirm={true} /></div>} />
            <Route path="/Order" render={() => <Order />} />
            <Route path="/Profile" render={() => <Profile />} />
            <Route path="/OrderManagement" render={() => <OrderManagement />} /> */}
            <Redirect from="*" to="/" />
          </Switch>
          {/* <Footer/> */}
        </CartContextProvider>
      </>
    );
  }

}

const renderMenuCart = () => (
  <div className="container mt-3"><MenuCart isConfirm={true} /></div>
)

export default withRouter(App);
