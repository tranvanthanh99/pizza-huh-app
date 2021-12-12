import axios from "axios";
import { hostURL } from '../config.js'


export const getProduct = async (category) => {
    const res = await axios.get(`${hostURL}/get-product/${category}`);
    if (res.status === 200) {
        return {
            ...res.data,
            success: true
        }
    } else {
        return { success: false }
    }
}

export const createOrder = async ({user_id, fullname, email, phone, address, guide_info}, total_price, total_quantity, item_list) => {
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
