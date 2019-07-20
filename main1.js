const button = document.querySelector('button');
const select = document.querySelector('#select');
const text = document.querySelector('.container');
const date = new Date();
const today = `${date.getFullYear()}-${date.getMonth()}-${date.getDate()}`;

const urlPoster = 'https://image.tmdb.org/t/p/w500';


button.addEventListener('click', apiSearch);

function apiSearch(event) {
	const currency = select.options[select.selectedIndex].value;

	// event.preventDefault();
	
	fetch(`http://www.nbrb.by/API/ExRates/Rates/Dynamics/${currency}?startDate=2019-1-1&endDate=2019-6-27`)
		.then(function(value){
			if(value.status !== 200){
				return Promise.reject(new Error(value.status));
			}
			return value.json();
		})
		.then(function(output){
			// text.innerHTML += `
			// <br/><br/><br/>
			// <table class="table table-hover col-5">
			// 	<thead class="thead-dark">
			// 	<tr>
			// 		<th scope="col">Дата</th>
			// 		<th scope="col">Курс</th>
			// 	</tr>
			// 	</thead>
			// 	<tbody>
			// 	</tbody>
			// </table>`
			const ratesTable = text.querySelector('tbody');
			let data = [];
			let labels = [];
			output.forEach(function(item, i,array){
				let date = new Date(`${item.Date}`);
				let year = date.getFullYear();
				let month = date.getMonth()+1;
				let dt = date.getDate();
				if (dt < 10) {
					dt = '0' + dt;
				}
				if (month < 10) {
					month = '0' + month;
				}
				rateDate = dt + '.' + month + '.' + year;

				// ratesTable.innerHTML += `
				// <tr>
				// 	<td class="col-2">${rateDate}</td>
				// 	<td class="col-2">${item.Cur_OfficialRate}</td>
				// </tr>`;
				data.push(item.Cur_OfficialRate);
				labels.push(rateDate);

			})

			// console.log(currName)
			
			var ctx = document.getElementById('myChart').getContext('2d');

			ctx.width = 600;
       
			var myChart = new Chart(ctx, {
				type: 'line',
				data: {
					labels: labels,

					datasets: [{
						label: 'Динамика валюты',
						data: data,
						backgroundColor: [
							'rgba(0, 0, 0, 0)'
						],
						borderColor: [
							'rgba(255, 99, 132, 1)'
						],
						borderWidth: 1
					}]
				},
				options: {
					scales: {
						// xAxes: [{
						    // type: 'time',
						    // time: {
						    //     // min: '2019-01-01',
						    //     // max: '2019-08-01',
						    //     unit: 'day'
						    // }
						// }],
						yAxes: [{
							ticks: {
								beginAtZero: false
							}
						}]
					}
				}
			});
	
		})
		.catch(function(reason){
			text.innerHTML += '<h4 class="col-12 text-center text-info">Выберите валюту!</h4>';
			console.error(reason || reason.status);
		})
	;

}

document.addEventListener('DOMContentLoaded', function(){

	var curList = [];

	fetch(`http://www.nbrb.by/API/ExRates/Rates?onDate=2019-1-1&Periodicity=0`)
		.then(function(value){
			if(value.status !== 200){
				return Promise.reject(new Error(value.status));
			}
			// console.log(value.json());
			return value.json();	
		})
		.then(function(output){
			output.forEach(function (item, i,array){
				curList.push(item.Cur_ID) 
			})
		})
		.catch(function(reason){
			text.innerHTML += '<h4 class="col-12 text-center text-info">Упс, что-то пошло не так!</h4>'
			console.error(reason || reason.status);
		})
		;

	fetch('http://www.nbrb.by/API/ExRates/Currencies')
		.then(function(value){
			if(value.status !== 200){
				return Promise.reject(new Error(value.status));
			}
			console.log(value.json());
			return value.json();
		})
		.then(function(output){
			let inner = '<option selected>Choose...</option>';
			let currName = {};
			output.forEach(function (item, i,array){
				if(curList.includes(item.Cur_ID)){
					inner += `
					<option value="${item.Cur_ID}">${item.Cur_Code} (${item.Cur_Abbreviation}) - ${item.Cur_Name}</option>`
				}
				//currName.item.Cur_ID = item.Cur_Name;
			})
			select.innerHTML = inner;
			//return currName;
		})
		.catch(function(reason){
			text.innerHTML += '<h4 class="col-12 text-center text-info">Упс, что-то пошло не так!</h4>'
			console.error(reason || reason.status);
		})
		;
	
})

let a = {};
a.one = 1;

console.log(a);