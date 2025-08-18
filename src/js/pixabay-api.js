import Axios from "axios";

export async function getImagesByQuery(query, currentPage) {    
    const params = {
        key: '51701755-afeeef66c15ff24568cee0a11',
        q: query,
        image_type: 'photo',
        orientation: 'horizontal',
        safesearch: true,
        per_page: 15,
        page: currentPage,
    }
    const axios = Axios.create({
        baseURL: 'https://pixabay.com/api/',
        params: params,
    })    
    const res = await axios.get();
    return res.data;
}