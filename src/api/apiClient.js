import axios from 'axios'

const apiClient = (token) => {

    return axios.create({
        headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json'
        },
        timeout: 10000
    })
}

export default apiClient