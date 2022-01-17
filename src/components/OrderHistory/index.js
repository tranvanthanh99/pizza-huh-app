import React, { useEffect } from 'react';
// import PropTypes from 'prop-types';
import { makeStyles } from '@material-ui/core/styles';
import Box from '@material-ui/core/Box';
import Collapse from '@material-ui/core/Collapse';
import IconButton from '@material-ui/core/IconButton';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableContainer from '@material-ui/core/TableContainer';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import Typography from '@material-ui/core/Typography';
import Paper from '@material-ui/core/Paper';
import KeyboardArrowDownIcon from '@material-ui/icons/KeyboardArrowDown';
import KeyboardArrowUpIcon from '@material-ui/icons/KeyboardArrowUp';
import TablePagination from '@material-ui/core/TablePagination';
import MoreHorizIcon from '@material-ui/icons/MoreHoriz';
import { getUserOrder, getOrder } from '../../action/order'


const useRowStyles = makeStyles({
    root: {
        '& > *': {
            borderBottom: 'unset',
        },
    },
});

const modifyData = data => {
    if (data === "lớn") return "Cỡ lớn - 12 inch"
    if (data === "vừa") return "Cỡ vừa - 9 inch"
    if (data === "nhỏ") return "Cỡ nhỏ - 7 inch"
    return ""
}

function Row(props) {
    const { row, orderInfo } = props;
    const [open, setOpen] = React.useState(false);
    const classes = useRowStyles();

    return (
        <React.Fragment>
            <TableRow hover className={classes.root}>
                <TableCell>
                    <IconButton aria-label="expand row" size="small" onClick={() => setOpen(!open)}>
                        {open ? <KeyboardArrowUpIcon /> : <KeyboardArrowDownIcon />}
                    </IconButton>
                </TableCell>
                <TableCell component="th" scope="row">
                    {new Date(row.order_time - 7 * 60 * 60 * 1000).toLocaleString("it-IT")}
                </TableCell>
                <TableCell align="right">{row.phone}</TableCell>
                <TableCell align="right">{row.total_quantity}</TableCell>
                <TableCell align="right">
                    {new Intl.NumberFormat('de-DE', { style: 'currency', currency: 'VND' }).format(row.total_price)}
                </TableCell>
                <TableCell
                    align="right"
                    style={{
                        color: row.status === "Chờ duyệt" ? "rgb(250, 173, 20)" : (row.status === "Đã hoàn thành" ? "green" : (row.status === "Đã hủy" ? "gray" : "red")),
                        whiteSpace: "nowrap"
                    }}
                >{row.status}</TableCell>
                <TableCell
                    align="right"
                    style={{ whiteSpace: "nowrap" }}
                >
                    {
                        window.location.pathname === "/OrderManagement" &&
                        <IconButton color="default" onClick={() => orderInfo.getOrder(row)}>
                            <MoreHorizIcon />
                        </IconButton>
                    }
                </TableCell>
            </TableRow>
            <TableRow>
                <TableCell style={{ paddingBottom: 0, paddingTop: 0 }} colSpan={7}>
                    <Collapse in={open} timeout="auto" unmountOnExit>
                        <Box margin={1}>
                            <Typography variant="h6" gutterBottom component="div">
                                Chi tiết đơn hàng
                            </Typography>
                            <Table size="small" aria-label="purchases">
                                <TableHead>
                                    <TableRow>
                                        <TableCell>Tên sản phẩm</TableCell>
                                        <TableCell>Loại</TableCell>
                                        <TableCell>Tùy chọn</TableCell>
                                        <TableCell align="right">Số lượng</TableCell>
                                        <TableCell align="right">Giá</TableCell>
                                    </TableRow>
                                </TableHead>
                                <TableBody>
                                    {row.item_list.map((historyRow) => (
                                        <TableRow key={historyRow.name}>
                                            <TableCell component="th" scope="row">
                                                {historyRow.name + " " + modifyData(historyRow.size)}
                                            </TableCell>
                                            <TableCell>{historyRow.category}</TableCell>
                                            <TableCell>{historyRow.option.toString()}</TableCell>
                                            <TableCell align="right">{historyRow.quantity}</TableCell>
                                            <TableCell align="right">
                                                {new Intl.NumberFormat('de-DE', { style: 'currency', currency: 'VND' }).format(historyRow.price)}
                                            </TableCell>
                                        </TableRow>
                                    ))}
                                </TableBody>
                            </Table>
                        </Box>
                    </Collapse>
                </TableCell>
            </TableRow>
        </React.Fragment>
    );
}

// Row.propTypes = {
//   row: PropTypes.shape({
//     calories: PropTypes.number.isRequired,
//     carbs: PropTypes.number.isRequired,
//     fat: PropTypes.number.isRequired,
//     history: PropTypes.arrayOf(
//       PropTypes.shape({
//         amount: PropTypes.number.isRequired,
//         customerId: PropTypes.string.isRequired,
//         date: PropTypes.string.isRequired,
//       }),
//     ).isRequired,
//     name: PropTypes.string.isRequired,
//     price: PropTypes.number.isRequired,
//     protein: PropTypes.number.isRequired,
//   }).isRequired,
// };



export default function OrderHistory(props) {
    const { orderInfo } = props
    const [page, setPage] = React.useState(0);
    const [rowsPerPage, setRowsPerPage] = React.useState(10);
    const [order, setOrder] = React.useState([]);

    const handleChangePage = (event, newPage) => {
        setPage(newPage);
    };

    const handleChangeRowsPerPage = (event) => {
        setRowsPerPage(+event.target.value);
        setPage(0);
    };

    const fetchOrder = async () => {
        const user = JSON.parse(window.localStorage.getItem("user"))
        let res
        if (window.location.pathname === "/Profile") res = await getUserOrder(user.user_id)
        else res = await getOrder(orderInfo.status)
        if (res.success) setOrder(res.order_list.reverse())
    }
    useEffect(() => {
        fetchOrder()
    }, [orderInfo])

    return (
        <Paper elevation={1}>
            <TableContainer style={{ maxHeight: 500, minHeight: 500 }}>
                <Table stickyHeader aria-label="collapsible table">
                    <TableHead>
                        <TableRow>
                            <TableCell />
                            <TableCell>Ngày đặt đơn</TableCell>
                            <TableCell align="right">Số điện thoại</TableCell>
                            <TableCell align="right">Số lượng tổng</TableCell>
                            <TableCell align="right">Tổng tiền</TableCell>
                            <TableCell align="right">Trạng thái</TableCell>
                            <TableCell align="right"></TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {order.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage).map((row, index) => (
                            <Row key={index} row={row} orderInfo={orderInfo} />
                        ))}
                    </TableBody>
                </Table>
            </TableContainer>
            <TablePagination
                rowsPerPageOptions={[10, 25, 100]}
                component="div"
                count={order.length}
                rowsPerPage={rowsPerPage}
                page={page}
                onChangePage={handleChangePage}
                onChangeRowsPerPage={handleChangeRowsPerPage}
                labelRowsPerPage="Số hàng / Trang"
            />
        </Paper>
    );
}