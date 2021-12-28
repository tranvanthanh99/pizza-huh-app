import React, { Component, useState, useEffect, useRef } from 'react'
import {
    Row,
    Col,
} from 'reactstrap'
import {
    Paper,
    Typography,
    Button,
    Breadcrumbs,
    Link,
    Divider,
    Table,
    TableHead,
    TableCell,
    TableBody,
    TableRow
} from '@material-ui/core'
import IconButton from '@material-ui/core/IconButton';
import DoneOutlineRoundedIcon from '@material-ui/icons/DoneOutlineRounded';
import RevertIcon from "@material-ui/icons/NotInterestedOutlined";
import EditRoundedIcon from '@material-ui/icons/EditRounded';
import AccountCircleIcon from '@material-ui/icons/AccountCircle';
import NavigateNextIcon from '@material-ui/icons/NavigateNext';
import CheckCircleOutlineRoundedIcon from '@material-ui/icons/CheckCircleOutlineRounded';
import OrderHistory from '../OrderHistory';
import { CustomizedSnackbars } from '../MenuCart'
import { acceptOrder, updateOrder, declineOrder } from '../../action/order'
import DeclineOrderModal from './DeclineOrderModal'
import EditProductTable from './EditProductTable'

export class OrderManagement extends Component {

    state = {
        fullname: "",
        tabs: "pendingOrder",
        currentOrder: {},
        alert: {
            message: "",
            severity: "",
            isOpen: false
        },
        loading: false
    }

    onChangeState = object => {
        this.setState(Object.assign(this.state, object));
    };

    onChangeAlert = object => {
        this.setState(Object.assign(this.state.alert, object));
    };

    getCurrentOrder = object => {
        this.onChangeState({
            currentOrder: object
        })
    }

    getTabName = (tab) => {
        if (tab === "pendingOrder") return "Đơn chưa duyệt"
        if (tab === "acceptedOrder") return "Đơn đã nhận"
        if (tab === "completedOrder") return "Đơn đã hoàn thành"
        return ""
    }

    getOrderStatus = (tab) => {
        if (tab === "pendingOrder") return "Chờ duyệt"
        if (tab === "acceptedOrder") return "Đang thực hiện"
        if (tab === "completedOrder") return "Đã hoàn thành"
        return ""
    }

    onAcceptOrder = async (order_id) => {
        this.onChangeState({ loading: true })
        const res = await acceptOrder(order_id)
        if (res.success) {
            this.onChangeAlert({
                message: "Nhận đơn thành công",
                severity: "success",
                isOpen: true
            })
        }
        else {
            this.onChangeState(this.state.alert, {
                message: "Nhận đơn Thất bại",
                severity: "error",
                isOpen: true
            })
        }
        this.onChangeState({ loading: false })
        this.onChangeState({ currentOrder: {} })
    }

    onDeclineOrder = async (order_id) => {
        this.onChangeState({ loading: true })
        const res = await declineOrder(order_id)
        if (res.success) {
            this.onChangeAlert({
                message: "Hủy đơn thành công",
                severity: "success",
                isOpen: true
            })
        }
        else {
            this.onChangeState(this.state.alert, {
                message: "Hủy đơn Thất bại",
                severity: "error",
                isOpen: true
            })
        }
        this.onChangeState({ loading: false })
        this.onChangeState({ currentOrder: {} })
    }

    onCompleteOrder = () => {
        this.onChangeAlert({
            message: "Đơn hàng đã hoàn thành",
            severity: "success",
            isOpen: true
        })
        this.onChangeState({ currentOrder: {} })
    }

    onToggleAlert = (event, reason) => {
        if (reason === 'clickaway') {
            return;
        }
        this.onChangeAlert({ isOpen: !this.state.alert.isOpen })
    }

    componentDidMount() {
        const user = JSON.parse(window.localStorage.getItem("user"))
        this.onChangeState({ fullname: user.lastname + " " + user.firstname })
    }

    render() {
        return (
            <div className="container">
                <Row className="mt-5">
                    <Col className="mb-3" xs={12} lg={3}>
                        <Paper
                            className="mb-3"
                            style={{ width: "100%", height: "auto", padding: "1rem" }}
                        >
                            <div className="w-100 d-flex justify-content-center">
                                <AccountCircleIcon
                                    style={{ transform: "translateY(-80%)", fontSize: "3.1875rem", textAlign: "center" }}
                                />
                            </div>
                            <div className="text-center">
                                <Typography variant="caption" display="block">
                                    Xin Chào
                                </Typography>
                                <Typography variant="h6" gutterBottom>
                                    {this.state.fullname}
                                </Typography>
                            </div>

                        </Paper>
                        <Button
                            className="mb-3"
                            fullWidth
                            variant="contained"
                            onClick={() => this.onChangeState({ tabs: "pendingOrder", currentOrder: {} })}
                        >
                            Đơn chưa duyệt
                        </Button>
                        <Button
                            className="mb-3"
                            fullWidth
                            variant="contained"
                            onClick={() => this.onChangeState({ tabs: "acceptedOrder", currentOrder: {} })}
                        >
                            Đơn đã nhận
                        </Button>
                        <Button
                            className="mb-3"
                            fullWidth
                            variant="contained"
                            onClick={() => this.onChangeState({ tabs: "completedOrder", currentOrder: {} })}
                        >
                            Đơn đã hoàn thành
                        </Button>
                    </Col>
                    <Col className="mb-3" xs={12} lg={9}>
                        <Paper elevation={0}>
                            <Breadcrumbs className="p-3" separator={<NavigateNextIcon fontSize="small" />} aria-label="breadcrumb">
                                <Link
                                    color="inherit"
                                    href="#"
                                    onClick={e => {
                                        e.preventDefault()
                                        this.onChangeState({ currentOrder: {} })
                                    }}
                                >
                                    {this.getTabName(this.state.tabs)}
                                </Link>
                                <Typography color="textPrimary">
                                    {
                                        this.state.currentOrder.id != null &&
                                        new Date(this.state.currentOrder.order_time - 7 * 60 * 60 * 1000).toLocaleString("it-IT")
                                    }
                                </Typography>
                            </Breadcrumbs>
                            {
                                this.state.currentOrder.id == null
                                    ?
                                    <>
                                        {
                                            this.state.tabs === "pendingOrder" &&
                                            <OrderHistory orderInfo={{
                                                status: this.getOrderStatus(this.state.tabs),
                                                getOrder: this.getCurrentOrder
                                            }} />
                                        }
                                        {
                                            this.state.tabs === "acceptedOrder" &&
                                            <OrderHistory orderInfo={{
                                                status: this.getOrderStatus(this.state.tabs),
                                                getOrder: this.getCurrentOrder
                                            }} />
                                        }
                                        {
                                            this.state.tabs === "completedOrder" &&
                                            <OrderHistory orderInfo={{
                                                status: this.getOrderStatus(this.state.tabs),
                                                getOrder: this.getCurrentOrder
                                            }} />
                                        }
                                    </>
                                    :
                                    <CurrentOrder
                                        orderInfo={this.state.currentOrder}
                                        editOrder={this.getCurrentOrder}
                                        acceptOrder={{
                                            accept: this.onAcceptOrder,
                                            loading: this.state.alert.isOpen || this.state.loading
                                        }}
                                        declineOrder={{
                                            decline: this.onDeclineOrder,
                                            loading: this.state.alert.isOpen || this.state.loading
                                        }}
                                        completeOrder={this.onCompleteOrder}
                                    />
                            }
                        </Paper>
                    </Col>
                </Row>
                <CustomizedSnackbars {...this.state.alert} onToggle={this.onToggleAlert} />
            </div>
        )
    }
}

export default OrderManagement


function CurrentOrder(props) {
    const { orderInfo, acceptOrder, declineOrder, completeOrder, editOrder } = props
    const [prepTime, setPrepTime] = useState("")
    const [progressTime, setprogressTime] = useState("")
    const prepTimeRef = useRef(prepTime)
    prepTimeRef.current = prepTime
    const progressTimeRef = useRef(progressTime)
    progressTimeRef.current = progressTime
    const [isOrderEdit, setIsOrderEdit] = useState(false)
    const [editItemList, setEditItemList] = useState(JSON.parse(JSON.stringify(orderInfo.item_list)))

    const acceptItemChange = () => {
        const total_quantity = editItemList.reduce((tol, cur) => {
            return tol + cur.quantity
        }, 0)
        const total_price = editItemList.reduce((tol, cur) => {
            return tol + (cur.quantity * cur.price)
        }, 0)
        editOrder(Object.assign(orderInfo, {
            total_price,
            total_quantity,
            item_list: editItemList
        }))
    }

    const millisToMinutesAndSeconds = (millis) => {
        var minutes = Math.floor(millis / 60000);
        var seconds = ((millis % 60000) / 1000).toFixed(0);
        return minutes + ":" + (seconds < 10 ? '0' : '') + seconds;
    }

    useEffect(() => {
        const prepTimer = setInterval(() => {
            if (prepTimeRef.current !== "done") {
                const time = (orderInfo.prep_time - 7 * 60 * 60 * 1000) - new Date().getTime()
                const displayMinute = millisToMinutesAndSeconds(time)
                if (time > 1) setPrepTime(displayMinute)
                else setPrepTime("done")
            }
        }, 1000);

        const progressTimer = setInterval(() => {
            if (progressTimeRef.current !== "done") {
                const time = (orderInfo.bake_time - 7 * 60 * 60 * 1000) - new Date().getTime()
                const displayMinute = millisToMinutesAndSeconds(time)
                if (time > 1) setprogressTime(displayMinute)
                else setprogressTime("done")
            }
        }, 1000);
        return () => {
            clearInterval(prepTimer);
            clearInterval(progressTimer)
        };
    }, [orderInfo]);

    return (
        <Paper className="p-3">
            <Typography variant="h5" display="block" align="center">THÔNG TIN ĐƠN HÀNG</Typography>
            <Row className="mt-3">
                <Col xs={12}>
                    <Typography>
                        <strong>Tên người nhận hàng:  </strong>
                        {orderInfo.fullname}
                    </Typography>
                </Col>
                <Col xs={12} sm={7}>
                    <Typography>
                        <strong>Email: </strong>
                        {orderInfo.email}
                    </Typography>
                </Col>
                <Col xs={12} sm={5}>
                    <Typography>
                        <strong>SĐT: </strong>
                        {orderInfo.phone}
                    </Typography>
                </Col>
                <Col xs={12} sm={7}>
                    <Typography>
                        <strong>Địa chỉ:  </strong>
                        {orderInfo.address}
                    </Typography>
                </Col>
                <Col xs={12} sm={5}>
                    <Typography>
                        <strong>Số lượng tổng:  </strong>
                        {orderInfo.total_quantity}
                    </Typography>
                </Col>
                <Col xs={12} sm={7}>
                    <Typography>
                        <strong>Ghi chú đơn hàng:  </strong>
                        {
                            orderInfo.guide_info.trim() !== "" ?
                                orderInfo.guide_info
                                : "Không có"
                        }
                    </Typography>
                </Col>
                <Col xs={12} sm={5}>
                    <Typography>
                        <strong>Tổng tiền:  </strong>
                        {new Intl.NumberFormat('de-DE', { style: 'currency', currency: 'VND' }).format(orderInfo.total_price)}
                    </Typography>
                </Col>
            </Row>
            <Divider className="mt-3 mb-3" light />
            <Typography variant="h6" gutterBottom component="div">
                Chi tiết đơn hàng
                {
                    isOrderEdit
                        ?
                        <>
                            <IconButton
                                className="float-right"
                                aria-label="delete"
                                size="medium"
                                color="secondary"
                                onClick={() => {
                                    setEditItemList(JSON.parse(JSON.stringify(orderInfo.item_list)))
                                    setIsOrderEdit(false)
                                }}
                            >
                                <RevertIcon fontSize="small" />
                            </IconButton>
                            <IconButton
                                className="float-right"
                                aria-label="delete"
                                size="medium"
                                style={{ color: "green" }}
                                onClick={() => {
                                    acceptItemChange()
                                    setIsOrderEdit(false)
                                }}
                            >
                                <DoneOutlineRoundedIcon fontSize="small" />
                            </IconButton>
                        </>
                        :
                        <>
                            {
                                orderInfo.status === "Chờ duyệt" &&
                                <IconButton
                                    className="float-right"
                                    aria-label="delete"
                                    size="medium"
                                    color="primary"
                                    onClick={() => setIsOrderEdit(true)}
                                >
                                    <EditRoundedIcon fontSize="small" />
                                </IconButton>
                            }
                        </>
                }
            </Typography>
            {
                isOrderEdit
                    ?
                    <EditProductTable itemList={editItemList} editItemList={setEditItemList} />
                    :
                    <ProductTable item_list={orderInfo.item_list} />
            }

            {
                orderInfo.status === "Đang thực hiện" &&
                <>
                    <Divider className="mt-3 mb-2" light />
                    <Typography variant="h6" gutterBottom component="div">
                        Quá trình thực hiện
                    </Typography>
                    <div className="p-3">
                        <Typography variant="subtitle1" gutterBottom>
                            Chuẩn bị đơn:
                            {
                                prepTime === "done"
                                    ?
                                    <span style={{ color: "green" }}>
                                        Hoàn thành
                                        <CheckCircleOutlineRoundedIcon />
                                    </span>
                                    :
                                    <span>{" hoàn thành trong " + prepTime}</span>
                            }
                            <Button
                                className="ml-2"
                                variant="contained"
                                size="small"
                                disabled={prepTime === "" || prepTime === "done"}
                                onClick={() => {
                                    setPrepTime("done")
                                    updateOrder(orderInfo.id, "updatePrep")
                                }}
                            >Hoàn thành</Button>
                        </Typography>
                        <Typography variant="subtitle1" gutterBottom component="div">
                            Thực hiện đơn:
                            {
                                progressTime === "done"
                                    ?
                                    <span style={{ color: "green" }}>
                                        Hoàn thành
                                        <CheckCircleOutlineRoundedIcon />
                                    </span>
                                    :
                                    <span>{prepTime === "done" && " hoàn thành trong " + progressTime}</span>
                            }
                            <Button
                                className="ml-2"
                                variant="contained"
                                size="small"
                                disabled={progressTime === "" || progressTime === "done" || prepTime !== "done"}
                                onClick={() => {
                                    setprogressTime("done")
                                    updateOrder(orderInfo.id, "updateBake")
                                }}
                            >Hoàn thành</Button>
                        </Typography>
                        <Typography variant="subtitle1" gutterBottom component="div">
                            Giao hàng:
                            <Button
                                className="ml-2"
                                variant="contained"
                                size="small"
                                disabled={prepTime !== "done" || progressTime !== "done"}
                                onClick={() => {
                                    updateOrder(orderInfo.id, "done")
                                    completeOrder()
                                }}
                            >Hoàn thành</Button>
                        </Typography>
                    </div>
                </>
            }
            {
                orderInfo.status === "Chờ duyệt" &&
                <>
                    <Divider className="mt-3 mb-2" light />
                    <div className="d-flex justify-content-center">
                        <Button
                            className="mr-1"
                            variant="contained"
                            color="primary"
                            style={{ background: "green" }}
                            onClick={() => acceptOrder.accept(orderInfo.id)}
                            disabled={acceptOrder.loading}
                        >Nhận đơn</Button>
                        <DeclineOrderModal declineOrder={declineOrder} orderInfo={orderInfo} />
                    </div>
                </>
            }
        </Paper>
    )
}

function ProductTable(props) {
    const { item_list } = props
    const modifyData = data => {
        if (data === "lớn") return "Cỡ lớn - 12 inch"
        if (data === "vừa") return "Cỡ vừa - 9 inch"
        if (data === "nhỏ") return "Cỡ nhỏ - 7 inch"
        return ""
    }
    return (
        <Paper>
            <Table size="small" aria-label="purchases">
                <TableHead>
                    <TableRow>
                        <TableCell>Tên sản phẩm</TableCell>
                        <TableCell>Loại</TableCell>
                        <TableCell>Tùy chọn</TableCell>
                        <TableCell align="right">Số lượng</TableCell>
                        <TableCell align="right">Giá</TableCell>
                    </TableRow>
                </TableHead>
                <TableBody>
                    {item_list.map((historyRow) => (
                        <TableRow key={historyRow.name}>
                            <TableCell component="th" scope="row">
                                {historyRow.name + " " + modifyData(historyRow.size)}
                            </TableCell>
                            <TableCell>{historyRow.category}</TableCell>
                            <TableCell>{historyRow.option.toString()}</TableCell>
                            <TableCell align="right">{historyRow.quantity}</TableCell>
                            <TableCell align="right">
                                {new Intl.NumberFormat('de-DE', { style: 'currency', currency: 'VND' }).format(historyRow.price)}
                            </TableCell>
                        </TableRow>
                    ))}
                </TableBody>
            </Table>
        </Paper>
    )
}