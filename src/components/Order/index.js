import React, { Component } from 'react'
import {
    Row,
    Col
} from 'reactstrap'
import {
    Paper,
    Typography,
    TextField,
} from '@material-ui/core'
import MenuCart from '../MenuCart'

export class Order extends Component {

    state = {
        user: {
            user_id: "",
            email: "",
            fullname: "",
            firstname: "",
            lastname: "",
            phone: "",
            address: "",
            guide_info: ""
        }
    }

    onChangeState = (state, object) => {
        this.setState(Object.assign(state, object));
    };


    componentDidMount() {
        const user = JSON.parse(window.localStorage.getItem("user"))
        if (user != null) this.onChangeState(this.state.user, { ...user, fullname: `${user.lastname + " " + user.firstname}` })
        // window.location.pathname = "/"
    }

    render() {
        return (
            <div className="container mt-4 text-center">
                <Typography variant="h4" gutterBottom>
                    ĐIỀN THÔNG TIN THANH TOÁN
                </Typography>
                <Row className="mt-3">
                    <Col md="7" xl="8">
                        <Paper
                            className="mb-3"
                            style={{ width: "100%", height: "auto", padding: "1.5rem" }}
                        >
                            <TextField
                                className="mb-3"
                                fullWidth
                                error={false}
                                id="Name"
                                label="Tên người nhận hàng"
                                helperText=""
                                variant="outlined"
                                value={this.state.user.fullname}
                                onChange={e => this.onChangeState(this.state.user, { fullname: e.target.value })}
                            />
                            <Row>
                                <Col xs={12} sm={6}>
                                    <TextField
                                        className="mb-3"
                                        fullWidth
                                        error={false}
                                        id="Email"
                                        label="Email"
                                        helperText={""}
                                        variant="outlined"
                                        disabled
                                        value={this.state.user.email}
                                    />
                                </Col>
                                <Col xs={12} sm={6}>
                                    <TextField
                                        className="mb-3"
                                        fullWidth
                                        error={false}
                                        id="Phone"
                                        label="Điện thoại"
                                        helperText=""
                                        variant="outlined"
                                        type="number"
                                        value={this.state.user.phone}
                                        onChange={e => this.onChangeState(this.state.user, { phone: e.target.value })}
                                    />
                                </Col>
                            </Row>
                            <TextField
                                className="mb-3"
                                fullWidth
                                error={false}
                                id="Address"
                                label="Địa chỉ giao hàng"
                                helperText=""
                                variant="outlined"
                                value={this.state.user.address}
                                onChange={e => this.onChangeState(this.state.user, { address: e.target.value })}
                            />
                            <TextField
                                className="mb-3"
                                fullWidth
                                error={false}
                                id="Order-note"
                                label="Ghi chú cho đơn hàng"
                                helperText=""
                                variant="outlined"
                                multiline
                                rows="3"
                                value={this.state.user.guide_info}
                                onChange={e => this.onChangeState(this.state.user, { guide_info: e.target.value })}
                            />
                        </Paper>
                    </Col>
                    <Col md="5" xl="4">
                        <MenuCart isConfirm={true} user={this.state.user}/>
                    </Col>
                </Row>
            </div>
        )
    }
}

export default Order
