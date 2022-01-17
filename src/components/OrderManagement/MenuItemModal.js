import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Button from '@material-ui/core/Button';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
// import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';
import IconButton from '@material-ui/core/IconButton';
import AddRoundedIcon from '@material-ui/icons/AddRounded';
import InputLabel from '@material-ui/core/InputLabel';
import MenuItem from '@material-ui/core/MenuItem';
import FormControl from '@material-ui/core/FormControl';
import Select from '@material-ui/core/Select';

import ItemCard from './ItemCard'

import { getProduct } from '../../action/product';


const useStyles = makeStyles((theme) => ({
    formControl: {
        //   margin: theme.spacing(1),
        minWidth: 120,
        marginLeft: "auto",
    },
    dialogTitle: {
        display: "flex",
        alignItems: "center",
    }
}));

export default function MenuItemModal(props) {
    const { itemList, editItemList } = props;
    const [open, setOpen] = React.useState(false);
    const [scroll, setScroll] = React.useState('paper');
    const [category, setCategory] = React.useState('pizza')
    const [products, setProducts] = React.useState([])
    const classes = useStyles();

    const handleClickOpen = (scrollType) => () => {
        setOpen(true);
        setScroll(scrollType);
    };

    const handleClose = () => {
        setOpen(false);
    };

    const changeCategory = (e) => {
        // console.log(e.target.value)
        setCategory(e.target.value)
    }

    const fetchProduct = async (item) => {
        const res = await getProduct(item)
        setProducts(res.product)
    }

    const addItem = (
        {
            product_id = "",
            category = "",
            name = "",
            size = "",
            option = [],
            price = 0,
            quantity = 0
        } = {}
    ) => {
        const orderItem = {
            product_id,
            category,
            name,
            size,
            option,
            price,
            quantity
        }
        let isExisted = false
        editItemList(
            itemList.map((item) => {
                if (orderItem.name === item.name && orderItem.category !== "pizza") {
                    item.quantity += quantity
                    isExisted = true
                } else if (orderItem.name === item.name && orderItem.size === item.size && orderItem.option.some((val) => item.option.includes(val))) {
                    item.quantity += quantity
                    isExisted = true
                }
                return item;
            })
        )
        if (!isExisted) {
            editItemList([...itemList, orderItem])
        }
        handleClose()
    }

    const descriptionElementRef = React.useRef(null);
    React.useEffect(() => {
        if (open) {
            const { current: descriptionElement } = descriptionElementRef;
            if (descriptionElement !== null) {
                descriptionElement.focus();
            }
        }
    }, [open]);

    React.useEffect(() => {
        fetchProduct(category);
    }, [category])

    return (
        <div>
            <IconButton
                className="float-right"
                size="medium"
                color="primary"
                onClick={handleClickOpen('paper')}
            >
                <AddRoundedIcon fontSize="small" />
            </IconButton>
            <Dialog
                open={open}
                onClose={handleClose}
                scroll={scroll}
                aria-labelledby="scroll-dialog-title"
                aria-describedby="scroll-dialog-description"
                // maxWidth="sm"
                fullWidth={true}
            >
                <DialogTitle id="scroll-dialog-title">
                    <div className={classes.dialogTitle}>
                        <span>Danh sách sản phẩm</span>
                        <FormControl className={classes.formControl}>
                            <InputLabel id="demo-simple-select-label">Loại</InputLabel>
                            <Select
                                labelId="demo-simple-select-label"
                                id="demo-simple-select"
                                value={category}
                                onChange={changeCategory}
                            >
                                <MenuItem value={"pizza"}>Pizza</MenuItem>
                                <MenuItem value={"sidedish"}>Món ăn kèm</MenuItem>
                                <MenuItem value={"drink"}>Giải khát</MenuItem>
                                <MenuItem value={"dessert"}>Tráng miệng</MenuItem>
                            </Select>
                        </FormControl>
                    </div>
                </DialogTitle>
                <DialogContent dividers={scroll === 'paper'}>
                    {products.map((e, k) => <ItemCard key={k} product={e} addItem={addItem}/>)}
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleClose} color="primary">
                        Hủy
                    </Button>
                </DialogActions>
            </Dialog>
        </div>
    );
}
