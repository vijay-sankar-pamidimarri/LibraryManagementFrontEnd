function removeBook(){
    fetch("http://localhost:4508/Library-Manger-Book/getAll")
    .then(respsone =>{
        document.getElementById("bookId").value=respsone.status;
        return respsone.json();
    })
    .then(data =>{
        console.log(data);
    })
    .catch(error =>{
        document.getElementById("bookId").textContent="Request Is Failed To Get";

    });
    
}


function addBook() {
  const book = {
    bookName: document.getElementById("bookName").value,
    ActiveLink: document.getElementById("ActiveLink").value,
    authorName: document.getElementById("author").value,
    title: document.getElementById("Title").value,
    category: document.getElementById("genre").value // ✅ fixed spelling
  };

  fetch("http://localhost:4508/Library-Manger-Book/CreateBook", {
    method: "POST",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify(book)
  })
  .then(response => {
    if (!response.ok) {
      throw new Error("Failed to add book");
    }
    return response.json(); 
  })
  .then(data => {
    const tableBody = document.querySelector("#booksTable tbody");
    const newRow = tableBody.insertRow();

    newRow.insertCell().textContent = data.bookId;
    newRow.insertCell().textContent = data.bookName;
    newRow.insertCell().textContent = data.authorName;
    newRow.insertCell().textContent = data.catgeory; // ✅ also fixed here
    newRow.insertCell().textContent = data.title;
    newRow.insertCell().innerHTML = `<a href="${data.activeLink}" target="_blank">Link</a>`;

    // Clear input fields
    document.getElementById("bookName").value = "";
    document.getElementById("author").value = "";
    document.getElementById("genre").value = "";
    document.getElementById("Title").value = "";
    document.getElementById("ActiveLink").value = "";
  })
  .catch(error => {
    console.error("Error adding book:", error);
    alert("Something went wrong");
  });
}

// --------------------------------------------------------------------------

function removeBook() {
    const bookId = document.getElementById("bookId").value;

    if (!bookId) {
        alert("Please enter a Book ID");
        return;
    }

    fetch("http://localhost:4508/Library-Manger-Book/deleteById", {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify({ id: parseInt(bookId) })
    })
    .then(response => {
        if (!response.ok) {
            return response.text().then(errorMsg => {
                throw new Error(errorMsg);
            });
        }
        return response.json();
    })
    .then(data => {
        displayBookInTable(data);
    })
    .catch(error => {
        alert("Error: " + error.message);
        console.error("Error:", error);
    });
}

function displayBookInTable(book) {
    const table = document.getElementById("bookTable");
    const tbody = document.getElementById("bookTableBody");

    const row = document.createElement("tr");

    row.innerHTML = `
        <td>${book.bookId}</td>
        <td>${book.bookName}</td>
        <td>${book.authorName}</td>
        <td>${book.title}</td>
        <td>${book.category}</td>
        <td><a href="${book.activeLink}" target="_blank">View</a></td>
    `;

    tbody.appendChild(row);
    table.classList.remove("hidden");
}


function updateBook() {
    const bookId = parseInt(document.getElementById("bookId").value);
    const bookName = document.getElementById("bookName").value;
    const author = document.getElementById("author").value;
    const genre = document.getElementById("genre").value;
    const title = document.getElementById("title").value;
    const activeLink = document.getElementById("activeLink").value;

    const requestBody = {
        bookDTo: {
            bookName: bookName,
            authorName: author,
            catgeory: genre,
            title: title,
            ActiveLink: activeLink
        },
        id: bookId
    };

    fetch("http://localhost:4508/Library-Manger-Book/updateById", {
        method: "PUT",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify(requestBody)
    })
    .then(response => {
        if (!response.ok) {
            throw new Error("Failed to update book");
        }
        return response.json();
    })
    .then(updatedBook => {
        alert("Book updated successfully!");
        updateBookRow(updatedBook);
        clearForm();
    })
    .catch(error => {
        console.error("Error:", error);
        alert("Book update failed.");
    });
}

function updateBookRow(book) {
    const tableBody = document.getElementById("tableBody");

    const existingRow = document.querySelector(`#tableBody tr[data-id='${book.id}']`);
    if (existingRow) {
        tableBody.removeChild(existingRow);
    }

    const row = document.createElement("tr");
    row.setAttribute("data-id", book.id);

    row.innerHTML = `
        <td>${book.id}</td>
        <td>${book.bookName}</td>
        <td>${book.authorName}</td>
        <td>${book.catgeory}</td>
        <td>${book.title}</td>
        <td>${book.activeLink}</td>
    `;

    tableBody.appendChild(row);
}

function clearForm() {
    document.getElementById("bookId").value = "";
    document.getElementById("bookName").value = "";
    document.getElementById("author").value = "";
    document.getElementById("genre").value = "";
    document.getElementById("title").value = "";
    document.getElementById("activeLink").value = "";
}

