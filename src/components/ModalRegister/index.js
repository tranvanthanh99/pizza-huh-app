import React, { Component } from 'react';
import { withStyles } from '@material-ui/core/styles';
import Button from '@material-ui/core/Button';
import Dialog from '@material-ui/core/Dialog';
import MuiDialogTitle from '@material-ui/core/DialogTitle';
import MuiDialogContent from '@material-ui/core/DialogContent';
import MuiDialogActions from '@material-ui/core/DialogActions';
import IconButton from '@material-ui/core/IconButton';
import CloseIcon from '@material-ui/icons/Close';
import Typography from '@material-ui/core/Typography';
import Slide from '@material-ui/core/Slide';
import TextField from '@material-ui/core/TextField';
import CircularProgress from '@material-ui/core/CircularProgress';
import Alert from '@material-ui/lab/Alert';
import {
    Row,
    Col
} from 'reactstrap'
import { register } from '../../action/user'


const Transition = React.forwardRef(function Transition(props, ref) {
    return <Slide direction="right" ref={ref} {...props} />;
});
const styles = (theme) => ({
    root: {
        margin: 0,
        padding: theme.spacing(2),
    },
    closeButton: {
        position: 'absolute',
        right: theme.spacing(1),
        top: theme.spacing(1),
        color: theme.palette.grey[500],
    },
});

const DialogTitle = withStyles(styles)((props) => {
    const { children, classes, onClose, ...other } = props;
    return (
        <MuiDialogTitle disableTypography className={classes.root} {...other}>
            <Typography variant="h6">{children}</Typography>
            {onClose ? (
                <IconButton aria-label="close" className={classes.closeButton} onClick={onClose}>
                    <CloseIcon />
                </IconButton>
            ) : null}
        </MuiDialogTitle>
    );
});

const DialogContent = withStyles((theme) => ({
    root: {
        padding: theme.spacing(2),
    },
}))(MuiDialogContent);

const DialogActions = withStyles((theme) => ({
    root: {
        margin: 0,
        padding: theme.spacing(1),
    },
}))(MuiDialogActions);

class ModalRegister extends Component {

    state = {
        fields: {
            email: "",
            password: "",
            confirmPassword: "",
            firstname: "",
            lastname: "",
            phone: "",
            address: "",
            loading: false,
            isDone: 'null'
        },
        errors: {}
    }

    onChangeState = (stateItem, object) => {
        this.setState(Object.assign(stateItem, object));
    };

    toggleLoading = () => {
        this.onChangeState(this.state.fields, {
            loading: !this.state.fields.loading
        });
    };

    onRegister = async () => {
        this.toggleLoading();
        setTimeout(async () => {
            let res = null
            this.validateInput()
            if (this.isValid()) {
                res = await register(
                    this.state.fields.email,
                    this.state.fields.password,
                    this.state.fields.firstname,
                    this.state.fields.lastname,
                    this.state.fields.phone,
                    this.state.fields.address
                )
                if (res.success) setTimeout(() => this.onToggle(), 1500)
            }
            this.toggleLoading();
            if (res != null) {
                this.onChangeState(this.state.fields, {
                    isDone: res.success ? true : false
                })
                this.onChangeState(this.state.errors, {
                    email: !res.success ? "Email đã tồn tại hoặc không hợp lệ" : null
                })
            }

        }, 500);
    };

    setStatetoOrigin = () => {
        this.setState({
            fields: {
                email: "",
                password: "",
                confirmPassword: "",
                firstname: "",
                lastname: "",
                phone: "",
                address: "",
                loading: false,
                isDone: 'null'
            },
            errors: {}
        });
    };

    onToggle = () => {
        this.props.onToggle();
        this.setStatetoOrigin();
    };

    onSubmit = async e => {
        e.preventDefault()
        await this.onRegister()
    }

    validateInput = () => {
        let errors = {}
        if (this.state.fields.email.trim() === "") errors["email"] = "vui lòng nhập email"
        if (this.state.fields.password.trim() === "") errors["password"] = "vui lòng nhập mật khẩu"
        if (this.state.fields.confirmPassword.trim() === "") errors["confirmPassword"] = "vui lòng nhập mật khẩu"
        if (this.state.fields.confirmPassword !== this.state.fields.password) errors["confirmPassword"] = "mật khẩu không hợp lệ"
        if (this.state.fields.firstname.trim() === "") errors["firstname"] = "vui lòng nhập tên"
        if (this.state.fields.lastname.trim() === "") errors["lastname"] = "vui lòng nhập họ"
        if (this.state.fields.phone.trim() === "") errors["phone"] = "vui lòng nhập số điện thoại"
        if (this.state.fields.address.trim() === "") errors["address"] = "vui lòng nhập địa chỉ"
        this.onChangeState(this.state.errors, errors)
    }

    isValid = () => {
        if (this.state.errors.password != null) return false
        if (this.state.errors.confirmPassword != null) return false
        if (this.state.errors.firstname != null) return false
        if (this.state.errors.lastname != null) return false
        if (this.state.errors.phone != null) return false
        if (this.state.errors.address != null) return false
        return true
    }

    render() {
        return (
            <div>
                <Dialog
                    TransitionComponent={Transition}
                    onClose={this.onToggle}
                    aria-labelledby="customized-dialog-title"
                    open={this.props.isOpen}
                    scroll="body"
                >
                    <DialogTitle id="customized-dialog-title" onClose={this.onToggle}>
                        Đăng ký
                    </DialogTitle>
                    <form onSubmit={this.onSubmit}>
                        <DialogContent dividers>
                            {
                                this.state.fields.isDone === true && <Alert className="mb-3" color="success">Tạo tài khoản thành công</Alert>
                            }
                            {
                                this.state.fields.isDone === false && <Alert className="mb-3" color="error">Tạo tài khoản thất bại</Alert>
                            }
                            <Row>
                                <Col className="mb-3" sm={12}>
                                    <TextField
                                        fullWidth
                                        error={this.state.errors.email != null}
                                        id="Email"
                                        label="Email *"
                                        helperText={this.state.errors.email}
                                        variant="outlined"
                                        type="email"
                                        value={this.state.fields.email}
                                        onChange={e => {
                                            this.onChangeState(this.state.fields, {
                                            email: e.target.value,
                                            isDone: 'null'
                                            })
                                            this.onChangeState(this.state.errors, {
                                                email: null
                                            })
                                        }}
                                    />
                                </Col>
                                <Col className="mb-3" sm={6}>
                                    <TextField
                                        fullWidth
                                        error={this.state.errors.password != null}
                                        id="Password"
                                        label="Mật khẩu *"
                                        helperText={this.state.errors.password}
                                        variant="outlined"
                                        type="password"
                                        value={this.state.fields.password}
                                        onChange={e => {
                                            this.onChangeState(this.state.fields, {
                                                password: e.target.value
                                            })
                                            this.onChangeState(this.state.errors, {
                                                password: null
                                            })
                                        }}
                                    />
                                </Col>
                                <Col className="mb-3" sm={6}>
                                    <TextField
                                        fullWidth
                                        error={this.state.fields.confirmPassword !== this.state.fields.password}
                                        id="Confirm-password"
                                        label="Xác nhận mật khẩu *"
                                        helperText={this.state.fields.confirmPassword !== this.state.fields.password && "mật khẩu không hợp lệ"}
                                        variant="outlined"
                                        type="password"
                                        value={this.state.fields.confirmPassword}
                                        onChange={e => this.onChangeState(this.state.fields, {
                                            confirmPassword: e.target.value
                                        })}
                                    />
                                </Col>
                                <Col className="mb-3" sm={12}>
                                    <TextField
                                        fullWidth
                                        error={this.state.errors.phone != null}
                                        id="Phone"
                                        label="Điện thoại *"
                                        helperText={this.state.errors.phone}
                                        variant="outlined"
                                        type="number"
                                        value={this.state.fields.phone}
                                        onChange={e => {
                                            this.onChangeState(this.state.fields, {
                                                phone: e.target.value
                                            })
                                            this.onChangeState(this.state.errors, {
                                                phone: null
                                            })
                                        }}
                                    />
                                </Col>
                                <Col className="mb-3" sm={12}>
                                    <TextField
                                        fullWidth
                                        error={this.state.errors.firstname != null}
                                        id="First-name"
                                        label="Tên *"
                                        helperText={this.state.errors.firstname}
                                        variant="outlined"
                                        value={this.state.fields.firstname}
                                        onChange={e => {
                                            this.onChangeState(this.state.fields, {
                                                firstname: e.target.value
                                            })
                                            this.onChangeState(this.state.errors, {
                                                firstname: null
                                            })
                                        }}
                                    />
                                </Col>
                                <Col className="mb-3" sm={12}>
                                    <TextField
                                        fullWidth
                                        error={this.state.errors.lastname != null}
                                        id="Last-name"
                                        label="Họ *"
                                        helperText={this.state.errors.lastname}
                                        variant="outlined"
                                        value={this.state.fields.lastname}
                                        onChange={e => {
                                            this.onChangeState(this.state.fields, {
                                                lastname: e.target.value
                                            })
                                            this.onChangeState(this.state.errors, {
                                                lastname: null
                                            })
                                        }}
                                    />
                                </Col>
                                <Col className="mb-3" sm={12}>
                                    <TextField
                                        fullWidth
                                        error={this.state.errors.address != null}
                                        id="outlined-error-helper-text"
                                        label="Địa chỉ giao hàng *"
                                        helperText={this.state.errors.address}
                                        variant="outlined"
                                        value={this.state.fields.address}
                                        onChange={e => {
                                            this.onChangeState(this.state.fields, {
                                                address: e.target.value
                                            })
                                            this.onChangeState(this.state.errors, {
                                                address: null
                                            })
                                        }}
                                    />
                                </Col>
                            </Row>
                        </DialogContent>
                        <DialogActions>
                            {
                                this.state.loading ?
                                    <div style={{ width: "103px", textAlign: "center" }}>
                                        <CircularProgress size={30} />
                                    </div>
                                    :
                                    <Button autoFocus type="submit" onClick={this.onSubmit} color="primary" disabled={this.state.fields.loading}>
                                        Đăng Ký
                                </Button>
                            }
                        </DialogActions>
                    </form>
                </Dialog>
            </div >
        );
    }
}
export default ModalRegister