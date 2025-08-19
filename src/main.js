import { getImagesByQuery } from './js/pixabay-api';
import { refs } from './js/refs';
import { renderImages, clearGallery, showLoadInfo, hideLoadInfo,showLoadMoreButton, hideLoadMoreButton, renderMoreImages } from './js/render-functions'; 
import iziToast from "izitoast";
import "izitoast/dist/css/iziToast.min.css";

refs.formELem.addEventListener('submit', handleFormElem);
refs.loadMoreElem.addEventListener('click', handleLoadMore);

let currentPage;
let maxPage;
let query;

function checkLoadMoreButton() {
    if (currentPage < maxPage) {
        showLoadMoreButton();
    } else {
        hideLoadMoreButton();
        iziToast.info({
            message: 'We are sorry, but you have reached the end of search results.',
        });
    }
}

async function handleFormElem(e) {
    e.preventDefault();
    clearGallery();
    showLoadInfo();
    hideLoadMoreButton();
    currentPage = 1;
    query = e.target.elements.searchText.value.trim();
    if (!query) {
        hideLoadInfo();        
        iziToast.info({
            message: 'Please enter search words',
            position: 'topRight',
        })
        
        return;
    }
    try {
        const data = await getImagesByQuery(query, currentPage);
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
            checkLoadMoreButton();
        }
        
    }
    catch {           
        iziToast.error({                
            message: `Sorry, we have connection problems. Please try again!`,
            position: 'topRight',
        });
    } finally {     
        hideLoadInfo();
    }
}

async function handleLoadMore() {
    try {        
        hideLoadMoreButton();
        showLoadInfo();
        currentPage += 1;
        const data = await getImagesByQuery(query, currentPage);
        const imgArr = data.hits;
        renderMoreImages(imgArr);
        
        checkLoadMoreButton();
        const rect = document.querySelector('.img-card').getBoundingClientRect();            
            window.scrollBy({ 
                top: rect.height * 2, 
                behavior: 'smooth' 
              });                 
    } catch {
        currentPage -= 1;
        
        iziToast.info({
            message: 'Sorry, we have connection problems!'
        });
    } finally {
        hideLoadInfo();
        refs.loadMoreElem.blur();
    }
}



