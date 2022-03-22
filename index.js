function showBooks (categoriesList, tableList, books)  {
  for(var index=0; index<books.length; index++) {
    var book = books[index];
    let row = document.createElement("tr");
    let ratingHtml = "";

    var total = 5;
    var i = 5 - book.rating;
    while (i>0) {
      ratingHtml += '<img class="star" src="./images/outline-star-16.ico" />';
      i--;
      total--;
    }
    while (total > 0) {
      ratingHtml += '<img class="star" src="./images/star-16.ico" />';
      total--;
    }

    row.innerHTML =
      `<td><input type="checkbox" class="checkbox" id="checkbox${index}"></td>` +
      `<td><img src="${book.img}" height="110" width="90"/></td>` +
      `<td>${book.title + ratingHtml}</td>` +
      `<td>${book.authors}</td><td>${book.year}</td><td>${book.price}</td>` +
      `<td>${book.publisher}</td><td>${book.category}</td>`;

    row.setAttribute("class", "row");
    row.setAttribute("id", "row" + index);

    tableList.append(row);
  }
};

function applyFilter (categories, books){
    for(var index=0; index < books.length; index++){
      var book = books[index];
      const rowNode = document.querySelector("#row" + index);
      rowNode.style.display = "";
      if (book.category !== categories.value && categories.value !== "Category") {
        rowNode.style.display = "none";
      }
    }
};


function searchBooks (searchText, books)  {
    let notFound = true;
    for(var index=0; index<books.length; index++){
      var book = books[index];
      const rowNode = document.querySelector("#row" + index);
      rowNode.style.backgroundColor = "";
      if (searchText.value !== "" && book.title.toLowerCase().includes(searchText.value.toLowerCase())) {
          rowNode.style.backgroundColor = "blue";
        notFound = false;
      }
    }
    if (notFound && searchText.value !== "") alert("not found.");
  // };
};


/**
 * Add to Cart Action
 */
function droppingCart (cartNode, tableList, cart)  {
    let checked = undefined;
    for(var i=0; i<tableList.childNodes.length; i++){
      var rowNode = tableList.childNodes[i];
      if (rowNode.nodeType == Node.ELEMENT_NODE) {
        const checkboxNode = rowNode.querySelector(".checkbox");
        if (checkboxNode.checked) {
          checkboxNode.checked = false;
          checked = rowNode;
        }
      }
    }
    if (checked) {
      let quantity;
      let quantityInput = window.prompt("Please input the quantity:");

      quantity = parseInt(quantityInput);
      if (/[a-zA-Z.]/.test(quantityInput)) quantity = undefined;

      if (quantity) {
        let i = 0;
        //Add the item(s) to the cart.
        while (i < quantity) {
          cart.push(checked);
          i++;
        }
        cartNode.innerHTML = "(" + cart.length + ")";
      } else {
        window.alert("please input the integer.");
      }
    } else {
      window.alert("No item has been selected.");
    }
  // };
};

function Empty (tableList, cartNode, cart)  {
    if (confirm("Is that ok to empty the shopping cart?")) {
      cart.splice(0, cart.length);
      // uncheck(tableList);
      for(var i=0; i<tableList.childNodes.length; i++){
        var rowNode = tableList.childNodes[i];
        if (rowNode.nodeType == Node.ELEMENT_NODE) {
          const checkboxNode = rowNode.querySelector(".checkbox");
          if (checkboxNode.checked) {
            checkboxNode.checked = false;
          }
        }
      }
      cartNode.innerHTML = "(" + cart.length + ")";
    }
};

function getJsonObject(path, success, error) {
  var xhr = new XMLHttpRequest();
  xhr.onreadystatechange = function () {
    if (xhr.readyState === XMLHttpRequest.DONE) {
      if (xhr.status === 200) {
        if (success) success(JSON.parse(xhr.responseText));
      } else {
        if (error) error(xhr);
      }
    }
  };
  xhr.open("GET", path, true);
  xhr.send();
}

window.onload = () => {
  let books = [];
  const cart = [];
  getJsonObject(
    "data.json",
    function (data) {
      books = data;  //import the book list from json file
      const filterButton = document.querySelector("#filterButton");
      const searchButton = document.querySelector("#search_Button");
      const addButton = document.querySelector("#add_Button");
      const resetButton = document.querySelector("#reset_Button");

      showBooks(document.querySelector("select#categories"), document.querySelector("#listBox table tbody"), books);

      filterButton.onclick = () => {
        applyFilter(document.querySelector("select#categories"), books);
      }

      searchButton.onclick = () => {
        searchBooks(document.querySelector("#keyword"), books);
      }

      addButton.onclick = () => {
        droppingCart(document.querySelector("#cartNum"), document.querySelector("#listBox table tbody"), cart);
      }

      resetButton.onclick = () => {
        Empty(document.querySelector("#listBox table tbody"), document.querySelector("#cartNum"), cart);
      };

      const checkBoxes = document.querySelectorAll(".checkbox");
      checkBoxes.forEach((checkBox) => {
        checkBox.onclick = () => {
          if (checkBox.checked) {
            checkBoxes.forEach((each) => {
              if (each.id !== checkBox.id) {
                each.checked = false;
              }
            });
          }
        };
      });
    },
    function (xhr) {
      console.error(xhr);
    }
  );
};
