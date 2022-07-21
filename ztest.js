let array = [ { id: 15 }, { id: -1 }, { id: 5 }, { id: 3 }];

let newArray = array.filter(function (el) {
 if (el.id > 4) {
    return true;
  } });
console.log( newArray);