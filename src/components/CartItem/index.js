import React, { Component } from 'react'
import {
    TextField,
    IconButton,
    Typography
} from '@material-ui/core'
import DeleteIcon from '@material-ui/icons/Delete';
import ClearIcon from '@material-ui/icons/Clear';
import RemoveIcon from '@material-ui/icons/Remove';
import AddIcon from '@material-ui/icons/Add';
import './CartItem.css'

export class CartItem extends Component {

    render() {
        const item = {
            product_id: this.props.product_id,
            category: this.props.category,
            name: this.props.name,
            size: this.props.size,
            option: this.props.option,
            price: this.props.price,
            quantity: this.props.quantity
        }
        return (
            <div className="product">
                <h5 className="pl-2">{this.props.name}</h5>
                <Typography className="pl-2" variant="body2" display="block">
                    {
                        this.props.size === "lớn" ? "Cỡ lớn - 12 inch": (this.props.size === "vừa" ? "Cỡ vừa - 9 inch" : (this.props.size === "nhỏ" ? "Cỡ nhỏ - 7 inch" : ""))
                    }
                    {
                        this.props.option.map((val)=>(
                            ", "+val
                        ))
                    }
                </Typography>
                <div className="d-flex align-items-center justify-content-between">
                    <div className="d-inline-flex">
                        <IconButton color="default" aria-label="delete" onClick={() => this.props.modifyItem(item, item.quantity - 1)}>
                            <RemoveIcon fontSize="small" />
                        </IconButton>
                        <TextField
                            style={{ width: "3.4vw", textAlign: "center" }}
                            id="standard-number"
                            label=""
                            type="number"
                            InputLabelProps={{
                                shrink: true,
                            }}
                            value={this.props.quantity}
                            onChange={(e) => this.props.modifyItem(item, e.target.value)}
                        />
                        <IconButton color="default" aria-label="delete" onClick={() => this.props.modifyItem(item, item.quantity + 1)}>
                            <AddIcon fontSize="small" />
                        </IconButton>
                    </div>
                    <ClearIcon fontSize="small" />
                    <span>{new Intl.NumberFormat('de-DE', { style: 'currency', currency: 'VND' }).format(this.props.price)}</span>
                </div>
                <div className="d-flex justify-content-end">
                    <IconButton color="secondary" aria-label="delete" onClick={() => this.props.deleteItem(item)}>
                        <DeleteIcon fontSize="default" />
                    </IconButton>
                </div>

            </div>
        )
    }
}

export default CartItem
