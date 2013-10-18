/* This Source Code Form is subject to the terms of the Mozilla Public
 License, v. 2.0. If a copy of the MPL was not distributed with this
 file, You can obtain one at http://mozilla.org/MPL/2.0/. */

function $id(id) {
  return document.getElementById(id);
}

function $expr(expr, elem) {
  elem = elem ? elem : document;
  var nodeList = elem.querySelectorAll(expr);
  var size = nodeList.length;
  var list = [];

  for (var i = 0; i < size; i++) {
    list.push(nodeList[i]);
  }

  return list;
}

/**
 * Get l10n
 */

function _(key, args, fallback) {
  return navigator.mozL10n.get(key, args, fallback);
}

(function() {
  function extend(destination, source) {
    for (var property in source)
    destination[property] = source[property];
    return destination;
  }

  extend(window, {
    extend: extend
  });
})();

function emptyFunction() {

}

function log(msg) {
  console.log(msg);
}

/**
 * Execute the async functions
 * The functions must call the given callback functions when executed.
 */

function syncExecuteAsyncFuncs(asyncFuncs, onFinished) {
  if (asyncFuncs.length == 0) {
    onFinished();
  }

  function execAsyncFunc(func) {
    func(function async_callback() {
      if (asyncFuncs.length > 0) {
        execAsyncFunc(asyncFuncs.shift());
      } else {
        onFinished();
      }
    });
  }

  execAsyncFuncs(asyncFuncs.shift());
}

function removeFromArray(objOrFunc, array) {
  var newArray = [];

  array.forEach(function(i) {
    if (typeof objOrFunc === 'function' && objOrFunc(i)) {
      return;
    } else if (i === objOrFunc) {
      return;
    }
    newArray.push(i);
  });

  return newArray;
}

function convertToOutputFileName(path) {
  var arrayPath = path.split('/');
  var length = arrayPath.length;

  if (length <= 1) {
    return path;
  } else {
    return arrayPath[length - 2] + '_' + arrayPath[length - 1];
  }
}

function getFileName(path) {
  var arrayPath = path.split('/');
  return arrayPath[arrayPath.length - 1];
}

function toSizeInMB(sizeInByte) {
  if (isNaN(sizeInByte)) {
    return 0.00;
  } else {
    return parseInt(sizeInByte / 1024 /10.24) / 100;
  }
}

function parseDate(date) {
  var dt = new Date(date);
  var strDate = dt.getFullYear() + '-';

  if (dt.getMonth() < 9) {
    strDate += '0' + (dt.getMonth() + 1) + '-';
  } else {
    strDate += (dt.getMonth() + 1) + '-';
  }
  if(dt.getDay() < 9) {
    strDate += '0' + (dt.getDay() + 1);
  } else {
    strDate += dt.getDay() + 1;
  }
  return strDate;
}

function formatDate(timestamp) {
  var dt = new Date(timestamp);
  var year = dt.getFullYear();
  var month = dt.getMonth() + 1;
  var date = dt.getDate();

  var today = new Date();
  var curYear = today.getFullYear();
  var curMonth = today.getMonth() + 1;
  var curDate = today.getDate();

  if (curYear == year && curMonth == month && curDate == date) {
    return _('today');
  } else {
    return year + '-' + month + '-' + date;
  }
}

function formatTime(timestamp) {
  var dt = new Date(timestamp);
  var hour = dt.getHours();
  var minutes = dt.getMinutes();
  var time = '';
  if (hour < 10) {
    time += '0';
  }
  time += hour + ':';
  if (minutes < 10) {
    time += '0';
  }
  time += minutes;
  return time;
}