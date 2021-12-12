import React, { Component } from 'react';
import { Route, withRouter } from "react-router-dom";
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


class App extends Component {


  render() {
    return (
      <>
        <CartContextProvider>
          <NavBar />
          <Route exact path="/" render={() => <Carousel />} />
          <Route path="/Menu" render={() => <Menu />} />
          <Route path="/Cart" render={() => <div className="container mt-3"><MenuCart isConfirm={true} /></div>} />
          <Route path="/Order" render={() => <Order />} />
        </CartContextProvider>
        <Route path="/Profile" render={() => <Profile />} />
        <Route path="/OrderManagement" render={() => <OrderManagement />} />
        <Route path="/Tracking" render={() => <OrderStatus />} />
        {/* <Footer/> */}
      </>
    );
  }

}

export default withRouter(App);
