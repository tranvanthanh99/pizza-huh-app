import React, { Component } from 'react'
import {
    Collapse,
    Navbar,
    NavbarToggler,
    // NavbarBrand,
    Nav,
    NavItem,
    // NavLink,
    NavbarText
} from 'reactstrap'
import {
    NavLink,
} from 'react-router-dom';
import IconButton from '@material-ui/core/IconButton';
import Badge from '@material-ui/core/Badge';
import ShoppingCartIcon from '@material-ui/icons/ShoppingCart';
import ModalLogin from '../ModalLogin'
import ModalRegister from '../ModalRegister'
import logo from '../../static/images/logo192.png'
import './NavBar.css'
import { CartContext } from '../../context/CartContext'

class NavBar extends Component {

    static contextType = CartContext
    state = {
        isOpen: false,
        isModalLoginOpen: false,
        isModalRegisterOpen: false,
        user: null
    }

    onChangeState = (object) => {
        this.setState(Object.assign(object))
    }

    toggle = () => {
        this.setState({
            isOpen: !this.state.isOpen
        })
    }

    switchToModalRegister = () => {
        this.onChangeState({
            isModalLoginOpen: false,
            isModalRegisterOpen: true
        })
    }

    componentDidMount = () => {
        const user = JSON.parse(window.localStorage.getItem("user"))
        this.setState({
            user: user
        })
    }

    logout = () => {
        window.localStorage.removeItem("user")
        window.localStorage.removeItem("cart")
        this.onChangeState({
            user: null
        })
        window.location.pathname = "/"
    }

    login = user => {
        this.setState({
            user: user
        })
    }

    checkUserRole = () => {
        if (this.state.user != null) {
            if (this.state.user.role === "staff") return true
        }
        return false
    }

    render() {
        const { total_quantity } = this.context
        return (
            <>
                <Navbar color="light" light expand="lg" sticky="top">
                    <div className="container" >
                        <NavLink to="/" className="mr-auto navbar-brand">
                            <img src={logo} alt="logo" style={{ width: "40px", height: "auto" }} />
                        </NavLink>

                        <Nav className="d-lg-none mr-3">
                            <NavItem>
                                <NavLink className="nav-link" to="/Tracking" style={{ maxHeight: "40px", width: "auto" }}>
                                    <IconButton aria-label="show 11 new notifications" size="small" color="inherit">
                                        <span className="fas fa-shipping-fast"></span>
                                    </IconButton>
                                </NavLink>
                            </NavItem>
                            <NavItem>
                                <NavLink className="nav-link" to="/Cart" style={{ maxHeight: "40px", width: "auto" }}>
                                    {/* <div style={{ position: "relative" }}>
                                        <span className="fas fa-shopping-bag"></span>
                                        <span className="count">0</span>
                                    </div> */}
                                    <IconButton aria-label="show 11 new notifications" size="small" color="inherit">
                                        <Badge badgeContent={total_quantity} color="secondary">
                                            <ShoppingCartIcon />
                                        </Badge>
                                    </IconButton>
                                </NavLink>
                            </NavItem>
                        </Nav>
                        <NavbarToggler onClick={this.toggle} />
                        <Collapse isOpen={this.state.isOpen} navbar>
                            <Nav className="ml-auto" navbar >
                                {
                                    this.state.user != null ?
                                        <>
                                            <NavItem style={{ display: "flex" }}>
                                                <NavItem tag="div">
                                                    {/* <NavLink className="nav-link" style={{textDecoration:"underline"}} onClick={() => window.location.pathname = '/Profile'}>
                                                        <strong>Xin chào:</strong>
                                                        {` ${this.state.user.lastname} ${this.state.user.firstname}`}
                                                    </NavLink> */}
                                                    <NavLink className="nav-link" to="/Profile" style={{textDecoration:"underline"}} >
                                                        <strong>Xin chào:</strong>
                                                        {` ${this.state.user.lastname} ${this.state.user.firstname}`}
                                                    </NavLink>
                                                </NavItem>
                                                <NavItem className="mr-1 ml-1 mr-md-0 ml-md-0" tag="div">
                                                    <NavbarText>/</NavbarText>
                                                </NavItem>
                                                <NavItem tag="div">
                                                    <NavLink className="nav-link" to="#" onClick={() => this.logout()}>Đăng xuất</NavLink>
                                                </NavItem>
                                            </NavItem>
                                        </>
                                        :
                                        <>
                                            <NavItem>
                                                <NavLink className="nav-link" to="#" onClick={() => this.onChangeState({ isModalRegisterOpen: true })}>Đăng Ký</NavLink>
                                            </NavItem>
                                            <NavItem className="d-none d-lg-block">
                                                <NavbarText>/</NavbarText>
                                            </NavItem>
                                            <NavItem>
                                                <NavLink className="nav-link" to="#" onClick={() => this.onChangeState({ isModalLoginOpen: true })}>Đăng nhập</NavLink>
                                            </NavItem>
                                        </>

                                }
                                {
                                    this.checkUserRole() &&
                                    <NavItem>
                                        <NavLink className="nav-link" to="/OrderManagement">Quản lý đơn hàng</NavLink>
                                    </NavItem>
                                }
                                <NavItem>
                                    <NavLink className="nav-link" to="/Menu">Thực đơn</NavLink>
                                </NavItem>
                                <NavItem className="d-none d-lg-block">
                                    <NavLink className="nav-link" to="/Tracking">Theo dõi đơn hàng</NavLink>
                                </NavItem>
                                <NavItem className="d-none d-lg-block mr-1">
                                    <NavLink className="nav-link" to="/Cart" style={{ maxHeight: "40px", width: "auto" }}>
                                        <IconButton aria-label="show 11 new notifications" size="small" color="inherit">
                                            <Badge badgeContent={total_quantity} color="secondary">
                                                <ShoppingCartIcon />
                                            </Badge>
                                        </IconButton>
                                    </NavLink>
                                </NavItem>

                            </Nav>
                        </Collapse>
                    </div>
                </Navbar>
                <ModalLogin
                    login={this.login}
                    isOpen={this.state.isModalLoginOpen}
                    onToggle={() => this.onChangeState({ isModalLoginOpen: !this.state.isModalLoginOpen })}
                    switchToModalRegister={this.switchToModalRegister}
                />
                <ModalRegister
                    isOpen={this.state.isModalRegisterOpen}
                    onToggle={() => this.onChangeState({ isModalRegisterOpen: !this.state.isModalRegisterOpen })}
                />
            </>
        )
    }
}

export default NavBar;