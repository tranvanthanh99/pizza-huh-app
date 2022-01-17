import axios from "axios";
import { hostURL } from '../config.js'


export const createOrder = async ({ user_id, fullname, email, phone, address, guide_info }, total_price, total_quantity, item_list) => {
    const res = await axios.post(`${hostURL}/create-order`, {
        user_id, fullname, email, phone, address, guide_info, total_price, total_quantity, item_list
    });
    if (res.status === 200) {
        return {
            ...res.data,
            success: true
        }
    } else {
        return { success: false }
    }
}

export const getUserOrder = async (user_id) => {
    const res = await axios.get(`${hostURL}/get-user-order/${user_id}`);
    if (res.status === 200) {
        return {
            ...res.data,
            success: true
        }
    } else {
        return { success: false }
    }
}

export const getOrder = async (status) => {
    const res = await axios.get(`${hostURL}/get-order/${status}`);
    if (res.status === 200) {
        return {
            ...res.data,
            success: true
        }
    } else {
        return { success: false }
    }
}

export const acceptOrder = async (order_id) => {
    const res = await axios.get(`${hostURL}/accept-order/${order_id}`);
    if (res.status === 200) {
        return {
            ...res.data,
            success: true
        }
    } else {
        return { success: false }
    }
}

export const declineOrder = async (order_id) => {
    const res = await axios.get(`${hostURL}/decline-order/${order_id}`);
    if (res.status === 200) {
        return {
            ...res.data,
            success: true
        }
    } else {
        return { success: false }
    }
}

export const updateOrder = async (order_id, state) => {
    const res = await axios.post(`${hostURL}/update-order`, {
        order_id, state
    });
    if (res.status === 200) {
        return {
            ...res.data,
            success: true
        }
    } else {
        return { success: false }
    }
}

export const updateOrderInfo = async (order_id, info) => {
    const res = await axios.post(`${hostURL}/update-order-info`, {
        order_id, info
    });
    if (res.status === 200) {
        return {
            ...res.data,
            success: true
        }
    } else {
        return { success: false }
    }
}

export const trackOrder = async (phone) => {
    const res = await axios.get(`${hostURL}/track-order/${phone}`);
    if (res.status === 200) {
        return {
            ...res.data,
            success: true
        }
    } else {
        return { success: false }
    }
}
