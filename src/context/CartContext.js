import React, { Component, createContext } from 'react'

export const CartContext = createContext()

class CartContextProvider extends Component {

    state = {
        total_price: 0,
        total_quantity: 0,
        item_list: []
    }

    onCartContextChange = object => {
        this.setState(Object.assign(this.state, object))
    }

    addCartItem = (
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
        const cartItem = {
            product_id,
            category,
            name,
            size,
            option,
            price,
            quantity
        }
        let isExisted = false
        this.state.item_list.forEach((item) => {
            if (cartItem.name === item.name && cartItem.category !== "pizza") {
                item.quantity += quantity
                this.onCartContextChange({
                    total_price: this.state.total_price + price,
                    total_quantity: this.state.total_quantity + quantity
                })
                isExisted = true
            } else if (cartItem.name === item.name && cartItem.size === item.size && cartItem.option.some((val) => item.option.includes(val))) {
                item.quantity += quantity
                this.onCartContextChange({
                    total_price: this.state.total_price + price,
                    total_quantity: this.state.total_quantity + quantity
                })
                isExisted = true
            }
        })
        window.localStorage.setItem("cart", JSON.stringify(this.state))
        if (isExisted) return
        this.onCartContextChange({
            total_price: this.state.total_price + price,
            total_quantity: this.state.total_quantity + quantity,
            item_list: [...this.state.item_list, cartItem]
        })
        window.localStorage.setItem("cart", JSON.stringify(this.state))
    }

    deleteItem = (
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
        const cartItem = {
            product_id,
            category,
            name,
            size,
            option,
            price,
            quantity
        }
        this.onCartContextChange({
            total_price: this.state.total_price - (price * quantity),
            total_quantity: this.state.total_quantity - quantity,
            item_list: this.state.item_list.filter((item) => JSON.stringify(item) !== JSON.stringify(cartItem))
        })
        window.localStorage.setItem("cart", JSON.stringify(this.state))
        if (this.state.total_quantity === 0 && window.location.pathname === "/Order") window.location.pathname = "/Menu"
    }

    modifyItem = (
        {
            product_id = "",
            category = "",
            name = "",
            size = "",
            option = [],
            price = 0,
            quantity = 0
        } = {},
        value
    ) => {
        const cartItem = {
            product_id,
            category,
            name,
            size,
            option,
            price,
            quantity
        }
        value = Math.max(Number(1), Math.min(Number(99), Number(value)));
        // if (value === 0) {
        //     this.deleteItem(cartItem)
        //     return
        // }

        const currentItem = this.state.item_list.reduce((tol, cur) => {
            if (JSON.stringify(cur) === JSON.stringify(cartItem)) return cur
            return tol
        }, {})
        this.onCartContextChange({
            total_price: this.state.total_price + ((price * value) - (currentItem.price * currentItem.quantity)),
            total_quantity: this.state.total_quantity + (value - currentItem.quantity),
            item_list: this.state.item_list.map((item) => {
                if (JSON.stringify(item) === JSON.stringify(cartItem)) {
                    item.quantity = value
                }
                return item
            })
        })
        window.localStorage.setItem("cart", JSON.stringify(this.state))
    }

    componentDidMount() {
        const currentCart = JSON.parse(window.localStorage.getItem("cart"))
        if (currentCart != null) this.onCartContextChange(currentCart)
    }

    render() {
        // console.log(this.state)
        return (
            <CartContext.Provider value={{ ...this.state, addCartItem: this.addCartItem, deleteItem: this.deleteItem, modifyItem: this.modifyItem }}>
                {this.props.children}
            </CartContext.Provider>
        )
    }
}

export default CartContextProvider
