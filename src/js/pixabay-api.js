import Axios from "axios";

export function getImagesByQuery(query) {    
    const params = {
        key: '51701755-afeeef66c15ff24568cee0a11',
        q: query,
        image_type: 'photo',
        orientation: 'horizontal',
        safesearch: true,
    }
    const axios = Axios.create({
        baseURL: 'https://pixabay.com/api/',
        params: params,
    })
    return axios
        .get()
        .then(res => res.data)
        .catch(error => console.log(error)
        );
}