import React, { useState, useContext } from 'react';
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
import Checkbox from '@material-ui/core/Checkbox';

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
        if (value === "nh???") return `C??? ${value} - 7 inch`
        else if (value === "v???a") return `C??? ${value} - 9 inch`
        else return `C??? ${value} - 12 inch`
    })
    const displayCrust = ["????? m???ng", "????? v???a", "????? d??y"]
    const displayCheese = ["Th??m ph?? mai", "G???p ????i ph?? mai", "G???p ba ph?? mai"]

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
        if (item.size === "") onErrorChange({ size: "B???n ch??a ch???n c??? b??nh" })
        if (!item.option.some((val) => displayCrust.includes(val))) onErrorChange({ crust: "B???n ch??a ch???n ????? b??nh" })
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
                T??y ch???nh b??nh c???a b???n
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
                                <FormLabel component="legend">Ch???n c??? b??nh</FormLabel>
                                <FormHelperText>{error.size !== "" ? error.size : (item.size === "nh???" ? `${props.price-130000} ???` : (item.size === "v???a" ? `${props.price-60000} ???` : `${props.price} ???`))}</FormHelperText>
                                <RadioGroup
                                    row
                                    aria-label="position"
                                    name="position"
                                    defaultValue="top"
                                    onChange={(e) => {
                                        onItemChange({
                                            size: e.target.value,
                                            price: e.target.value === "l???n" ? props.price + item.extraPrice : props.price + item.extraPrice - (e.target.value === "v???a" ? 60000 : 130000)
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
                                <FormLabel component="legend">Ch???n ????? b??nh</FormLabel>
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
                                <FormLabel component="legend">T??y ch???n th??m ph?? mai</FormLabel>
                                <FormHelperText className="m-0">
                                    {item.option.includes("Th??m ph?? mai") ? "Th??m: 15.000 ???" : (item.option.includes("G???p ????i ph?? mai") ? "Th??m: 25.000 ???" : (item.option.includes("G???p ba ph?? mai") ? "Th??m: 35.000 ???" : "Th??m: 0 ???"))}
                                </FormHelperText>
                                {/* <RadioGroup
                                    row
                                    aria-label="position"
                                    name="position"
                                    defaultValue="top"
                                    onChange={e => {
                                        const newAmount = e.target.value === "Th??m ph?? mai" ? 15000 : (e.target.value === "G???p ????i ph?? mai" ? 25000 : (e.target.value === "G???p ba ph?? mai" ? 35000 : 0))
                                        onItemChange({
                                            option: e.target.value !== "B??? ch???n" ? [...item.option.filter((item) => !displayCheese.includes(item)), e.target.value] : [...item.option.filter((item) => !displayCheese.includes(item))],
                                            price: item.price + (newAmount - item.extraPrice) + (item.option.includes("Vi???n ph?? mai") ? 45000 : 0),
                                            extraPrice: newAmount + (item.option.includes("Vi???n ph?? mai") ? 45000 : 0)
                                        })
                                    }}
                                >
                                    {
                                        displayCheese.map((value) => (
                                            <FormControlLabel key={value} value={value} control={<Radio color="primary" onChange={e => !e.target.check} />} label={value} />
                                        ))
                                    }
                                </RadioGroup> */}
                                {
                                    displayCheese.map((value) => (
                                        <FormControlLabel
                                            value={value}
                                            control={
                                                <Checkbox
                                                    color="primary"
                                                    checked={item.option.includes(value)}
                                                    onChange={e => {
                                                        const newAmount = e.target.checked ? (e.target.value === "Th??m ph?? mai" ? 15000 : (e.target.value === "G???p ????i ph?? mai" ? 25000 : (e.target.value === "G???p ba ph?? mai" ? 35000 : 0))) : 0;
                                                        onItemChange({
                                                            option: e.target.checked ? [...item.option.filter((item) => !displayCheese.includes(item)), e.target.value] : [...item.option.filter((item) => !displayCheese.includes(item))],
                                                            price: item.price + (newAmount - item.extraPrice) + (item.option.includes("Vi???n ph?? mai") ? 45000 : 0),
                                                            extraPrice: newAmount + (item.option.includes("Vi???n ph?? mai") ? 45000 : 0)
                                                        })
                                                    }}
                                                />
                                            }
                                            label={value}
                                            labelPlacement="end"
                                        />
                                    ))
                                }
                            </FormControl>
                            <FormControl className="d-block" component="fieldset">
                                <FormLabel component="legend">T??y ch???n vi???n</FormLabel>
                                <FormHelperText className="m-0">
                                    {item.option.includes("Vi???n ph?? mai") ? "Th??m: 45.000 ???" : "Th??m: 0 ???"}
                                </FormHelperText>
                                {/* <RadioGroup
                                    row
                                    aria-label="position"
                                    name="position"
                                    defaultValue="top"
                                    onChange={e => {
                                        const newAmount = e.target.value === "Vi???n ph?? mai" ? 45000 : (item.option.includes("Vi???n ph?? mai") ? -45000 : 0)
                                        onItemChange({
                                            option: e.target.value !== "B??? ch???n" ? [...item.option.filter((item) => item !== "Vi???n ph?? mai"), e.target.value] : [...item.option.filter((item) => item !== "Vi???n ph?? mai")],
                                            price: item.price + newAmount,
                                            extraPrice: newAmount + item.extraPrice
                                        })
                                    }}
                                >
                                    <FormControlLabel value="Vi???n ph?? mai" control={<Radio color="primary" />} label="Vi???n ph?? mai" />
                                    <FormControlLabel value="B??? ch???n" control={<Radio color="primary" />} label="B??? ch???n" />
                                </RadioGroup> */}
                                <FormControlLabel
                                    value="Vi???n ph?? mai"
                                    control={
                                        <Checkbox
                                            color="primary"
                                            checked={item.option.includes("Vi???n ph?? mai")}
                                            onChange={e => {
                                                const newAmount = e.target.checked ? 45000 : -45000
                                                onItemChange({
                                                    option: e.target.checked ? [...item.option.filter((item) => item !== "Vi???n ph?? mai"), e.target.value] : [...item.option.filter((item) => item !== "Vi???n ph?? mai")],
                                                    price: item.price + newAmount,
                                                    extraPrice: newAmount + item.extraPrice
                                                })
                                            }}
                                        />
                                    }
                                    label="Vi???n ph?? mai"
                                    labelPlacement="end"
                                />
                            </FormControl>
                        </Grid>
                    </Grid>
                </DialogContent>
                <DialogActions>
                    <Button autoFocus type="submit" color="primary">
                        Th??m v??o ????n h??ng
                    </Button>
                </DialogActions>
            </form>
        </Dialog>
    );
}