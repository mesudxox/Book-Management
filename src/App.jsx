import React from 'react';

const MyBookShelf = ({books}) => {
  return (<div> <h2>My book collection</h2> 
      <h3 style={{ color: 'blue' }}>{books.map((b, index) => <div key={index}>{b.title} by {b.author}</div>)}</h3>
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
  const searchedTerm=listOfBooks.filter(book=>
    book.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    book.author.toLowerCase().includes(searchTerm.toLowerCase())
  );
  const [myBooks, setMyBooks] = React.useState(
  // Convert the string back into a real JavaScript array
  JSON.parse(localStorage.getItem('myCollection')) || []
);
 React.useEffect(() => {
  // Convert the array into a string so localStorage can hold it
  localStorage.setItem('myCollection', JSON.stringify(myBooks));
}, [myBooks]);
  const updateBooks=(book)=>{
    setMyBooks((prevBooks) => [...prevBooks, book]);
  }
  return (
    <div>
      <h1>My Book Management </h1>
      <Search searchTerm={searchTerm} onSearch={handleSearch} />
      <Display storage={updateBooks} books={searchedTerm} />
      <MyBookShelf books={myBooks}/>
    </div>
  );
};

export default App;