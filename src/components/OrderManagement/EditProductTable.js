import React from 'react'
import {
    Paper,
    // Typography,
    // Button,
    Table,
    TableHead,
    TableCell,
    TableBody,
    TableRow,
    TextField,
} from '@material-ui/core'
import IconButton from '@material-ui/core/IconButton';
import DeleteRoundedIcon from '@material-ui/icons/DeleteRounded';
import MenuItemModal from './MenuItemModal'

export default function EditProductTable(props) {
    const { itemList, editItemList } = props

    const modifyData = data => {
        if (data === "lớn") return "Cỡ lớn - 12 inch"
        if (data === "vừa") return "Cỡ vừa - 9 inch"
        if (data === "nhỏ") return "Cỡ nhỏ - 7 inch"
        return ""
    }


    return (
        <Paper>
            <Table size="small" aria-label="purchases">
                <TableHead>
                    <TableRow>
                        <TableCell>Tên sản phẩm</TableCell>
                        <TableCell>Loại</TableCell>
                        <TableCell>Tùy chọn</TableCell>
                        <TableCell align="right">Số lượng</TableCell>
                        <TableCell align="right">Giá</TableCell>
                        <TableCell align="right">
                            <MenuItemModal />
                        </TableCell>
                    </TableRow>
                </TableHead>
                <TableBody>
                    {itemList.map((historyRow, index) => (
                        <TableRow key={historyRow.name}>
                            <TableCell component="th" scope="row">
                                {historyRow.name + " " + modifyData(historyRow.size)}
                            </TableCell>
                            <TableCell>{historyRow.category}</TableCell>
                            <TableCell>{historyRow.option.toString()}</TableCell>
                            <TableCell align="right">
                                <TextField
                                    style={{ width: "3.4vw", textAlign: "center" }}
                                    id="standard-number"
                                    type="number"
                                    InputLabelProps={{
                                        shrink: true,
                                    }}
                                    value={historyRow.quantity}
                                    onChange={(e) => {
                                        const val = Math.max(Number(1), Math.min(Number(99), Number(e.target.value)))
                                        editItemList(itemList.map((item, ind) => {
                                            if (index === ind) item.quantity = val
                                            return item
                                        }))
                                    }}
                                />
                            </TableCell>
                            <TableCell align="right">
                                {new Intl.NumberFormat('de-DE', { style: 'currency', currency: 'VND' }).format(historyRow.price)}
                            </TableCell>
                            <TableCell align="right">
                                <IconButton
                                    className="float-right"
                                    size="medium"
                                    color="secondary"
                                    onClick={() => {
                                        editItemList(itemList.filter((item, ind) => ind !== index))
                                    }}
                                >
                                    <DeleteRoundedIcon fontSize="small" />
                                </IconButton>
                            </TableCell>
                        </TableRow>
                    ))}
                </TableBody>
            </Table>
        </Paper>
    )
}