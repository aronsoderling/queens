function render(n) {
  if(!n) n = 0
  var rows = allSolutions(8)[n];

  var div = document.getElementById('board');
  div.innerHTML = '';
  drawBoard(rows, div);

  //int -> [[int]]
  function allSolutions(n) {
    return (iterate([[]], concatMap(extendSolution))(n))[n];
  }

  // [int] -> [[int]]
  function extendSolution(partialSolution) {
    return [0,1,2,3,4,5,6,7].filter(okToAdd(partialSolution))
      .map(pushStart(partialSolution));
  }

  //[int] -> int -> bool
  function okToAdd(partialSolution) {
    return function (pos) {
      return all([succ, pred, id], okToAddGivenDir(partialSolution, pos));
    };
  }

  //[int] -> int -> fn -> bool
  function okToAddGivenDir(partialSolution, pos){
    return function(dirFn) {
      return and(
          zipWith(
            tail(iterate(pos, dirFn)(partialSolution.length)), partialSolution, nonEqual));
    }
  }
}
function onInputChange(event) {
  render(event.target.value);
}

//drawing the board
function drawBoard(rows, div) {
  var rowText;
  var row;
  var content;

  rows.forEach(function(pos, i) {
    row = createRowElement(pos, i);
    div.appendChild(row);
  });
  function createRowElement(pos, rowIndex) {
    var row = document.createElement('span');
    row.classList.add('row');
    var icon;
    var rowBreak = document.createElement('br');
    for(var i = 0; i < 8; ++i) {
      icon = document.createElement('span');
      icon.classList.add('square');
      if(pos === i) {
        icon.textContent = '♕';
      }
      icon.setAttribute('style', getIconBg(i, rowIndex))
      row.appendChild(icon);
    }
    row.appendChild(rowBreak);
    return row;
  }
  function getIconBg(i, rowIndex) {
    var white = 'background-color: white';
    var grey = 'background-color: grey';
    if(rowIndex % 2 === 0) {
      if(i % 2 === 0) {
        return white;
      } else {
        return grey;
      }
    } else {
      if(i % 2 !== 0) {
        return white;
      } else {
        return grey;
      }
    }
    
  }
}

//helper functions
function pushStart(arr){
  return function(e) {
    return [e].concat(arr);
  }
}
function all(arr, fn) {
  return arr.every(fn);
}
function and(arr) {
  return all(arr, function(e){
    return e === true;
  });
}
function tail(arr) {
  return arr.splice(1);
}
function id(i) {
  return i;
}

function succ(i) {
  return i += 1;
}
function pred(i) {
  return i -= 1;
}
function nonEqual(x,y) {
  return x !== y;
}
function zipWith(l1, l2, fn) {
  return l1.map(function(e, i) {
    return fn(e, l2[i]);
  });
}
function iterate(s, fn) {
  return function(lim) {
    var arr = [s];
    while(arr.length <= lim) {
      s = fn(s);
      arr.push(s);
    }
    return arr;
  }
}
// [[]] -> []
function concatMap(fn) {
  return function(arr) {
    return arr.map(fn).reduce(function(a,b) {
      return a.concat(b);
    });
  };
}
