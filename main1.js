const searchForm = document.querySelector('#search-form');
const movie = document.querySelector('#movies');
const urlPoster = 'https://image.tmdb.org/t/p/w500';


searchForm.addEventListener('submit', apiSearch);

function apiSearch(event) {
	event.preventDefault();

	const searchText = document.querySelector('.form-control').value;
	
	if(searchText.trim().length === 0){
		movie.innerHTML = '<h2 class="col-12 text-center text-danger">Поле поиска не должно быть пустым</h2>'
		return
	}
	
	const server = 'https://api.themoviedb.org/3/search/multi?api_key=65a8d5d6c7e61f2108bf4ac9f08cb0db&language=ru&query=' + searchText;
	movie.innerHTML = '<div class="spinner"></div>'

	fetch(server)
		.then(function(value){
			if(value.status !== 200){
				return Promise.reject(new Error(value.status));
			}
			return value.json();
		})
		.then(function(output){
			let inner = '';

			if(output.results.length === 0){
				inner = '<h2 class="col-12 text-center text-info">По вашему запросу ничего не найдено</h2>'
			}

			output.results.forEach(function (item, i, array){
				let nameItem = item.name || item.title;
				let dateItem = item.first_air_date || item.release_date;
				const poster = item.poster_path ? urlPoster + item.poster_path : './img/noposter.jpg'; 
				let dataInfo = '';
				if(item.media_type !== 'person'){
					dataInfo = `data-id="${item.id}" data-type="${item.media_type}"`;
				}
							
				inner += `
				<div class="col-12 col-md-4 item">
				<img src="${poster}" alt="${nameItem}" class="img_poster" ${dataInfo}>
				<h5>${nameItem}</h5>
				</div>`		
			})
			
			inner += '</tbody>';

			movie.innerHTML = inner;
				
			addEventMedia();
		})
		.catch(function(reason){
			movie.innerHTML = '<h2 class="col-12 text-center text-info">Упс, что-то пошло не так!</h2>';
			console.error(reason || reason.status);
		})
		;

}

function addEventMedia() {
	const media = movie.querySelectorAll('img[data-id]');
	media.forEach(function(elem){
		elem.style.cursor = 'pointer'
		elem.addEventListener('click', showFullInfo)
	})
}

function showFullInfo() {
	let url = '';

	if(this.dataset.type === 'movie'){
		url = 'https://api.themoviedb.org/3/movie/' + this.dataset.id + '?api_key=65a8d5d6c7e61f2108bf4ac9f08cb0db&language=ru'
	} else if(this.dataset.type === 'tv'){
		url = 'https://api.themoviedb.org/3/tv/' + this.dataset.id + '?api_key=65a8d5d6c7e61f2108bf4ac9f08cb0db&language=ru'
	} else{
		movie.innerHTML = '<h2 class="col-12 text-center text-danger">Произошла ошибка, повторите позже</h2>';
	}

	const typeMedia = this.dataset.type;
	const idMedia = this.dataset.id;

	fetch(url)
		.then(function(value){
			if(value.status !== 200){
				return Promise.reject(new Error(value.status));
			}
			return value.json();
		})
		.then(function(output){
			movie.innerHTML = `
			<h4 class="col-12 text-center text-info">${output.name || output.title}</h4>
			<div class="col-4">
				<img src="${urlPoster + output.poster_path}" alt="${output.name || output.title}" class="img_poster">
				${(output.homepage) ? `<p class='text-center'><a href="${output.homepage}" target="_blank">Официальная страница </a></p>` : ''}
				${(output.imdb_id) ? `<p class='text-center'><a href="https://imdb.com/title/${output.imdb_id}" target="_blank">Страница на IMDB.com </a></p>` : ''}
			</div>
			<div class="col-8">
				<p>Рейтинг: ${output.vote_average}</p>
				<p>Статус: ${output.status}</p>
				<p>Премьера: ${output.first_air_date || output.release_date}</p>
				${(output.last_episode_to_air) ? `<p>${output.number_of_seasons} сезон ${output.last_episode_to_air.episode_number} серий вышло</p>` : ''}
				<p>Описание: ${output.overview}</p>

				<br/>
				<div class="youtube">Видео</div>
				
			</div>
			`;

			getVideo(typeMedia, idMedia);
			
		})
		.catch(function(reason){
			movie.innerHTML = '<h2 class="col-12 text-center text-info">Упс, что-то пошло не так!</h2>';
			console.error(reason || reason.status);
		})
		;
		
}

document.addEventListener('DOMContentLoaded', function(){
	fetch('https://api.themoviedb.org/3/trending/all/week?api_key=65a8d5d6c7e61f2108bf4ac9f08cb0db&language=ru')
		.then(function(value){
			if(value.status !== 200){
				return Promise.reject(new Error(value.status));
			}
			return value.json();
		})
		.then(function(output){
			let inner = '<h4 class="col-12 text-center text-info">Популярные за неделю</h4>';
	
			if(output.results.length === 0){
				inner = '<h2 class="col-12 text-center text-info">По вашему запросу ничего не найдено</h2>'
			}
	
			output.results.forEach(function (item, i, array){
				let nameItem = item.name || item.title;
				let mediaType = item.title ? 'movie' : 'tv';
				const poster = item.poster_path ? urlPoster + item.poster_path : './img/noposter.jpg'; 
				let dataInfo = `data-id="${item.id}" data-type="${mediaType}"`;	
					inner += `
					<div class="col-12 col-md-4 item">
					<img src="${poster}" alt="${nameItem}" class="img_poster" ${dataInfo}>
					<h5>${nameItem}</h5>
					</div>`		
				})
				
			inner += '</tbody>';
	
			movie.innerHTML = inner;
					
			addEventMedia();
		})
		.catch(function(reason){
			movie.innerHTML = '<h2 class="col-12 text-center text-info">Упс, что-то пошло не так!</h2>';
			console.error(reason || reason.status);
		})
		;
	
})

function getVideo(type, id){
	let youtube = movie.querySelector('div.youtube');

	fetch(`https://api.themoviedb.org/3/${type}/${id}/videos?api_key=65a8d5d6c7e61f2108bf4ac9f08cb0db&language=ru`)
	.then(function(value){
		if(value.status !== 200){
			return Promise.reject(new Error(value.status));
		}
		return value.json();
	})
	.then(function(output){
		let videoFrame = '<h5 class="col-12 text-info">Видео:</h5>';

		if(output.results.length === 0){
			videoFrame = '<p>К сожалению видео отсутствуют</p>' 
		}

		output.results.forEach(function(item){
			videoFrame += 
			`<iframe width="560" height="315" src="https://www.youtube.com/embed/${item.key}" frameborder="0" allow="accelerometer; autoplay; encrypted-media; gyroscope; picture-in-picture" allowfullscreen></iframe>`;
		})

		youtube.innerHTML = videoFrame;
	})
	.catch(function(reason){
		youtube.innerHTML = '<h2 class="col-12 text-center text-info">Видео отсутствует!</h2>';
		console.error(reason || reason.status);
	})
	;

}

