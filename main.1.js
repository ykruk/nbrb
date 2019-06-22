const searchForm = document.querySelector('#search-form');
const movie = document.querySelector('table');
const urlPoster = 'https://image.tmdb.org/t/p/w500';


searchForm.addEventListener('submit', apiSearch);

function apiSearch(event) {
	event.preventDefault();

	const searchText = document.querySelector('.form-control').value;
	
	const server = 'https://api.themoviedb.org/3/search/multi?api_key=65a8d5d6c7e61f2108bf4ac9f08cb0db&language=ru&query=' + searchText;
	movie.innerHTML = '<div class="spinner"></div>'
	if(searchText.trim().length === 0){
		movie.innerHTML = '<h2 class="col-12 text-center text-danger">Поле поиска не должно быть пустым</h2>'
	}
	requestApi(server)
		.then(function(result){
			const output = JSON.parse(result);

			let inner = '<thead><tr><th scope="col">#</th><th scope="col">Название</th><th scope="col">Дата выхода</th><th scope="col">Тип</th></tr></thead><tbody>';

			output.results.forEach(function (item, i, array){
				let nameItem = item.name || item.title;
				let dateItem = item.first_air_date || item.release_date;
				const poster = item.poster_path ? urlPoster + item.poster_path : './img/noposter.jpg'; 
				let dataInfo = '';
				if(item.media_type !== 'person'){
					dataInfo = 'data-id="' + item.id + '" data-type="' + item.media_type + '"';
				}
							
				inner += '<tr><th scope="row">' + ( i + 1) + '</th><td>' + nameItem + '</td><td>' + dateItem + '</td><td class="item"><img src=' + poster + ' class="img_poster"' + dataInfo + '></td></tr>';
				
				addEventMedia();
				
			})

			if(output.results.length === 0){
				inner = '<h2 class="col-12 text-center text-info">По вашему запросу ничего не найдено</h2>'
			}
			
			inner += '</tbody>';

			movie.innerHTML = inner;
		})
		.catch(function(reason){
			movie.innerHTML = '<h2 class="col-12 text-center text-info">Упс, что-то пошло не так!</h2>';
			console.log('error: ' + reason.status);
		})
		;
}



function requestApi(url) {
	return new Promise (function (resolve, reject){
		const request = new XMLHttpRequest();
		request.open('GET', url);
		request.addEventListener('load', function(){
			if (request.status !== 200){
				reject({status: request.status})
			}
			resolve(request.response)
		})
		request.addEventListener('error', function(){
			reject({status: request.status})
		})
		request.send()
	})

	// const request = new XMLHttpRequest();

	// request.open('GET', url);
	// request.send();

	// request.addEventListener('readystatechange', function() {
	// 	if (request.readyState !== 4) return;

	// 	if (request.status !== 200) {
	// 		movie.innerHTML('Упс, что-то пошло не так!');
	// 		console.log('error: ' + request.status);
	// 		return;
	// 	}

		

	// });
	
}

function addEventMedia() {
	const media = movie.querySelectorAll('img[data-id]');
	
	media.forEach(function(elem){
		elem.style.cursor = 'pointer';
		elem.addEventListener('click', showFullInfo)
	})
}

function showFullInfo() {
	console.log('hiii');
	console.log(this);
}


document.addEventListener('DOMContentLoaded', function(){
	console.log('Ура загрузилась')
})


const a = document.querySelectorAll('.img_poster');
console.log(a.length);
// for (var i = 0; i < a.length; i++) {
//     console.log(a[i].style );
//   }
// a.forEach(element => {
// 	console.log(element)
// });