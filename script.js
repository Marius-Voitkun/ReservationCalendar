
document.getElementById('show-table').addEventListener('click', function() {
  const year = document.getElementById('year').value;
  const month = parseInt(document.getElementById('month').value);
  const numberOfDays = daysInMonth(year, month);
  const objectOfDays = buildObjectOfDays(year, month, numberOfDays);
  buildTable(year, month, numberOfDays, objectOfDays);
});

let now = new Date();

let reservedTimes = [];
if (localStorage.getItem('reservedTimes') !== null) {
  reservedTimes = localStorage.getItem('reservedTimes').split(',');
}

let reservedTimesFromNow = filterReservedTimesFromNow(reservedTimes);
console.log(reservedTimes);
console.log(reservedTimesFromNow);


function filterReservedTimesFromNow(reservedTimes) {
  let nowYear = now.getFullYear();
  let nowMonth = now.getMonth() + 1;
  nowMonth = nowMonth < 10 ? `0${nowMonth}` : nowMonth;
  let nowDay = now.getDate();
  nowDay = nowDay < 10 ? `0${nowDay}` : nowDay;
  let nowHour = now.getHours();
  nowHour = nowHour < 10 ? `0${nowHour}` : nowHour;

  let nowForFiltering = `${nowYear}-${nowMonth}-${nowDay}-${nowHour}`;

  return reservedTimes.filter(time => time > nowForFiltering);
}


function daysInMonth (year, month) {
  const thirtyOneDays = [1, 3, 5, 7, 8, 10, 12];
  const thirtyDays = [4, 6, 9, 11];
  let numberOfDays;

  if (thirtyOneDays.includes(month)) {
    numberOfDays = 31;
  }
  else if (thirtyDays.includes(month)) {
    numberOfDays = 30;
  }
  else if ((month === 2) && (year % 4 === 0)) {
    numberOfDays = 29;
  }
  else if ((month === 2) && (year % 4 !== 0)) {
    numberOfDays = 28;
  }
  
  return numberOfDays;
}


function buildObjectOfDays(year, month, numberOfDays) {
  const date = new Date(year, month - 1, 1);
  const firstDay = date.getDay();
  const days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];

  let objectOfDays = {};
  let dayIndex = firstDay;
  let dayName = days[firstDay];

  for (let day = 1; day <= numberOfDays; day++) {
    objectOfDays[day] = dayName;
    if (dayIndex === 6)
      dayIndex = 0;
    else dayIndex += 1;
    dayName = days[dayIndex]
  }

  return objectOfDays;
}
// function buildArrayOfDayNames(year, month, numberOfDays) {
//   const date = new Date(year, month - 1, 1);
//   const firstDay = date.getDay();
//   const days = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];

//   let arrayOfDayNames = [];
//   let dayIndex = firstDay - 1;
//   let dayName = days[firstDay - 1];

//   for (let i = 1; i <= numberOfDays; i++) {
//     arrayOfDayNames.push(dayName);
//     if (dayIndex === 6)
//       dayIndex = 0;
//     else dayIndex += 1;
//     dayName = days[dayIndex]
//   }

//   return arrayOfDayNames;
// }


function buildTable(year, month, numberOfDays, objectOfDays) {
  const namesOfMonths = ['January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'];
  
  let html = `<caption>${year} ${namesOfMonths[month - 1]}</caption>
              <thead><tr><th rowspan="2" scope="col" class="first-column"></th>`;
  
  for (let day = 1; day <= numberOfDays; day++) {
    if (objectOfDays[day] === 'Saturday' || objectOfDays[day] === 'Sunday') {
      html += `<th scope="col" class="other-columns weekend">${day}</th>`;
      continue;
    }
    html += `<th scope="col" class="other-columns">${day}</th>`;
  }
  
  html += `</tr><tr class="day-names">`;
  
  for (let day = 1; day <= numberOfDays; day++) {
    if (objectOfDays[day] === 'Saturday' || objectOfDays[day] === 'Sunday') {
      html += `<th class="weekend"><div class="day-names-text">${objectOfDays[day]}</div></th>`;
      continue;
    }
    html += `<th><div class="day-names-text">${objectOfDays[day]}</div></th>`;
  }
  
  html += `</tr></thead><tbody>`;
  
  let monthFormatted = month < 10 ? `0${month}` : month;
  let dayFormatted;
  let hourFormatted;

  for (let hour = 6; hour <= 22; hour++) {
    html += `<tr><th scope="row" class="hour">${hour}:00</th>`;
    hourFormatted = hour < 10 ? `0${hour}` : hour;
    
    for (let day = 1; day <= numberOfDays; day++) {
      let date = new Date(year, month - 1, day, hour);
      dayFormatted = day < 10 ? `0${day}` : day;

      if (date.getDay() === 6 || date.getDay() === 0) {
        html += `<td class="weekend" id="${year}-${monthFormatted}-${dayFormatted}-${hourFormatted}"></td>`;
        continue;
      }
      if (date < now) {
        html += `<td class="past" id="${year}-${monthFormatted}-${dayFormatted}-${hourFormatted}"></td>`;
        continue;
      }
      html += `<td class="working" id="${year}-${monthFormatted}-${dayFormatted}-${hourFormatted}"></td>`;
    }
    html += `</tr>`;
  }
  
  html += `</tbody>`;
  
  document.getElementById('reservation-table').innerHTML = html;

  activateWorkingCells();
  markReservedTimes();
}


function activateWorkingCells() {
  let workingCells = document.getElementsByClassName('working');
  for (let cell of workingCells) {
    cell.addEventListener('click', function() {
      handleReservation(cell.id);
    });
  }
}


function markReservedTimes() {
  for (let cellId of reservedTimes) {
    try {
      document.getElementById(cellId).classList.add('reserved');
    }
    catch(error) {
      continue;
    }
  }
}


function handleReservation(cellId) {
  const cell = document.getElementById(cellId);  
  
  if (cell.classList.contains('reserved')) {
    cell.classList.remove('reserved');
    let index = reservedTimes.indexOf(cellId);
    reservedTimes.splice(index, 1);
  }
  else if (reservedTimesFromNow.length < 3) {
    cell.classList.add('reserved');
    reservedTimes.push(cellId);
    reservedTimes.sort();
  }
  localStorage.setItem('reservedTimes', reservedTimes);
  reservedTimesFromNow = filterReservedTimesFromNow(reservedTimes);
  console.log(reservedTimes);
  console.log(reservedTimesFromNow);
}