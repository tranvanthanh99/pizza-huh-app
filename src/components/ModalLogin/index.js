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
import LockIcon from '@material-ui/icons/Lock';
import AccountBoxIcon from '@material-ui/icons/AccountBox';
import CircularProgress from '@material-ui/core/CircularProgress';
import Alert from '@material-ui/lab/Alert';
import Link from '@material-ui/core/Link';
import {
    Row,
    Col
} from 'reactstrap'
import { login } from '../../action/user'

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

class ModalLogin extends Component {

    state = {
        email: "",
        password: "",
        confirmPassword: "",
        firstname: "",
        lastname: "",
        phone: "",
        address: "",
        loading: false,
        isDone: 'null',
        isEmailWrong: false
    }

    onChangeState = object => {
        this.setState(Object.assign(this.state, object));
    };

    toggleLoading = () => {
        this.setState({
            loading: !this.state.loading
        });
    };

    onLogin = async () => {
        this.toggleLoading();
        setTimeout(async () => {
            const res = await login(
                this.state.email,
                this.state.password,
            )
            this.toggleLoading();
            this.onChangeState({
                isDone: res.password !== false ? true : false,
                isEmailWrong: res.email === false && true
            })
            if (res.password !== false) {
                window.localStorage.setItem("user", JSON.stringify(res))
                this.props.login(res)
                setTimeout(() => {
                    this.onToggle()
                    window.location.pathname = "/"
                }, 1500)
            }
        }, 500);
    };
    setStatetoOrigin = () => {
        this.setState({
            email: "",
            password: "",
            confirmPassword: "",
            firstname: "",
            lastname: "",
            phone: "",
            address: "",
            loading: false,
            isDone: 'null',
            isEmailWrong: false
        });
    };
    onToggle = () => {
        this.props.onToggle();
        this.setStatetoOrigin();
    };

    onSubmit = async e => {
        e.preventDefault()
        await this.onLogin()
    }

    render() {
        return (
            <div>
                <Dialog
                    TransitionComponent={Transition}
                    onClose={this.onToggle}
                    aria-labelledby="customized-dialog-title"
                    open={this.props.isOpen}
                >
                    <DialogTitle id="customized-dialog-title" onClose={this.onToggle}>
                        Đăng nhập
                    </DialogTitle>
                    <form onSubmit={this.onSubmit}>
                        <DialogContent dividers>
                            {
                                this.state.isDone === true && <Alert className="mb-3" color="success">Đăng nhập thành công</Alert>
                            }
                            <Row>
                                <Col className="mb-2" sm={12}>
                                    <TextField
                                        fullWidth
                                        error={this.state.isEmailWrong}
                                        id="Email"
                                        label={<AccountBoxIcon fontSize="small" />}
                                        helperText={this.state.isEmailWrong && "Email không hợp lệ"}
                                        variant="outlined"
                                        type="email"
                                        placeholder="Email *"
                                        value={this.state.email}
                                        onChange={e => this.onChangeState({
                                            email: e.target.value,
                                            isEmailWrong: false
                                        })}
                                    />
                                </Col>
                                <Col className="mb-2" sm={12}>
                                    <TextField
                                        fullWidth
                                        error={!this.state.isDone}
                                        id="Password"
                                        label={<LockIcon fontSize="small" />}
                                        helperText={!this.state.isDone && "Sai mật khẩu"}
                                        variant="outlined"
                                        placeholder="Mật Khẩu *"
                                        type="password"
                                        value={this.state.password}
                                        onChange={e => this.onChangeState({
                                            password: e.target.value,
                                            isDone: 'null'
                                        })}
                                    />
                                </Col>
                            </Row>
                            <Link
                                className="float-right"
                                onClick={e => {
                                    e.preventDefault()
                                    this.props.switchToModalRegister()
                                    this.setStatetoOrigin()
                                }}
                                variant="body2"
                            >
                                Chưa có tài khoản? Đăng kí ngay.
                            </Link>
                        </DialogContent>
                        <DialogActions>
                            {/* <Button
                                autoFocus
                                onClick={() => {
                                    this.props.switchToModalRegister()
                                    this.setStatetoOrigin()
                                }}
                                color="primary"
                            >
                                Đăng ký
                            </Button> */}
                            {
                                this.state.loading ?
                                    <div style={{ width: "103px", textAlign: "center" }}>
                                        <CircularProgress size={30} />
                                    </div>
                                    :
                                    <Button autoFocus type="submit" onClick={this.onSubmit} color="primary" disabled={this.state.loading}>
                                        Đăng nhập
                                </Button>
                            }
                        </DialogActions>
                    </form>

                </Dialog>
            </div >
        );
    }
}
export default ModalLogin