import React from 'react';

const MyBookShelf = ({books, onDelete}) => {
  return (<div> <h2>My book collection</h2> 
      <h3 style={{ color: 'blue' }}>{books.map((b, id) => 
      <div key={b.id}>{b.title} by {b.author}
      <button onClick={() => onDelete(b.id)}>Delete</button></div>)}</h3>
      </div>);
};
const BookItem=({book,stored} )=>{
  const [isHovered, setIsHovered] = React.useState(false);
  const handleButtonIn = () => {
    setIsHovered(true);  };

  const handleButtonLeave = () => {
    setIsHovered(false);
  };
  return (
    <div>

        <button onMouseEnter={handleButtonIn} onMouseLeave={handleButtonLeave} onClick={() => stored(book)} >
        {isHovered ? "Add" : `${book.title} by ${book.author}`}
        </button>
    </div>
  );
}
const Display = (props) => {
  
  return (
    <div>
      <h2>Display Books Component</h2>
      <ul>
        {props.books.map((book, index) => (
          <BookItem stored={props.storage} book={book} key={index} />
        ))}
      </ul>
    </div>
  );
}
          
const Search=(props) => {
  return (
    <div> 
      <label htmlFor="search">Search:</label>
      <input type="text" id="search" value={props.searchTerm} onChange={props.onSearch}/>
    </div>);
}
    

const App = () => {
  const listOfBooks = [
    { title: "The Road to React", author: "Robin Wieruch" },
    { title: "JavaScript: The Good Parts", author: "Douglas Crockford" },
    { title: "Clean Code", author: "Robert C. Martin" }
  ];
  const [searchTerm, setSearchTerm] = React.useState(localStorage.getItem('searchTerm')||"react");
  
  React.useEffect(()=>{
    localStorage.setItem("searchTerm", searchTerm);
  } ,[searchTerm])

  const handleSearch=(event)=>{
    setSearchTerm(event.target.value);
  }

  const [fetchedBooks, setFetchedBooks] = React.useState([]);
  const [isLoading, setIsLoading] = React.useState(false);
  
  React.useEffect(() => {
  if (!searchTerm) {
    setFetchedBooks([]);
    return;
  }

  setIsLoading(true);

  fetch(`https://openlibrary.org/search.json?title=${searchTerm}&limit=5`)
    .then((response) => response.json())
    .then((data) => {
      const results = data.docs.map((book) => ({
        title: book.title,
        author: book.author_name ? book.author_name[0] : "Unknown",
      }));
      
      setFetchedBooks(results);
      setIsLoading(false);
    })
    .catch((err) => {
      console.error(err);
      setIsLoading(false);
    });
}, [searchTerm]);




  const [myBooks, setMyBooks] = React.useState(
  // Convert the string back into a real JavaScript array
  JSON.parse(localStorage.getItem('myCollection')) || []
);
 React.useEffect(() => {
  // Convert the array into a string so localStorage can hold it
  localStorage.setItem('myCollection', JSON.stringify(myBooks));
}, [myBooks]);
  const updateBooks=(book)=>{
    const newBook={...book, id: Date.now()};
    setMyBooks((prevBooks) => [...prevBooks, newBook]);
  }
const [deletedBooks, setDeletedBooks] = React.useState([]);
const handleDelete=(bookId)=>{
  setMyBooks((prevBooks) => prevBooks.filter((book) => book.id !== bookId));
  setDeletedBooks((prevDeleted) => [...prevDeleted, bookId]);
}

  return (
    <div>
      <h1>My Book Management </h1>
      <Search searchTerm={searchTerm} onSearch={handleSearch} />
      <Display storage={updateBooks} books={fetchedBooks} />
      <MyBookShelf books={myBooks} onDelete={handleDelete} />
    </div>
  );
};

export default App;