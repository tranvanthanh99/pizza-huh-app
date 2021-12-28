import React, { Component } from 'react'
import {
    Card,
    CardHeader,
    CardFooter,
    CardBody,
} from 'reactstrap';
import {
    Button,
    IconButton,
    Badge,
    Paper,
    Snackbar

} from '@material-ui/core';
import MuiAlert from '@material-ui/lab/Alert';
import ShoppingCartIcon from '@material-ui/icons/ShoppingCart';
import CartItem from '../CartItem'
import { CartContext } from '../../context/CartContext'
import { createOrder } from '../../action/product'

export class MenuCart extends Component {

    static contextType = CartContext
    state = {
        alert: {
            message: "",
            severity: "",
            isOpen: false
        }
    }

    onChangeState = (state, object) => {
        this.setState(Object.assign(state, object));
    };

    onToggleAlert = (event, reason) => {
        if (reason === 'clickaway') {
            return;
        }
        this.onChangeState(this.state.alert, { isOpen: !this.state.alert.isOpen })
    }

    checkOut = async () => {
        const user = JSON.parse(window.localStorage.getItem("user"))
        if (window.location.pathname !== "/Order") {
            if (this.context.total_quantity > 0 && user != null && user.role !== "staff") window.location.pathname = "/Order"
            else if (user == null) {
                this.onChangeState(this.state.alert, {
                    message: "Vui lòng đăng nhập để thanh toán",
                    severity: "error",
                    isOpen: true
                })
            } else if (user.role === "staff") {
                this.onChangeState(this.state.alert, {
                    message: "Đăng nhập tài khoản người dùng để thanh toán",
                    severity: "error",
                    isOpen: true
                })
            }
            else {
                this.onChangeState(this.state.alert, {
                    message: "Thêm sản phẩm vào giỏ để thanh toán",
                    severity: "error",
                    isOpen: true
                })
            }
        } else {
            const res = await createOrder(
                this.props.user,
                this.context.total_price,
                this.context.total_quantity,
                this.context.item_list
            )
            if (res.success) {
                this.onChangeState(this.state.alert, {
                    message: "Đặt đơn hàng thành công",
                    severity: "success",
                    isOpen: true
                })
                setTimeout(()=>{
                    window.localStorage.removeItem("cart")
                    window.location.pathname="/"
                }, 3000)
            } else {
                this.onChangeState(this.state.alert, {
                    message: "Đặt đơn hàng thất bại",
                    severity: "error",
                    isOpen: true
                })
            }
        }
    }

    render() {
        const { total_price, total_quantity, item_list, deleteItem, modifyItem } = this.context
        return (
            <Paper elevation={2} style={{ position: "sticky", zIndex: "1000", top: "120px" }}>
                <Card className={this.props.isConfirm ? "d-flex border-0" : "d-none d-md-flex border-0"}>
                    <CardHeader>Chi tiết đơn hàng</CardHeader>
                    <CardBody className="p-0">
                        <div
                            className="cart-body pr-2 pl-2"
                            style={{ maxHeight: "calc(100vh - 260px)", height: "calc(100vh * 0.56)", overflowY: "scroll" }}>
                            {
                                item_list.map((item, index) => (
                                    <CartItem key={index} {...item} deleteItem={deleteItem} modifyItem={modifyItem} />
                                ))
                            }
                        </div>
                        <div className="d-flex justify-content-between pt-3 pr-3 pl-3 pb-3">
                            <span>Tổng Cộng:</span>
                            <span>{new Intl.NumberFormat('de-DE', { style: 'currency', currency: 'VND' }).format(total_price)}</span>
                        </div>
                    </CardBody>
                    <CardFooter style={{ textAlign: "center" }}>
                        <Button
                            variant="contained"
                            color="default"
                            onClick={() => {
                                this.checkOut()
                            }}
                        >
                            {window.location.pathname === "/Order" ? "Đặt Đơn hàng" : "Thanh toán"}
                        </Button>
                    </CardFooter>
                </Card>
                <div
                    className={this.props.isConfirm ? "d-none" : "fixed-bottom d-md-none justify-content-between p-3 bg-white"}
                    style={{ boxShadow: "0 2px 10px 0 rgba(0,0,0,.25)", width: "100vw" }}
                >

                    <div className="d-flex justify-content-between">
                        <div>
                            <a href="/Cart">
                                <IconButton aria-label="show 11 new notifications" size="small" color="inherit">
                                    <Badge badgeContent={total_quantity} color="secondary">
                                        <ShoppingCartIcon />
                                    </Badge>
                                </IconButton>
                            </a>
                            <span className="ml-3">Tổng Cộng:</span>
                        </div>
                        <span>{new Intl.NumberFormat('de-DE', { style: 'currency', currency: 'VND' }).format(total_price)}</span>
                    </div>
                    <Button
                        className="float-right"
                        variant="contained"
                        color="default"
                        onClick={() => {
                            this.checkOut()
                        }}
                    >
                        Thanh toán
                    </Button>
                </div>
                <CustomizedSnackbars {...this.state.alert} onToggle={this.onToggleAlert} />
            </Paper>
        )
    }
}

export default MenuCart

function Alert(props) {
    return <MuiAlert elevation={6} variant="filled" {...props} />;
}

export function CustomizedSnackbars(props) {
    const { message, severity, isOpen, onToggle } = props

    return (
        <div>
            <Snackbar
                anchorOrigin={{ vertical: "top", horizontal: "center" }}
                open={isOpen}
                autoHideDuration={2000}
                onClose={onToggle}
                style={{ top: "9vh" }}
            >
                <Alert onClose={onToggle} severity={severity}>
                    {message}
                </Alert>
            </Snackbar>
            {/* <Alert severity="error">This is an error message!</Alert>
            <Alert severity="warning">This is a warning message!</Alert>
            <Alert severity="info">This is an information message!</Alert>
            <Alert severity="success">This is a success message!</Alert> */}
        </div>
    );
}
