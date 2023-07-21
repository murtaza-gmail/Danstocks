import {config} from '../config';

function addDays(date, days) {
  var result = new Date(date);
  result.setDate(result.getDate() + days);
  return result;
};

export function getFourWeekRanges() {
  const today = new Date();
  const weekdayToday = (new Date()).getDay()

  return {
    period1: {
      start: today,
      end: addDays(today, (7 - weekdayToday))
    },
    period2: {
      start: addDays(today, (7 - weekdayToday)),
      end: addDays(today, (14 - weekdayToday))
    },
    period3: {
      start: addDays(today, (14 - weekdayToday)),
      end: addDays(today, (21 - weekdayToday))
    },
    period4: {
      start: addDays(today, (21 - weekdayToday)),
      end: addDays(today, (28 - weekdayToday))
    }
  }
};

export function tickFormat(date) {
  const month = date.getMonth() + 1; // getMonth() returns 0-11
  const day = date.getDate();
  const year = date.getFullYear().toString().slice(2); // get the last two digits of the year
  return `${month.toString().padStart(2, '0')}-${day.toString().padStart(2, '0')}-${year}`;
  };

export function smoothArray(arr, factor) {
  const smoothed = [];

  for (let i = 0; i < arr.length; i++) {
    const sliceStart = Math.max(0, i - factor);
    const sliceEnd = Math.min(i + factor, arr.length - 1);
    const slice = arr.slice(sliceStart, sliceEnd + 1);
    const sum = slice.reduce((acc, val) => acc + val.y, 0);
    const avg = sum / slice.length;
    smoothed.push({ x: arr[i].x, y: avg });
  }

  return smoothed;
	};

export function normalizeArray(arr, windowSize) {
  const normalizedArray = [];

  for (let i = 0; i < arr.length; i++) {
    // Calculate the start and end indices of the rolling window
    const startIndex = Math.max(0, i - windowSize + 1);
    const endIndex = i + 1;

    // Get the minimum and maximum values in the rolling window
    const windowMin = Math.min(...arr.slice(startIndex, endIndex).map(obj => obj.y));
    const windowMax = Math.max(...arr.slice(startIndex, endIndex).map(obj => obj.y));

    // Normalize the current object's 'y' field using the rolling minimum and maximum values
    const normalizedValue = (arr[i].y - windowMin) / (windowMax - windowMin);

    // Add the normalized object to the output array
    normalizedArray.push({
      x: arr[i].x,
      y: normalizedValue
    });
  }

  return normalizedArray;
	};

export function reduceGranularity(data, interval, candle=false) {
  if (candle) {
    const reducedData = [];
    let startIndex = 0;
    let endIndex = interval - 1;

    while (endIndex < data.length) {
      const x = data[startIndex].x
      const open = data[startIndex].open;
      const high = Math.max(...data.slice(startIndex, endIndex + 1).map(d => d.high));
      const low = Math.min(...data.slice(startIndex, endIndex + 1).map(d => d.low));
      const close = data[endIndex].close;

      reducedData.push({ x, open, high, low, close });

      startIndex += interval;
      endIndex += interval;
    }

    return reducedData;
  } else {
    const reducedData = [];
    for (let i = 0; i < data.length; i += interval) {
      reducedData.push(data[i]);
    }
    return reducedData;
  }};

export function reverseArray(arr) {
  let array = arr
  array = array.reverse()
  return array
}

export function commarize(number, min) {
  if (typeof number === 'number'){
      min = min || 1e3;
      let isNegative = false
      if (number < 0){
        number = number*-1
        isNegative = true
      }
    
      if (number >= min) {
        let units = ["k", "M", "B", "T"];
        let order = Math.floor(Math.log(number) / Math.log(1000));
        let unitname = units[order - 1];
        let num = Number((number / 1000 ** order).toFixed(2));
        if (isNegative) {
          return num*-1 + unitname
        } else {
          return num + unitname;
        }
      }
    
      return number.toLocaleString();
  } else {
    if (number === null) {
      return '-'
    } else {
      return number
    }
  }};

export function logout() {
  sessionStorage.setItem('dankToken', '')
  };

export function getRoute (route) {
  return `${config.backend_suffix}/${route}`
}

export function generateAuthConfig (token){return {
  headers: {
    Authorization: "Bearer " + token,
    Accept: 'application/json',
    'Content-Type': 'application/json'
  }}};

export function formatNegNumber(num) {
  if (num < 0) {
    return '(' + Math.abs(num) + ')';
  } else {
    return num.toString();
  }
}

export function getYearAndQuarter(dateString) {
  const date = new Date(dateString);
  const year = date.getFullYear().toString().substr(-2);
  const month = date.getMonth() + 1;
  const quarter = Math.ceil(month / 3);

  return year + "/Q" + quarter;
}

export function validatePassword(password) {
  // Regular expressions for password validation
  const hasUppercase = /[A-Z]/.test(password);
  const hasLowercase = /[a-z]/.test(password);
  const hasNumber = /\d/.test(password);
  const hasSpecialChar = /[!@#$%^&*()\-_=+{}[\]|\\;:'",<.>/?]/.test(password);

  if (password.length < 8) {
    return 'Password must be at least 8 characters long';
  }

  if (!hasUppercase) {
    return 'Password must contain at least one uppercase letter';
  }

  if (!hasLowercase) {
    return 'Password must contain at least one lowercase letter';
  }

  if (!hasNumber) {
    return 'Password must contain at least one numeric character';
  }

  if (!hasSpecialChar) {
    return 'Password must contain at least one special character';
  }

  return '';
  };