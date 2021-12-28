import React, { useState,  useContext } from 'react';
import { withStyles } from '@material-ui/core/styles';
import Button from '@material-ui/core/Button';
import Dialog from '@material-ui/core/Dialog';
import MuiDialogTitle from '@material-ui/core/DialogTitle';
import MuiDialogContent from '@material-ui/core/DialogContent';
import MuiDialogActions from '@material-ui/core/DialogActions';
import IconButton from '@material-ui/core/IconButton';
import CloseIcon from '@material-ui/icons/Close';
import Typography from '@material-ui/core/Typography';
import Grow from '@material-ui/core/Grow';
import Grid from '@material-ui/core/Grid';
import Radio from '@material-ui/core/Radio';
import RadioGroup from '@material-ui/core/RadioGroup';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import FormHelperText from '@material-ui/core/FormHelperText';
import FormControl from '@material-ui/core/FormControl';
import FormLabel from '@material-ui/core/FormLabel';
import { hostURLStatic } from '../../config'
import { CartContext } from '../../context/CartContext'

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

export default function ModalPizzaOption(props) {
    const { isOpen, onToggle, description = [[], []], size = [] } = props
    const { addCartItem } = useContext(CartContext)
    const [error, setError] = useState({
        size: "",
        crust: ""
    })
    const [item, setItem] = useState({
        product_id: "",
        category: "",
        name: "",
        size: "",
        option: [],
        price: 0,
        extraPrice: 0,
        quantity: 1
    })
    const displaySize = size.map((value) => {
        if (value === "nhỏ") return `Cỡ ${value} - 7 inch`
        else if (value === "vừa") return `Cỡ ${value} - 9 inch`
        else return `Cỡ ${value} - 12 inch`
    })
    const displayCrust = ["Đế mỏng", "Đế vừa", "Đế dày"]
    const displayCheese = ["Thêm phô mai", "Gấp đôi phô mai", "Gấp ba phô mai", "Bỏ chọn"]

    const onItemChange = object => {
        setItem(item => Object.assign({ ...item }, object))
    }

    const onErrorChange = object => {
        setError(error => Object.assign({ ...error }, object))
    }

    if (isOpen && item.product_id !== props.id) {
        onItemChange({
            product_id: props.id,
            category: props.category,
            name: props.name,
            size: "",
            option: [],
            price: props.price,
            extraPrice: 0,
            quantity: 1
        })
    }

    const closeModal = () => {
        onToggle()
        onItemChange({
            product_id: ""
        })
        onErrorChange({
            size: "",
            crust: ""
        })
    }

    const addItem = (event) => {
        event.preventDefault()
        if (item.size === "") onErrorChange({ size: "Bạn chưa chọn cỡ bánh" })
        if (!item.option.some((val) => displayCrust.includes(val))) onErrorChange({ crust: "Bạn chưa chọn đế bánh" })
        if (item.size !== "" && item.option.some((val) => displayCrust.includes(val))) {
            addCartItem(item)
            closeModal()
        }
    }

    // console.log(props)
    // useEffect(() => console.log(item))
    return (
        <Dialog
            onClose={closeModal}
            transitionDuration={{ enter: 200, exit: 500 }}
            TransitionComponent={Grow}
            aria-labelledby="customized-dialog-title"
            open={isOpen}
            scroll="body"
            maxWidth="md"
        >
            <DialogTitle id="customized-dialog-title" onClose={closeModal}>
                Tùy chỉnh bánh của bạn
            </DialogTitle>
            <form onSubmit={addItem}>
                <DialogContent dividers>
                    <Grid container>
                        <Grid className="pr-2" xs={12} md={5} item>
                            <Typography
                                className="item-product-name"
                                variant="h5"
                                color="textSecondary"
                                style={{ fontWeight: "800", textTransform: "uppercase" }}
                                gutterBottom
                            >
                                {props.name}
                            </Typography>
                            <Typography variant="body2" gutterBottom align="justify">
                                {description[1]}
                            </Typography>
                            <div className="text-center">
                                <img src={`${hostURLStatic}/${props.image}`} alt="pizza" className="card-img-top product-img" />
                                <p className="pizza-price">
                                    {new Intl.NumberFormat('de-DE', { style: 'currency', currency: 'VND' }).format(item.price)}
                                </p>
                            </div>
                        </Grid>
                        <Grid className="pl-2" xs={12} md={7} item>
                            <FormControl required className="d-block" error={error.size !== ""} component="fieldset">
                                <FormLabel component="legend">Chọn cỡ bánh</FormLabel>
                                <FormHelperText>{error.size}</FormHelperText>
                                <RadioGroup
                                    row
                                    aria-label="position"
                                    name="position"
                                    defaultValue="top"
                                    onChange={(e) => {
                                        onItemChange({
                                            size: e.target.value,
                                            price: e.target.value === "lớn" ? props.price + item.extraPrice : props.price + item.extraPrice - (e.target.value === "vừa" ? 60000 : 130000)
                                        })
                                        onErrorChange({ size: "" })
                                    }}
                                >
                                    {
                                        displaySize.map((value, index) => (
                                            <FormControlLabel key={value} value={size[index]} control={<Radio color="primary" />} label={value} />
                                        ))
                                    }
                                </RadioGroup>
                            </FormControl>
                            <FormControl required className="d-block" error={error.crust !== ""} component="fieldset">
                                <FormLabel component="legend">Chọn đế bánh</FormLabel>
                                <FormHelperText>{error.crust}</FormHelperText>
                                <RadioGroup
                                    row
                                    aria-label="position"
                                    name="position"
                                    defaultValue="top"
                                    onChange={e => {
                                        onItemChange({ option: [e.target.value, ...item.option.filter((item) => !displayCrust.includes(item))] })
                                        onErrorChange({ crust: "" })
                                    }}
                                >
                                    {
                                        displayCrust.map((value) => (
                                            <FormControlLabel key={value} value={value} control={<Radio color="primary" />} label={value} />
                                        ))
                                    }
                                </RadioGroup>
                            </FormControl>
                            <FormControl className="d-block" component="fieldset">
                                <FormLabel component="legend">Tùy chọn thêm phô mai</FormLabel>
                                <FormHelperText className="m-0">
                                    {item.option.includes("Thêm phô mai") ? "Thêm: 15.000 ₫" : (item.option.includes("Gấp đôi phô mai") ? "Thêm: 25.000 ₫" : (item.option.includes("Gấp ba phô mai") ? "Thêm: 35.000 ₫" : "Thêm: 0 ₫"))}
                                </FormHelperText>
                                <RadioGroup
                                    row
                                    aria-label="position"
                                    name="position"
                                    defaultValue="top"
                                    onChange={e => {
                                        const newAmount = e.target.value === "Thêm phô mai" ? 15000 : (e.target.value === "Gấp đôi phô mai" ? 25000 : (e.target.value === "Gấp ba phô mai" ? 35000 : 0))
                                        onItemChange({
                                            option: e.target.value !== "Bỏ chọn" ? [...item.option.filter((item) => !displayCheese.includes(item)), e.target.value] : [...item.option.filter((item) => !displayCheese.includes(item))],
                                            price: item.price + (newAmount - item.extraPrice) + (item.option.includes("Viền phô mai") ? 45000 : 0),
                                            extraPrice: newAmount + (item.option.includes("Viền phô mai") ? 45000 : 0)
                                        })
                                    }}
                                >
                                    {
                                        displayCheese.map((value) => (
                                            <FormControlLabel key={value} value={value} control={<Radio color="primary" onChange={e => !e.target.check} />} label={value} />
                                        ))
                                    }
                                </RadioGroup>
                            </FormControl>
                            <FormControl className="d-block" component="fieldset">
                                <FormLabel component="legend">Tùy chọn viền</FormLabel>
                                <FormHelperText className="m-0">
                                    {item.option.includes("Viền phô mai") ? "Thêm: 45.000 ₫" : "Thêm: 0 ₫"}
                                </FormHelperText>
                                <RadioGroup
                                    row
                                    aria-label="position"
                                    name="position"
                                    defaultValue="top"
                                    onChange={e => {
                                        const newAmount = e.target.value === "Viền phô mai" ? 45000 : (item.option.includes("Viền phô mai") ? -45000 : 0)
                                        onItemChange({
                                            option: e.target.value !== "Bỏ chọn" ? [...item.option.filter((item) => item !== "Viền phô mai"), e.target.value] : [...item.option.filter((item) => item !== "Viền phô mai")],
                                            price: item.price + newAmount,
                                            extraPrice: newAmount + item.extraPrice
                                        })
                                    }}
                                >
                                    <FormControlLabel value="Viền phô mai" control={<Radio color="primary" />} label="Viền phô mai" />
                                    <FormControlLabel value="Bỏ chọn" control={<Radio color="primary" />} label="Bỏ chọn" />
                                </RadioGroup>
                            </FormControl>
                        </Grid>
                    </Grid>
                </DialogContent>
                <DialogActions>
                    <Button autoFocus type="submit" color="primary">
                        Thêm vào đơn hàng
                    </Button>
                </DialogActions>
            </form>
        </Dialog>
    );
}