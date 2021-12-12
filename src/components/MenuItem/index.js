import React, { Component } from 'react'
import {
    Row,
    Col,
    Card,
    CardImg,
    CardText,
    CardBody,
    CardTitle
} from 'reactstrap'
import {
    Button,
    Paper,
    Typography,
    Divider
} from '@material-ui/core';
import ArrowForwardIcon from '@material-ui/icons/ArrowForward';
import ModalPizzaOption from '../ModalPizzaOption'
import './menuItem.css'
import { hostURLStatic } from '../../config'
import { CartContext } from '../../context/CartContext'


export class MenuItem extends Component {

    static contextType = CartContext
    state = {
        category: ["pizza", "sidedish", "drink", "dessert"],
        currentCategory: this.props.categoryIndex,
        products: [],
        productType: [[], []],
        isPizzaOptionOpen: false,
        currentPizzaOption: {}
    }

    fetchProduct = () => {
        this.setState({
            products: this.props.productList,
            productType: this.props.productList.reduce((total, cur) => {
                if (!total[0].includes(cur.product_type)) {
                    total[0] = [...total[0], cur.product_type]
                    total[1] = [...total[1], cur.price]
                }
                return total
            }, [[], []])
        })
    }

    togglePizzaOption = () => {
        this.setState({
            isPizzaOptionOpen: !this.state.isPizzaOptionOpen
        })
    }

    UNSAFE_componentWillReceiveProps() {
        if (this.props.productList !== this.state.products) {
            this.fetchProduct()
            return true
        }
        // return false
    }

    componentDidMount() {
        this.fetchProduct()
    }

    render() {
        const { addCartItem } = this.context
        return (
            <div>
                {this.state.productType[0].map((category, index) => {
                    return (
                        <Paper
                            key={category}
                            data-aos="fade-in"
                            data-aos-once
                            data-aos-offset={45}
                            elevation={0}
                            className="paper-item"
                            style={{ marginBottom: `${index === this.state.productType[0].length - 1 ? "6rem" : "3.5rem"}` }}
                        >
                            <div className="d-lg-flex mb-3 align-items-center" style={{ borderBottom: "1px dotted #04354c" }}>
                                <Typography className="m-0 item-category" variant="h4" color="textSecondary" style={{ fontWeight: "600", textTransform: "uppercase" }}>
                                    {category}
                                </Typography>
                                {
                                    this.state.currentCategory === 0 &&
                                    <>
                                        <Divider className="m-2" orientation="vertical" flexItem />
                                        <ul className="d-flex flex-wrap m-0 p-0 pb-1 pb-lg-0" style={{ listStyleType: "none" }}>
                                            <li className="d-flex align-items-center">
                                                <i className="fas fa-pizza-slice ml-1 mr-1" style={{ fontSize: "x-large", color: "#e31837" }}></i>
                                                <Typography className="m-0 price-category" variant="caption" display="inline">
                                                    Lớn:
                                            <strong>
                                                        {new Intl.NumberFormat('de-DE', { style: 'currency', currency: 'VND' }).format(this.state.productType[1][index])}
                                                    </strong>
                                                </Typography>
                                            </li>
                                            <li className="d-flex align-items-center">
                                                <i className="fas fa-pizza-slice ml-1 mr-1" style={{ fontSize: "large", color: "#e31837" }}></i>
                                                <Typography className="m-0 price-category" variant="caption" display="inline">
                                                    Vừa:
                                            <strong>
                                                        {new Intl.NumberFormat('de-DE', { style: 'currency', currency: 'VND' }).format(this.state.productType[1][index] - 60000)}
                                                    </strong>
                                                </Typography>
                                            </li>
                                            {
                                                category !== "signature" &&
                                                <li className="d-flex align-items-center">
                                                    <i className="fas fa-pizza-slice ml-1 mr-1" style={{ fontSize: "small", color: "#e31837" }}></i>
                                                    <Typography className="m-0 price-category" variant="caption" display="inline">
                                                        Nhỏ:
                                                <strong>
                                                            {new Intl.NumberFormat('de-DE', { style: 'currency', currency: 'VND' }).format(this.state.productType[1][index] - 130000)}
                                                        </strong>
                                                    </Typography>
                                                </li>
                                            }
                                        </ul>
                                    </>
                                }
                            </div>
                            <Row style={{ paddingRight: "11px", paddingLeft: "11px", overflowX: "hidden" }}>
                                {
                                    this.state.products.map((product, index) => {
                                        if (product.product_type === category)
                                            return (
                                                <Col key={index} className="p-0 pb-3 pr-md-2 pl-md-2 pr-1 pl-1" xs="6" md="6" xl="4">
                                                    <Card className="border-0 item-card h-100" data-aos="zoom-in-left" data-aos-mirror>
                                                        <CardImg top width="100%" src={`${hostURLStatic}/${product.image}`} alt="Card image cap" style={{ minHeight: "95px" }} />
                                                        <CardBody className="p-0 p-2 p-sm-3" style={{ textAlign: "center", display: "flex", flexGrow: 1, flexDirection: "column" }}>
                                                            <CardTitle>
                                                                <Typography variant="inherit" style={{ fontSize: "1.1rem", fontWeight: 900, textTransform: "uppercase" }}>
                                                                    {product.name}
                                                                </Typography>
                                                            </CardTitle>
                                                            {
                                                                product.category !== "pizza" &&
                                                                <Typography variant="inherit" color="error" style={{ fontSize: "1.1rem", fontWeight: 900, textTransform: "uppercase" }}>
                                                                    {new Intl.NumberFormat('de-DE', { style: 'currency', currency: 'VND' }).format(product.price)}
                                                                </Typography>
                                                            }
                                                            <CardText style={{ fontSize: "0.8rem" }}>{product.description[0]}</CardText>
                                                            {
                                                                product.category === "pizza"
                                                                    ?
                                                                    <Button
                                                                        className="w-100 mt-auto add-item-btn"
                                                                        variant="contained"
                                                                        color="default"
                                                                        style={{ whiteSpace: "nowrap" }}
                                                                        onClick={() => {
                                                                            this.togglePizzaOption()
                                                                            this.setState({ currentPizzaOption: product })
                                                                        }}
                                                                    >
                                                                        Thêm vào đơn hàng
                                                                        <ArrowForwardIcon className="ml-1" fontSize="inherit" />
                                                                    </Button>
                                                                    :
                                                                    <Button
                                                                        className="w-100 mt-auto add-item-btn"
                                                                        variant="contained"
                                                                        color="default"
                                                                        style={{ whiteSpace: "nowrap" }}
                                                                        onClick={() => {
                                                                            addCartItem({
                                                                                product_id: product.id,
                                                                                category: product.category,
                                                                                name: product.name,
                                                                                price: product.price,
                                                                                quantity: 1
                                                                            })
                                                                        }}
                                                                    >
                                                                        Thêm vào đơn hàng
                                                                        <ArrowForwardIcon className="ml-1" fontSize="inherit" />
                                                                    </Button>
                                                            }
                                                        </CardBody>
                                                    </Card>
                                                </Col>
                                            )
                                        return null
                                    })
                                }
                            </Row>
                        </Paper>
                    )
                })}
                <ModalPizzaOption {...this.state.currentPizzaOption} isOpen={this.state.isPizzaOptionOpen} onToggle={this.togglePizzaOption} />
            </div>
        )
    }
}

export default MenuItem
