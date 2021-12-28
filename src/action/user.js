import axios from "axios";
import {hostURL} from '../config.js'

export const register = async (email, password, firstname, lastname, phone, address) => {
    const res = await axios.post(`${hostURL}/register`, {
        email, password, firstname, lastname, phone, address
    });
    if(res.status === 200) {
        return res.data
    } else {
        return {
            ...res.data,
            success: false,
        }
    }
}

export const login = async (email, password) => {
    const res = await axios.post(`${hostURL}/login`, {
        email, password
    });
    if(res.status === 200) {
        return res.data
    } else {
        return res.data
    }
}

export const getUser = async (user_id) => {
    const res = await axios.get(`${hostURL}/get-user/${user_id}`);
    if(res.status === 200) {
        return {
            ...res.data,
            success: true
        }
    } else {
        return res.data
    }
}

export const updatePassword = async (user_id, password, newPassword) => {
    const res = await axios.post(`${hostURL}/update-password`, {
        user_id, password, newPassword
    });
    if(res.status === 200) {
        return res.data
    } else {
        return res.data
    }
}

export const updateInfo = async (user_id, firstname, lastname, phone, address) => {
    const res = await axios.post(`${hostURL}/update-info`, {
        user_id, firstname, lastname, phone, address
    });
    if(res.status === 200) {
        return res.data
    } else {
        return res.data
    }
}
