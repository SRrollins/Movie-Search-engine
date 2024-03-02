const API_KEY = 'api_key=e158b050ab89151ee885d5873ddf8ffb';
const BASE_URL = 'https://api.themoviedb.org/3';
const IMG_URL = 'https://image.tmdb.org/t/p/w500';
const SEARCH_URL = BASE_URL + '/search/movie?' + API_KEY;

// const id = 460458
const id = localStorage.getItem("id")

const ID_URL = BASE_URL + '/movie/' + id + '?' + API_KEY;
const CREDITS_URL = BASE_URL + '/movie/' + id + '/credits?' + API_KEY;

const section = document.getElementById('info')
const section1 = document.getElementById('cast')

let wikiButtonEl = $("#wikipedia-btn")

let cast;
let cast1;
let cast2;
let writer;
let writer1;
let director;
let directorName;

function getInfo(url) {
    fetch(url).then(res => res.json()).then(data => {
        showInfo(data)
    })
}

function showInfo(data) {   
    info.innerHTML = '';
    const posterURL = IMG_URL + data.poster_path;
    const totalMinutes = data.runtime;
    const hours = Math.floor(totalMinutes / 60);
    const minutes = totalMinutes % 60;
    const movieEl = document.createElement('div');
    movieEl.innerHTML = `
    <div class="p-6 relative flex flex-col items-center bg-zinc-800 md:flex-row md:gap-6 md:items-start">  
        <img class="-top-40 images relative md:-top-20" src="${posterURL}" alt="Placeholder poster">  
        <div class="-top-40 mt-4 relative text-white md:-top-8">
            <p class="text-3xl text-center font-semibold"><span class="">${data.title}</span></p>
            <p class="text-xl text-center pt-4"><span class="">${data.vote_average*10}%</span> | Release date: <span class="">${data.release_date}</span> | <span class="">${data.genres[0].name}/${data.genres[1].name}</span> | <span class="">${hours}:${minutes}</span></p>
            <p class="pt-4 text-justify text-lg"><span class="">${data.overview}</span></p>
            <p class="pt-4 text-lg font-awesome font-bold">Director: <span class="text-teal-200 font-medium">${directorName}</span></p>
            <p class="pt-4 text-lg font-bold">Writers: <span class="text-teal-200 font-medium">${writerName}</span></p>
            <p class="py-4 text-lg font-bold">Stars: <span class="text-teal-200 font-medium">${cast} - ${cast1} - ${cast2}</span></p>

        </div>
    </div> 
    `
    info.appendChild(movieEl);
    // wikiButtonEl = $("#wikipedia-btn")
}

function getCredits(url1) {
    fetch(url1).then(res => res.json()).then(data1 => {
        showCredits(data1)
    })
}

function showCredits(data1) {
    cast = data1.cast[0].name  
    cast1 = data1.cast[1].name 
    cast2 = data1.cast[2].name
    director = data1.crew.forEach(data => {
        if(data.job === "Director"){
            directorName = data.name
        } 
    });
    writer = data1.crew.findIndex(data => {
        if(data.job === 'Writer'){
            writerName = data.name;
            return writerName[0]
        } else {
            writerName = directorName
        }
    })
        
}

getCredits(CREDITS_URL);
getInfo(ID_URL);

//Access to other HTML elements
let wikiButton = document.querySelector("#wikipedia-btn");
const movieInfoEl = $("#movieInfo");

//Wikipedia API varibles from LocalStorage

let nameMovie = localStorage.getItem("name");
let year = localStorage.getItem("year");
//Wikipedia API begins here.
wikiButtonEl.click(function wikiLink(event){
    event.stopPropagation();

    //This function fetches the result from wikipedia based on 20 elements and a specific term inserted. 
        function redirectToWiki(){
            const searchUrl = "https://en.wikipedia.org/w/api.php?origin=*&action=opensearch&limit=70&format=json&search=";
            let url = searchUrl + nameMovie;
            fetch(url)
            .then(respuesta => respuesta.json())
            .then(function(resultado){

                //Wikipedia changes some special characters and had to replace them to match the "normal" results.
                nameMovie = nameMovie.replaceAll(" ", "_")
                nameMovie = nameMovie.replaceAll("'", "%27")
                nameMovie = nameMovie.replaceAll("&", "%26")
                //Here we make variables to later compare to this results through wikipedia.  
                var url1 = "https://en.wikipedia.org/wiki/" + nameMovie;
                var url2 = "https://en.wikipedia.org/wiki/" + nameMovie + "_(film)";
                var url3 = "https://en.wikipedia.org/wiki/" + nameMovie + "_(" + year + "_film)";
                url2 = url2.replaceAll(" ", "_");
                var urlBueno;
                //Empty array declared for easier handling, the fetched results fromo the Wiki
                const movieResult = [];
                console.log(movieResult);
                movieResult.push(resultado[3]);

                //Checks if the array is empty, you would get a message returning an error. 
                if(movieResult[0].length === 0){
                    mostrarError("No article related to this search");
                    return;
                }

                //this for loop allows to compare with url3 and url2 to see if array contains similar results. 

                for(let i = 1; i < movieResult[0].length; i++){

                    if(movieResult[0][i] === url3){
                        urlBueno = movieResult[0][i];
                        window.open(urlBueno);
                        return;

                    }else if(movieResult[0][i] === url2){
                        urlBueno = movieResult[0][i];
                        window.open(urlBueno);
                        return;
                }
                }

                //This loop is to check the array for 1 result only, or if url2 and 3 arent a match. 
                for(let j = 0; j < movieResult[0].length; j++){

                    if(movieResult[0].length === 1){
                        urlBueno = movieResult[0][0];
                        window.open(urlBueno);
                        return;
                    }

                    else if(movieResult[0][j] != url3 && movieResult[0][j] != url2 && movieResult[0][j] != url1){
                        mostrarError("No article related to this search");
                        return;
                    }

                    else if(movieResult[0][j] !== url3 && movieResult[0][j] !== url2){
                        urlBueno = movieResult[0][0];
                        window.open(urlBueno);
                        return;
                    }

                }
                
                })
                //This is the function that handles the error when theres no match or empty array. 
                function mostrarError(error){
                    const mensajeError = document.createElement("p");
                    mensajeError.textContent = error;
                    mensajeError.classList.add("error");

                    const contenido = document.querySelector("#wikistuff");
                    contenido.appendChild(mensajeError);

                    //This time out, is to automatically remove the new message. 
                    setTimeout(() => {
                        mensajeError.remove();
                    }, 3000);
                }
        }
        //callback to the function, execution. 
        redirectToWiki();
    
    });



//Wikipedia EventListener
//wikiButton.on("click", wikiLink);
//movieInfoEl.on('click', wikiButton, wikiLink);




//Wikipedia API ends here.
