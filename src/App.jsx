import React from 'react';
import './App.css';

const MyBookShelf = ({books, onDelete, onToggleRead}) => {
  return (
    <div className="shelf-container"> 
      <h2 style={{color: 'white'}}>Number of books: <span className="book-count">{books.length}</span></h2> 
      <div className="shelf-grid">
        {books.map((b) => (
          <div key={b.id} className="shelf-item" style={{ 
              borderLeft: b.isRead ? '5px solid #4ade80' : '5px solid #94a3b8',
            }}> 
            <div className="shelf-info">
              <strong>{b.title}</strong>
              <a href={b.link} target="_blank" rel="noopener noreferrer" className="author-link">
                {b.author}
              </a>
            </div>
            
            <div className="shelf-actions">
              <button className="btn-delete" onClick={() => onDelete(b.id)}>Delete</button>
              <button className="btn-read" onClick={() => onToggleRead(b.id)}>
                {b.isRead ? "✅ Read" : "📖 Mark Read"}
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

const BookItem=({book,stored} )=>{
  return (
    <div 
      className="book-card" 
      style={{ backgroundImage: `url(${book.coverUrl})` }}
    >
      <div className="card-overlay">
        <h3>{book.title}</h3>
        <p>{book.author}</p>
        <button className="btn-add" onClick={() => stored(book)}>
          + Add to Shelf
        </button>
      </div>
    </div>
  );
}

const Display = (props) => {
  if (props.books.length === 0) return null;
  return (
    <div className="results-section">
      <h4 style={{color: 'white', textAlign: 'center'}}>Search results</h4>
      <div className="book-grid">
        {props.books.map((book, index) => (
          <BookItem stored={props.storage} book={book} key={index} />
        ))}
      </div>
    </div>
  );
}
          
const Search = ({ searchTerm, onSearch }) => {
  return (
   <div className="container">
  <header className="main-header">...</header>
  
  {/* SECTION 1: THE GLASS BOX */}
  <div className="search-section">
    <div className="search-container">
      <div className="book-wrapper">
        <div className="book-3d">
          <div className="book-side pages"></div>
          <div className="book-side spine"></div>
          <div className="book-side cover"></div>
        </div>
      </div>
      <input 
        className="search-input" 
        type="text" 
        placeholder="Search for your next adventure..." 
        value={searchTerm} 
        onChange={onSearch}
      />
    </div>
  </div>

  {/* SECTION 2: THE HINT (OUTSIDE THE BOX) */}
  {!searchTerm && <p className="search-hint-outside">Search for your book</p>}

  <div className="results-section">...</div>
</div>
  );
}

const App = () => {
  const [searchTerm, setSearchTerm] = React.useState(localStorage.getItem('searchTerm')||"react");
  const [fetchedBooks, setFetchedBooks] = React.useState([]);
  const [isLoading, setIsLoading] = React.useState(false);

  React.useEffect(()=>{
    localStorage.setItem("searchTerm", searchTerm);
  } ,[searchTerm])

  const handleSearch=(event)=>{
    setSearchTerm(event.target.value);
  }

  React.useEffect(() => {
    if (!searchTerm.trim()) {
      setFetchedBooks([]);
      setIsLoading(false); 
      return;
    }

    setIsLoading(true);

    const timer = setTimeout(() => {
      fetch(`https://openlibrary.org/search.json?title=${searchTerm}&limit=5`)
        .then((response) => response.json())
        .then((data) => {
          const results = data.docs.map((book) => ({
            title: book.title,
            author: book.author_name ? book.author_name[0] : "Unknown",
            link: `https://openlibrary.org${book.key}`,
            coverUrl: book.cover_i 
              ? `https://covers.openlibrary.org/b/id/${book.cover_i}-L.jpg` 
              : 'https://via.placeholder.com/400x600?text=No+Cover'
          }));
          setFetchedBooks(results);
          setIsLoading(false);
        })
        .catch((err) => {
          console.error(err);
          setIsLoading(false);
        });
    }, 500); 

    return () => clearTimeout(timer);
  }, [searchTerm]);

  const [myBooks, setMyBooks] = React.useState(
    JSON.parse(localStorage.getItem('myCollection')) || []
  );

  React.useEffect(() => {
    localStorage.setItem('myCollection', JSON.stringify(myBooks));
  }, [myBooks]);

  const updateBooks=(book)=>{
    const newBook={...book, id: Date.now(), isRead: false};
    setMyBooks((prevBooks) => [...prevBooks, newBook]);
  }

  const handleDelete=(bookId)=>{
    setMyBooks((prevBooks) => prevBooks.filter((book) => book.id !== bookId));
  }

  const toggleReadStatus=(bookId)=>{
    setMyBooks((prevBooks) =>
      prevBooks.map((book) =>
        book.id === bookId ? { ...book, isRead: !book.isRead } : book
      )
    );
  };

  return (
    <div className="container">
      <header className="main-header">
      <div className="logo-xox">XOX</div>
      <h1 className="main-title">My Book Management</h1>
    </header>
      <Search searchTerm={searchTerm} onSearch={handleSearch} />
      
      {isLoading ? (
        <div className="loader">Searching...</div>
      ) : (
        <Display storage={updateBooks} books={fetchedBooks} />
      )}
      
      <MyBookShelf books={myBooks} onDelete={handleDelete} onToggleRead={toggleReadStatus} />
    </div>
  );
};

export default App;