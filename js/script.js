const elMovieForm = document.querySelector(".site-form");
const elSearchMovieInput = elMovieForm.querySelector(".search-movie");
const elMovieFrom = elMovieForm.querySelector(".from-movie");
const elMovieTo = elMovieForm.querySelector(".to-movie");
const elMovieTypeSelect = elMovieForm.querySelector(".movie-type")
const elMovieSortSelect = elMovieForm.querySelector(".sort-movie");
const elMovieList = document.querySelector(".movie-list");
const elMovieTemplate = document.querySelector(".movie-template").content;

const newMovieFragment = new DocumentFragment;

// GLOBAL RENDER 
function renderMovie(arr) {
    elMovieList.innerHTML = "";
    arr.forEach(item => {
        const movieCloneTemplate = elMovieTemplate.cloneNode(true);
        
        movieCloneTemplate.querySelector(".movie-img").src = `https://i3.ytimg.com/vi/${item.ytid}/maxresdefault.jpg`;
        movieCloneTemplate.querySelector(".movie-title").textContent = item.Title;
        movieCloneTemplate.querySelector(".movie-rating").textContent = item.imdb_rating;
        movieCloneTemplate.querySelector(".movie-year").textContent = item.movie_year;
        movieCloneTemplate.querySelector(".movie-duration").textContent = `${Math.floor(item.runtime / 60)}Hrs ${item.runtime % 60}min`
        movieCloneTemplate.querySelector(".movie-category").textContent = `Category: ${item.Categories.split("|")}`;
        
        newMovieFragment.appendChild(movieCloneTemplate);
    })
    
    elMovieList.appendChild(newMovieFragment);
}

// Create type movie Option
function searchOption(arr) {
    const newArr = [];
    const resultArr = arr.reduce((acc, item) => {
        item.Categories.split("|").forEach(category => {
            acc.push(category)
        })
        return acc;
    }, [])
    resultArr.forEach(option => {
        if(!newArr.includes(option)) {
            newArr.push(option);
        }
    })
    newArr.forEach((ganre) => {
        const movieCategoryOptions = document.createElement("option");
        movieCategoryOptions.textContent = ganre;
        movieCategoryOptions.value = ganre;
        
        elMovieTypeSelect.appendChild(movieCategoryOptions);
    });
}
searchOption(movies);

// FILTERED ARRAY 
function searchMovie(value, arr, from, to, typeMovie, sortingVal) {
    const regexTitle = new RegExp(value, "gi");
    const searchedArr = arr.filter(item => {
        return (item.Title.match(regexTitle) && (item.movie_year >= from && item.movie_year <= to) && (item.Categories.includes(typeMovie) || typeMovie == "All"))
    })
    
    if(sortingVal == "") {
        renderMovie(searchedArr)
    }
    if(sortingVal == "Old-New") {
        renderMovie(searchedArr.sort((a, b) => a.movie_year - b.movie_year))
    }
    if(sortingVal == "New-Old") {
        renderMovie(searchedArr.sort((a, b) => b.movie_year - a.movie_year))
    }
    if(sortingVal == "A-Z") {
        renderMovie(searchedArr.sort((a, b) => a.Title.charCodeAt() - b.Title.charCodeAt()))
    }
    if(sortingVal == "Z-A") {
        renderMovie(searchedArr.sort((a, b) => b.Title.charCodeAt() - a.Title.charCodeAt()))
    }
}

// Form LISTENING
elMovieForm.addEventListener("submit", function(evt) {
    evt.preventDefault();
    const searchMovieVal = elSearchMovieInput.value.trim();
    const movieFromVal = Number(elMovieFrom.value);
    const movieToVal = Number(elMovieTo.value || "2024");
    const movieTypeVal = elMovieTypeSelect.value;
    const movieSortVal = elMovieSortSelect.value;
    
    searchMovie(searchMovieVal, movies, movieFromVal, movieToVal, movieTypeVal, movieSortVal);
})
renderMovie(movies);