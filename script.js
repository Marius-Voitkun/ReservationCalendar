
document.getElementById('show-table').addEventListener('click', function() {
  const year = document.getElementById('year').value;
  const month = parseInt(document.getElementById('month').value);
  const numberOfDays = daysInMonth(year, month);
  const objectOfDays = buildObjectOfDays(year, month, numberOfDays);
  buildTable(year, month, numberOfDays, objectOfDays);
})


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
  const dayNumbers = Object.keys(objectOfDays);
  const dayNames = Object.values(objectOfDays);
  const namesOfMonths = ['January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'];
  let now = new Date();
  
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
  
  for (let hour = 6; hour <= 22; hour++) {
    html += `<tr><th scope="row" class="hour">${hour}:00</th>`;
    
    for (let day = 1; day <= numberOfDays; day++) {
      let date = new Date(year, month - 1, day, hour);
      console.log(date);
      if (date.getDay() === 6 || date.getDay() === 0) {
        html += `<td class="weekend"></td>`;
        continue;
      }
      if (date < now) {
        html += `<td class="past"></td>`;
        continue;
      }
      html += `<td class="working"></td>`;
    }
    html += `</tr>`;
  }
  
  html += `</tbody>`;
    
  
  document.getElementById('reservation-table').innerHTML = html;
}

