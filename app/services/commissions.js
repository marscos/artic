import api from './api.js';

const getRequestedCommissions = async (username) => {
    let commissions = [];
    const response = await api.get(`/commissions?requester.Username=${username}`);
    if (Array.isArray(response.data)) {
        commissions = response.data;
    }
    return commissions;
}

const getReceivedCommissions = async (username) => {
    let commissions = [];
    const response = await api.get(`/commissions?executor.Username=${username}`);
    if (Array.isArray(response.data)) {
        commissions = response.data;
    }
    return commissions;
}

export { getRequestedCommissions, getReceivedCommissions };