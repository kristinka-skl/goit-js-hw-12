import { getImagesByQuery } from './js/pixabay-api';
import { refs } from './js/refs';
import { renderImages, clearGallery, showLoadInfo, hideLoadInfo,showLoadMoreButton, hideLoadMoreButton, renderMoreImages } from './js/render-functions'; 
import iziToast from "izitoast";
import "izitoast/dist/css/iziToast.min.css";

refs.formELem.addEventListener('submit', handleFormElem);
let currentPage;
let maxPage;
let query;

async function handleFormElem(e) {
    e.preventDefault();
    clearGallery();
    showLoadInfo();
    hideLoadMoreButton();
    currentPage = 1;
    query = e.target.elements.searchText.value.trim();
    if (query === '') {
        iziToast.info({
            message: 'Please enter search words',
            position: 'topRight',
        })
        hideLoadInfo();
        return;
    }
    const data = await getImagesByQuery(query, currentPage);
    try {
        maxPage = Math.ceil(data.totalHits / 15);
        const imgArr = data.hits;
        hideLoadInfo();        
        if (imgArr.length === 0) {
            iziToast.error({
                title: 'Nothing found!',
                message: `Sorry, there are no images matching your search "${query}". Please try again!`,
                position: 'topRight',
            })
            hideLoadMoreButton();
        } else {
            renderImages(imgArr);
            e.target.reset();
        }
        if (currentPage < maxPage) {
            showLoadMoreButton();
        } else if (currentPage === maxPage) {                
            hideLoadMoreButton();
            iziToast.info({
                message: 'We are sorry, but you have reached the end of search results.',
            })
        }
    }
    catch {           
        iziToast.error({                
            message: `Sorry, we have connection problems. Please try again!`,
            position: 'topRight',
        });
    }     
    hideLoadInfo();
}

refs.loadMoreElem.addEventListener('click', handleLoadMore);
async function handleLoadMore() {
    try {
        hideLoadMoreButton();
        if (currentPage < maxPage) {            
            currentPage += 1;
            showLoadInfo();            
            const data = await getImagesByQuery(query, currentPage);
            const imgArr = data.hits;
            renderMoreImages(imgArr);
            showLoadMoreButton();            
            hideLoadInfo();
            const rect = document.querySelector('.img-card').getBoundingClientRect();            
            window.scrollBy({ 
                top: rect.height * 2, 
                behavior: 'smooth' 
              });           
            if (currentPage === maxPage) {                
                hideLoadMoreButton();
                iziToast.info({
                    message: 'We are sorry, but you have reached the end of search results.',
                })
            }
        }
    } catch {
        currentPage -= 1;
        showLoadMoreButton();
        iziToast.info({
            message: 'Sorry, we have connection problems!'
        });
    }
    hideLoadInfo();
    refs.loadMoreElem.blur();
}



