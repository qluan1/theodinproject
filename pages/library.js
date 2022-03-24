let bookCollection = [];

function Book(title, author) {
    this.title = title;
    this.author = author;
    this.hasRead = false;
}

bookCollection.push(new Book('Harry Potter', 'J.K. Rowling'));
bookCollection.push(new Book('Pride and Prejudice', 'Jane Austen'));
bookCollection.push(new Book('A Song of Ice and Fire', 'George R.R. Martin'));
bookCollection.push(new Book('Don Quixote', 'Miguel de Cervantes'));
bookCollection.push(new Book('A Tale of Two Cities', 'Charles Dickens'));
bookCollection.push(new Book('The Lord of the Rings', 'J.R.R. Tolkien'));

for (let i of [0, 1, 3, 5]) {
    bookCollection[i].hasRead = true;
}

Book.prototype.removeBook = function(event) {
    // remove book from book Collection array
    let target;
    for (let i = 0; i < bookCollection.length; i++) {
        if (bookCollection[i] == this) {
            target = i;
            break;
        }
    }
    if (target == undefined) {
        console.log('an error occured while removing book.');
        return;
    }
    bookCollection.splice(target, 1);
    // remove book from DOM
    let card = event.currentTarget.parentNode;
    let cardContainer = document.querySelector('.card-container');
    cardContainer.removeChild(card);
}

Book.prototype.createElement = function() {
    let card = document.createElement('div');
    card.className = 'card';

    let bookTitle = document.createElement('div');
    bookTitle.className = 'card-book-name';
    bookTitle.textContent = this.title;
    card.appendChild(bookTitle);

    let bookAuthor = document.createElement('div');
    bookAuthor.className = 'card-book-author';
    bookAuthor.textContent = this.author;
    card.appendChild(bookAuthor);

    let bookReadLabel = document.createElement('label');
    bookReadLabel.className = 'card-read-label';

    let bookReadCheckBox = document.createElement('input');
    bookReadCheckBox.className = 'card-read-checkbox';
    bookReadCheckBox.setAttribute('type', 'checkbox');
    bookReadCheckBox.checked = this.hasRead;
    bookReadCheckBox.addEventListener('change', ()=> {
        this.hasRead = bookReadCheckBox.checked;
    })
    bookReadLabel.appendChild(bookReadCheckBox);

    let bookReadLabelText = document.createElement('span');
    bookReadLabelText.className = 'card-read-text';
    bookReadLabelText.textContent = 'I have read this book.';
    bookReadLabel.appendChild(bookReadLabelText);

    card.appendChild(bookReadLabel);
    
    let removeBookButton = document.createElement('input');
    removeBookButton.className = 'remove-book-button';
    removeBookButton.setAttribute('type', 'image');
    removeBookButton.setAttribute('src', '../img/close-circle.svg');
    removeBookButton.addEventListener('click', (event)=>{
        this.removeBook(event);
    });
    card.appendChild(removeBookButton);

    return card;
}




function isBookDuplicate(title, author) {
    for (let book of bookCollection) {
        if (book.title.toLowerCase() === title.toLowerCase() && book.author.toLowerCase() === author.toLowerCase()) {
            return true;
        } 
    }
    return false;
}

function refreshCardContainer() {
    let cardContainer = document.querySelector('.card-container');
    let addCard = document.getElementById('add-card');
    while (cardContainer.firstChild != addCard) {
        cardContainer.removeChild(cardContainer.firstChild);
    }

    for (let book of bookCollection) {
        cardContainer.insertBefore(book.createElement(), addCard);
    }
}

function showErrorMessage(s) {
    document.querySelector('.form-error-message').textContent=s;
}

function clearForm() {
    document.getElementById('title').value = '';
    document.getElementById('author').value = '';
    document.getElementById('form-no').checked = true;
    showErrorMessage('');
}

function isTitleInvalid(title) {
    if (typeof(title) != 'string' || title === '') {
        return true;
    }
    return false;
}

function isAuthorInvalid(author) {
    if (typeof(author) != 'string' || author === '') {
        return true;
    }
    return false;
}

function addNewBook() {
    let title = document.getElementById('title').value.trim();
    let author = document.getElementById('author').value.trim();
    let read = document.getElementById('form-yes').checked;

    if (isTitleInvalid(title)) {
        showErrorMessage('Book title is invalid.');
        return;
    }

    if (isAuthorInvalid(author)) {
        showErrorMessage('Author name is invalid.');
        return;
    }

    if (isBookDuplicate(title, author)) {
        showErrorMessage('Book is already in your collection.');
        return;
    }

    let newBook = new Book(title, author);
    newBook.hasRead = read;

    bookCollection.push(newBook);
    document.querySelector('.card-container')
            .insertBefore(newBook.createElement(), document.getElementById('add-card'));
    showErrorMessage('');
    closeForm();
}


const modal = document.getElementById('modal');
function showForm() {
    clearForm();
    modal.style.display = 'block';
}

function closeForm() {
    modal.style.display = 'none'; 
}

window.onload = function (){
    refreshCardContainer();
    document.getElementById('add-card').addEventListener('click', showForm);
}

window.onclick = function (event) {
    if(event.target == modal) {
        closeForm();
    }
}
