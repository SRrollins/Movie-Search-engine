const API_KEY = 'api_key=e158b050ab89151ee885d5873ddf8ffb';
const BASE_URL = 'https://api.themoviedb.org/3';
const API_URL = BASE_URL + '/discover/movie?sort_by=popularity.desc&' + API_KEY;
const IMG_URL = 'https://image.tmdb.org/t/p/w500';
const SEARCH_URL = BASE_URL + '/search/movie?' + API_KEY;
const open_btn = document.querySelector('.open-btn');
const close_btn = document.querySelector('.close-btn');
const popup = document.querySelector('.popup');
const main_popup = document.querySelector('.main-popup');

let searchInput;
let moviei = 0;

// const section = document.getElementById('info')
const resultsDiv = document.querySelector(".results__div")
let movieTitle;

const boton = document.querySelector('#boton');
const menu = document.querySelector('#menu');

// Jqueary selectors
const mainTitleEl = $("#mainTitle")
const resultsDivEl = $(".results__div")
let searchHeadingEl;

const genres = [{
    "id": 28,
    "name": "Action"
},
{
    "id": 16,
    "name": "Animation"
},
{
    "id": 35,
    "name": "Comedy"
},
{
    "id": 80,
    "name": "Crime"
},
{
    "id": 99,
    "name": "Documentary"
},
{
    "id": 18,
    "name": "Drama"
},
{
    "id": 27,
    "name": "Horror"
}]
    

// const genre_id = "35"

function getMovies(url, genre_name){
    fetch(url).then(res => res.json()).then(data => {
    if (!data.results === false && !searchInput === false) {
        showMovies(data.results.slice(0, 10));
        return
    }
    if(!data.results === false) {
        showMovies(data.results.slice(0, 5), genre_name);
        return
    } 
    if(data.results === undefined || data.results.length === 0) {
        mainSection.innerHTML = ""
        const noResultsMessage = document.createElement("h2")
        noResultsMessage.classList.add("mx-4", "mt-8", "text-2xl", "font-medium", "inline-block", "font-bold", "mb-1")
        noResultsMessage.textContent = "No results found"
        mainSection.appendChild(noResultsMessage)
        return
    }
    })
}

function displayMoviesMainPage() {
    searchHeadingEl = $("#searchHeading") 
    for (i=0; i <genres.length; i++) {
        const genre_id = genres[i].id
        const genre_name = genres[i].name
        const GENRES_API = BASE_URL + "/discover/movie?" + API_KEY + "&with_genres=" + genre_id;
        getMovies(GENRES_API, genre_name)
    }
}

function addCssClasses() {
    // HTML y css del padre de los resultados de busqueda
    resultsDiv.innerHTML = 
    `
    <section id="mainSection" class="bg-yellow-500" >
    </section>
    `
}

function showMovies(data, genre_name){
    const mainSection = document.getElementById("mainSection")
    moviei = 0;
    if(genre_name === undefined) genre_name = "recent"
    if(!searchInput === true) {
        const genreHeading = document.createElement("h2")
        genreHeading.classList.add("mx-4","mt-8", "text-2xl", "font-medium", "inline-block", "font-bold")
        genreHeading.textContent = `Trending ${genre_name} movies`
        mainSection.appendChild(genreHeading)
    }
    if(!searchHeadingEl === false && !searchInput === false) searchHeadingEl.html(`Results for: <span id="searchHeadingSpan" class="font-bold">"${searchInput}"</span>`)
    const genreSection = document.createElement('section')
    genreSection.classList.add("results__section--movie-square","relative", "justify-items-center", "grid", "sm:grid-cols-2", "md:grid-cols-5", "gap-x-2", "gap-y-2", "p-2", "bg-yellow-500", "border-b-24" )
    // genreSection.setAttribute("id","info")
    mainSection.appendChild(genreSection)
    data.forEach(movie => {
        moviei = moviei + 1;
        let{title, poster_path, release_date, vote_average, id} = movie; 
        if (!title) title = "NA"
        const posterURL = (!poster_path) ? 'assets/images/img_unavailable.jpg' : IMG_URL + poster_path
        if (!release_date) release_date = "NA"
        if (!vote_average) vote_average = "NA"

        const movieEl = document.createElement('div');
        movieEl.setAttribute("id", id)
        movieEl.classList.add("movie", "flex", "sm:flex-col", "relative", "hover:cursor-pointer", "hover:border-white");

        
        // HTML y css de cada resultado de busqueda
        movieEl.innerHTML = `
        <div class="">
            <img class="results__img--movie-poster" src="${posterURL}" alt="Image poster is not available"> <!-- image poster -->
        </div>
        <div class="results__div--movie-text bg-white grow sm:flex sm:flex-col justify-between p-2 sm:border-t-4 border-black" >
            <h2 class="text-center font-bold border-b-2 border-black mb-2 sm:border-none">${title}</h2>
            <ul class="sm:block">
                <li class="">Release Date: <span class="font-bold">${release_date}</span></li>
                <li class="">Audience Score: <span id="score" class="font-bold">${vote_average}</span></li>

                <!-- Basic information (Title, score, genre, year) -->
            </ul>
        </div>
        <p class="results__p--number-list absolute inset-0 w-8 h-8 text-center text-xl py-auto text-white bg-black">${moviei}</p>
        `   
        genreSection.appendChild(movieEl);
        movieTitle = title; 
    });
    checkScore();
    const firstMovieNumber = document.querySelector(".results__p--number-list")
    if (!firstMovieNumber === false) {
        firstMovieNumber.classList.remove("bg-black")
        firstMovieNumber.classList.add("bg-yellow-500", "text-black")

    }
}

function checkScore() {
    const score = document.querySelectorAll('#score');
    score.forEach(score => {
        scoreNumber = Number(score.innerHTML)
        if (scoreNumber >= 6 && scoreNumber < 8) {
            score.classList.add("text-orange-700");
            return
        } 
        if (scoreNumber >= 8) {
            score.classList.add("text-green-700"); 
            return
        } 
        if (scoreNumber < 6) {
            score.classList.add("text-red-700")
        }

    })
        
}
function saveToLocal() {
    localStorage.setItem("id", this.id)
    localStorage.setItem("name", $(this).children(3).children("h2").text())
    localStorage.setItem("year", $(this).children(3).children("ul").children("li").eq(0).children("span").text().split("-")[0])
    window.location.href = "movie_article.html";
}

// Event Listener

form.addEventListener('submit', (i)=>{
    i.preventDefault();
    mainSection.innerHTML = '';

    searchInput = search.value;

    if(searchInput){
        const headingSearch = document.createElement("h2")
        headingSearch.classList.add("mx-4", "mt-8", "text-2xl", "font-medium", "inline-block", "font-bold", "mb-1")
        headingSearch.innerHTML = `Showing results for: <span class="text-white">"${searchInput}"</span>`
        mainSection.appendChild(headingSearch)
        getMovies(SEARCH_URL + '&query=' + searchInput)
    }else{
        displayMoviesMainPage()
    }
    //wikiLink();
})

resultsDivEl.on('click', ".movie", saveToLocal);
// Call functions

addCssClasses();
displayMoviesMainPage()

