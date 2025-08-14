import { getImagesByQuery } from './js/pixabay-api';
import { refs } from './js/refs';
import { renderImages, clearGallery, showLoadInfo, hideLoadInfo } from './js/render-functions'; 
import iziToast from "izitoast";
import "izitoast/dist/css/iziToast.min.css";

refs.formELem.addEventListener('submit', handleFormElem);

function handleFormElem(e) {
    e.preventDefault();
    clearGallery();
    showLoadInfo();
    const query = e.target.elements.searchText.value.trim();
    if (query === '') {
        iziToast.info({
            message: 'Please enter search words',
            position: 'topRight',
        })
        hideLoadInfo();
        return;
    }
    getImagesByQuery(query)
        .then(data => {
            const imgArr = data.hits;
            hideLoadInfo();
            if (imgArr.length === 0) {
                iziToast.error({
                    title: 'Nothing found!',
                    message: `Sorry, there are no images matching your search "${query}". Please try again!`,
                    position: 'topRight',
                })
            } else {
                renderImages(imgArr);
                e.target.reset();
            }
        })
        .catch(error => {
            console.log(error);
            hideLoadInfo();
            iziToast.error({                
                message: `Sorry, we have connection problems. Please try again!`,
                position: 'topRight',
            });
        });            
}
