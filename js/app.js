const apiKey = "37c8239f-2c2e-4f96-bc9b-89f4a9d75a75";

const apiUrlPopular = "https://kinopoiskapiunofficial.tech/api/v2.2/films/top?type=TOP_100_POPULAR_FILMS&page=1";

const apiUrlSearch = "https://kinopoiskapiunofficial.tech/api/v2.1/films/search-by-keyword?keyword=";

const apiMovieId = "https://kinopoiskapiunofficial.tech/api/v2.2/films/";


getMovies(apiUrlPopular);

async function getMovies(url){
    const resp = await fetch (url, {
        headers: {
            "Content-Type": "application/json",
            "X-API-KEY": apiKey,
        },
    });
    const responseData = await resp.json();
    showMovies(responseData);
}


// change border color by rating
function getClassByRate(vote){
    if(vote >= 7){
        return "green";
    }
    if(vote < 7 && vote >= 4){
        return "orange";
    }
    if(vote < 4){
        return "red";
    }
}

// function for show all movies on page
function showMovies(data){
    const moviesEl = document.querySelector(".movies");

    document.querySelector(".movies").innerHTML = "";

    data.films.forEach((movie) => {
        const movieEl = document.createElement("div")
        movieEl.classList.add("movie")
        movieEl.innerHTML = `
                <div class="movie__cover__inner">
                    <img src="${movie.posterUrlPreview}" class = "movie__cover" alt="${movie.nameRu}">
                    <div class="movie__cover--darkend"></div>
                </div>
                <div class="movie__info">
                    <div class="movie__title">${movie.nameRu}</div>
                    <div class="movie__category">${movie.genres.map((genre) => ` ${genre.genre}`)}</div>
                    ${movie.rating  && (`
                    <div class="movie__rating movie__rating--${getClassByRate(movie.rating)}">${movie.rating}</div>
                    `)}
                </div>`;
                movieEl.addEventListener("click", () => openModel(movie.filmId))
                moviesEl.appendChild(movieEl);
    });
}

//  Search element

const form = document.querySelector("form");
const search = document.querySelector(".header__search");

// function for search
form.addEventListener("submit", (e) => {
    e.preventDefault();
    // craeate url for film 
    const apiSearchUrl = `${apiUrlSearch}${search.value}`;
    if(search.value){
        getMovies(apiSearchUrl);
        
        search.value = "";
    }
})


//  Modal element

const modalEl = document.querySelector(".modal");


async function openModel(id){
    modalEl.classList.add("modal--show");
    
    //request for film ID
    const resp = await fetch (apiMovieId + id, {
        headers: {
            "Content-Type": "application/json",
            "X-API-KEY": apiKey,
        },
    });
    const responseData = await resp.json();
    
    modalEl.innerHTML = `
    <div class="modal__card">
        <img src="${responseData.posterUrl}" alt="${responseData.nameRu}" class="modal__movie-backdrop">
        <h2>
            <span class="modal__movie-title">${responseData.nameRu}</span>
            <span class="modal__movie-release-year">${responseData.year}</span>
        </h2>
        <ul class="modal__movie-info">
            <div class="loader"></div>
            <li class="modal__movie-genre">${responseData.genres.map((genre) => `${genre.genre}`)}</li>
            <li class="modal__movie-runtime">${responseData.filmLength} minutes</li>
            <li>Сайт: <a href="" class="modal__movie-site"></a></li>
            <li class="modal__movie-overview">Описание</li>
        </ul>
        <button class="modal__button-close" type="button">Закрыть</button>
    </div>
    `;
    const btnClose = document.querySelector(".modal__button-close");
    btnClose.addEventListener("click", () => closeModal())
}

// add close for modal by Close-button
function closeModal() {
    modalEl.classList.remove("modal--show");
}

// add close for modal by click on area 
window.addEventListener("click", (e) => {
    if(e.target === modalEl){
        closeModal();
    }
})

// add close for modal by ESC-button
window.addEventListener("keydown", (e) => {
    if(e.keyCode === 27){
        closeModal();
    }
})





