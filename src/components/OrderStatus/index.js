import React, { Component, useState, useEffect, useRef } from 'react'
import {
    Paper,
    TextField,
    Button,
    Typography,
    IconButton,
    Divider
} from '@material-ui/core'
import { Alert } from '@material-ui/lab';
import UndoIcon from '@material-ui/icons/Undo';
import { trackOrder } from '../../action/order'
import './OrderStatus.css'
import CustomizedProgressBars from '../CustomizedProgressBars';

export class OrderStatus extends Component {

    state = {
        phone: "",
        error: false,
        orderList: []
    }

    onChangeState = object => {
        this.setState(Object.assign(this.state, object))
    }

    toggleErrorAlert = () => {
        this.onChangeState({ error: true })
        setTimeout(() => {
            this.onChangeState({ error: false })
        }, 3000)
    }

    trackOrder = async () => {
        let res
        if (this.state.phone !== "") res = await trackOrder(this.state.phone)
        else res = await trackOrder(null)
        if (!res.success) this.toggleErrorAlert()
        else this.onChangeState({ orderList: res.order_list })
    }

    render() {
        console.log(this.state.orderList)
        return (
            <div className="container mt-5">
                <Paper className="p-3">
                    {
                        this.state.orderList.length === 0
                            ?
                            <div className="text-center track-order">
                                {
                                    (this.state.error === true) &&
                                    <Alert className="text-left" severity="error">
                                        Không tìm thấy đơn hàng phù hợp
                                        <br />
                                        Đơn hàng của ban có thể chưa được nhận
                                    </Alert>
                                }
                                <Typography className="mb-3" variant="h6" gutterBottom>
                                    Nhập số điện thoại để theo dõi đơn hàng
                                </Typography>
                                <TextField
                                    className="mb-3"
                                    fullWidth
                                    error={false}
                                    id="Address"
                                    label="Số điện thoại"
                                    helperText=""
                                    variant="outlined"
                                    type="number"
                                    value={this.state.phone}
                                    onChange={e => this.onChangeState({ phone: e.target.value })}
                                />
                                <Button variant="contained" onClick={this.trackOrder}>Kiểm tra</Button>
                            </div>
                            :
                            <OrderProgress orderList={this.state.orderList} onReturn={() => { this.onChangeState({ orderList: [] }) }} />
                    }
                </Paper>
            </div>
        )
    }
}

export default OrderStatus

function OrderProgress(props) {
    const { orderList, onReturn } = props

    console.log(orderList)
    return (
        <div>
            <div className="d-flex">
                <IconButton size="medium" color="primary" onClick={onReturn}>
                    <UndoIcon fontSize="inherit" color="action" />
                </IconButton>
                <Divider className="rounded m-1" orientation="vertical" flexItem style={{ width: "3px", backgroundColor: "rgba(0, 0, 0, 0.35)" }} />
                <div style={{ flexGrow: 1, alignSelf: "center", textAlign: "center" }}>
                    <Typography variant="h5" >
                        Trạng thái đơn hàng
                    </Typography>
                </div>
            </div>
            {
                orderList.map((order, index) => {
                    return (
                        <Paper elevation={0} key={index} className="mb-2">
                            <CurrentProgress order={order} />
                        </Paper>
                    )
                })
            }
        </div>
    )
}

function CurrentProgress(props) {
    const { order } = props
    const [prepTime, setPrepTime] = useState(0)
    const [progressTime, setprogressTime] = useState(0)
    const prepTimeRef = useRef(prepTime)
    prepTimeRef.current = prepTime
    const progressTimeRef = useRef(progressTime)
    progressTimeRef.current = progressTime

    useEffect(() => {
        const prepTimer = setInterval(() => {
            if (prepTimeRef.current !== 100) {
                const progress = ((new Date().getTime() + 7 * 60 * 60 * 1000) - order.accept_time) / (order.prep_time - order.accept_time) * 100
                if (progress < 100) setPrepTime(progress)
                else setPrepTime(100)
            }
        }, 1000);

        const progressTimer = setInterval(() => {
            if (progressTimeRef.current !== 100) {
                const progress = ((new Date().getTime() + 7 * 60 * 60 * 1000) - order.prep_time) / (order.bake_time - order.prep_time) * 100
                if (progress < 100) setprogressTime(progress)
                else setprogressTime(100)
            }
        }, 1000);
        return () => {
            clearInterval(prepTimer);
            clearInterval(progressTimer)
        };
    }, [order]);
    console.log()
    return (
        <>
            <Divider className="mb-2" />
            <Typography variant="h6" style={{ fontSize: "1.1rem" }}>
                Đơn hàng đặt từ {new Date(order.order_time - 7 * 60 * 60 * 1000).toLocaleString("it-IT")}
            </Typography>
            <CustomizedProgressBars info={{ title: "Quá trình chuẩn bị", progress: prepTime }} />
            <CustomizedProgressBars info={{ title: "Quá trình thực hiện", progress: progressTime }} />
            <div className="text-center">
                {
                    prepTime < 100 && <Typography variant="h6" style={{ fontSize: "1.1rem", fontWeight: "600" }}>Đơn hàng của bạn đang được chuẩn bị</Typography>
                }
                {
                    (prepTime >= 100 && progressTime < 100) && <Typography variant="h6" style={{ fontSize: "1.1rem", fontWeight: "600" }}>Đơn hàng của bạn đang được làm</Typography>
                }
                {
                    progressTime >= 100 && <Typography variant="h6" style={{ fontSize: "1.1rem", fontWeight: "600" }}>Đơn hàng của bạn đang được giao</Typography>
                }
            </div>
        </>
    )
}