import React from 'react';
import Button from '@material-ui/core/Button';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogTitle from '@material-ui/core/DialogTitle';

export default function DeclineOrderModal(props) {
    const { declineOrder, orderInfo } = props
    const [open, setOpen] = React.useState(false);

    const handleClickOpen = () => {
        setOpen(true);
    };

    const handleClose = () => {
        setOpen(false);
    };

    return (
        <div>
            <Button
                className="ml-1"
                variant="contained"
                color="primary"
                style={{ background: "red" }}
                onClick={handleClickOpen}
                disabled={declineOrder.loading}
            >Hủy đơn</Button>
            <Dialog
                open={open}
                onClose={handleClose}
                aria-labelledby="alert-dialog-title"
                aria-describedby="alert-dialog-description"
            >
                <DialogTitle id="alert-dialog-title">{"Xác nhận hủy đơn hàng?"}</DialogTitle>

                <DialogActions>
                    <Button
                        onClick={() => {
                            declineOrder.decline(orderInfo.id)
                            handleClose()
                        }}
                        color="primary">
                        Đồng ý
                     </Button>
                    <Button onClick={handleClose} color="secondary" autoFocus>
                        Hủy
                    </Button>
                </DialogActions>
            </Dialog>
        </div>
    );
}