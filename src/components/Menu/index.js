import React, { Component } from "react";
import PropTypes from "prop-types";
import { makeStyles } from "@material-ui/core/styles";
import AppBar from "@material-ui/core/AppBar";
import Tabs from "@material-ui/core/Tabs";
import Tab from "@material-ui/core/Tab";
import Typography from "@material-ui/core/Typography";
import Box from "@material-ui/core/Box";
import {
    Row,
    Col
} from 'reactstrap'
import MenuItem from '../MenuItem'
import MenuCart from '../MenuCart'
import { getProduct } from '../../action/product'


function TabPanel(props) {
    const { children, value, index, ...other } = props;

    return (
        <div
            role="tabpanel"
            hidden={value !== index}
            id={`scrollable-auto-tabpanel-${index}`}
            aria-labelledby={`scrollable-auto-tab-${index}`}
            {...other}
        >
            {value === index && (
                <Box p={3} style={{ padding: "0", paddingTop: "1.2rem" }}>
                    <Typography component="div">{children}</Typography>
                </Box>
            )}
        </div>
    );
}

TabPanel.propTypes = {
    children: PropTypes.node,
    index: PropTypes.any.isRequired,
    value: PropTypes.any.isRequired
};

function a11yProps(index) {
    return {
        id: `scrollable-auto-tab-${index}`,
        "aria-controls": `scrollable-auto-tabpanel-${index}`
    };
}


class Menu extends Component {

    state = {
        value: 0,
        pizza: [],
        sideDish: [],
        drink: [],
        dessert: []
    };




    classes = makeStyles(theme => ({
        root: {
            flexGrow: 1,
            width: "100%",
            backgroundColor: theme.palette.background.paper
        },
        panel: {
            padding: "0",

        }
    }));

    onChangeState = object => {
        this.setState(Object.assign(this.state, object));
    };

    handleChange = (event, newValue) => {
        this.setState({
            value: newValue
        });
        window.scrollTo(0, 0)
    };

    fetchProduct = async () => {
        const pizza = await getProduct("pizza")
        if (pizza.success) this.onChangeState({ pizza: pizza.product })
        const sideDish = await getProduct("sidedish")
        if (sideDish.success) this.onChangeState({ sideDish: sideDish.product })
        const drink = await getProduct("drink")
        if (drink.success) this.onChangeState({ drink: drink.product })
        const dessert = await getProduct("dessert")
        if (dessert.success) this.onChangeState({ dessert: dessert.product })
    }

    componentDidMount() {
        this.fetchProduct()
    }

    render() {
        return (
            <div className={`${this.classes.root} container-md mt-3`}>
                <AppBar style={{ zIndex: "1000", top: "66.7px" }} position="sticky" color="default" >
                    <Tabs
                        value={this.state.value}
                        onChange={this.handleChange}
                        indicatorColor="primary"
                        textColor="primary"
                        variant={window.innerWidth < 550 ? "scrollable" : "fullWidth"}
                        scrollButtons="on"
                        aria-label="scrollable auto tabs example"
                        centered={window.innerWidth > 500}
                    >
                        <Tab label="Pizza" {...a11yProps(0)} />
                        <Tab label="Món ăn kèm" {...a11yProps(1)} />
                        <Tab label="Giải khát" {...a11yProps(2)} />
                        <Tab label="Tráng miệng" {...a11yProps(3)} />
                    </Tabs>
                </AppBar>
                <TabPanel className={this.classes.panel} value={this.state.value} index={0}>
                    <Row>
                        <Col md="8" xl="9">
                            <MenuItem categoryIndex={this.state.value} productList={this.state.pizza} />
                        </Col>
                        <Col className="pl-0" md="4" xl="3">
                            <MenuCart isConfirm={false} />
                        </Col>
                    </Row>

                </TabPanel>
                <TabPanel value={this.state.value} index={1}>
                    <Row>
                        <Col md="8" xl="9">
                            <MenuItem categoryIndex={this.state.value} productList={this.state.sideDish} />
                        </Col>
                        <Col className="pl-0" md="4" xl="3">
                            <MenuCart isConfirm={false} />
                        </Col>
                    </Row>
                </TabPanel>
                <TabPanel value={this.state.value} index={2}>
                    <Row>
                        <Col md="8" xl="9">
                            <MenuItem categoryIndex={this.state.value} productList={this.state.drink} />
                        </Col>
                        <Col className="pl-0" md="4" xl="3">
                            <MenuCart isConfirm={false} />
                        </Col>
                    </Row>
                </TabPanel>
                <TabPanel value={this.state.value} index={3}>
                    <Row>
                        <Col md="8" xl="9">
                            <MenuItem categoryIndex={this.state.value} productList={this.state.dessert} />
                        </Col>
                        <Col className="pl-0" md="4" xl="3">
                            <MenuCart isConfirm={false} />
                        </Col>
                    </Row>
                </TabPanel>
            </div>
        );
    }
}
export default Menu
