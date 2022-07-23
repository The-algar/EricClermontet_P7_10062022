/* eslint-disable no-undef */
function addItem(i) {
  var li = document.createElement('li');
  li.appendChild(document.createTextNode(i));
  li.className = 'item';
  document.getElementById('list').appendChild(li);
}

var counter = 2;
document.getElementById('btn').addEventListener('click', function() {
  addItem(counter++);
});

document.getElementById("list").addEventListener("click", function(el) {
  if (el.target && e.target.matches("li.item")) {
    e.target.className = "foo"; // new class name here
    alert("clicked " + e.target.innerText);
  }
});