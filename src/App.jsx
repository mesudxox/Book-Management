import React from 'react';
import './App.css';

const MyBookShelf = ({ books, onDelete, onToggleRead }) => {
  return (
    <div className="shelf-container">
      <h1 className="collection-header">My Book Collection</h1>
      <h2 className="collection-stats">
        Number of books: <span className="book-count">{books.length}</span>
      </h2>

      <div className="shelf-grid">
        {books.map((b) => (
          <div className="shelf-item" key={b.id}>
            <div className="shelf-info">
              <h3 className="shelf-title">{b.title}</h3>
              <a href={b.link} target="_blank" rel="noopener noreferrer" className="shelf-author">
                {b.author}
              </a>
            </div>
            <div className="shelf-actions">
              <button 
                className="btn-read" 
                onClick={() => onToggleRead(b.id)}
                style={{ opacity: b.isRead ? 0.6 : 1 }}
              >
                {b.isRead ? '✓ Read' : 'Mark Read'}
              </button>
              <button className="btn-delete" onClick={() => onDelete(b.id)}>
                Remove
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

const BookItem = ({ book, stored }) => {
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
};

const Display = (props) => {
  if (props.books.length === 0) return null;
  return (
    <div className="results-section">
      <h4 style={{ color: 'white', textAlign: 'center', marginBottom: '20px' }}>Search results</h4>
      <div className="book-grid">
        {props.books.map((book, index) => (
          <BookItem stored={props.storage} book={book} key={index} />
        ))}
      </div>
    </div>
  );
};

const Search = ({ searchTerm, onSearch }) => {
  return (
    <>
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
      {!searchTerm && <p className="search-hint-outside">Search for your book</p>}
    </>
  );
};


const App = () => {
  const [isSettingsOpen, setIsSettingsOpen] = React.useState(false);
  const [searchTerm, setSearchTerm] = React.useState(localStorage.getItem('searchTerm') || "react");
  const [fetchedBooks, setFetchedBooks] = React.useState([]);
  const [isLoading, setIsLoading] = React.useState(false);
  const [myBooks, setMyBooks] = React.useState(
    JSON.parse(localStorage.getItem('myCollection')) || []
  );

  const collectionRef = React.useRef(null);
  const aboutRef = React.useRef(null);

  const scrollToCollection = (e) => {
    e.preventDefault();
    setIsSettingsOpen(false);
    collectionRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const scrollToAbout = (e) => {
    e.preventDefault();
    setIsSettingsOpen(false);
    aboutRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const handleSearch = (event) => {
    setSearchTerm(event.target.value);
  };

  const updateBooks = (book) => {
    const newBook = { ...book, id: Date.now(), isRead: false };
    setMyBooks((prevBooks) => [...prevBooks, newBook]);
  };

  const handleDelete = (bookId) => {
    setMyBooks((prevBooks) => prevBooks.filter((book) => book.id !== bookId));
  };

  const toggleReadStatus = (bookId) => {
    setMyBooks((prevBooks) =>
      prevBooks.map((book) =>
        book.id === bookId ? { ...book, isRead: !book.isRead } : book
      )
    );
  };

  React.useEffect(() => {
    localStorage.setItem("searchTerm", searchTerm);
  }, [searchTerm]);

  React.useEffect(() => {
    localStorage.setItem('myCollection', JSON.stringify(myBooks));
  }, [myBooks]);

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

  return (
    <div className="container">
      <header className="main-header">
        <div className="logo-xox">XOX</div>
        <h1 className="main-title">My reading place</h1>
        
        <div className="settings-wrapper">
          <button 
            className="settings-trigger" 
            onClick={() => setIsSettingsOpen(!isSettingsOpen)}
          >
            Settings ⚙️
          </button>
          
          {isSettingsOpen && (
            <div className="settings-dropdown">
              <a href="#collection" onClick={scrollToCollection}>My Collection</a>
              <a href="#about" onClick={scrollToAbout}>About & Contact</a>
              <a href="mailto:mesudxox@gmail.com">Direct Email</a>
              <div className="dropdown-divider"></div>
              <button className="btn-clear-data" onClick={() => {
                if(window.confirm("Clear all data and reset app?")) {
                  localStorage.clear();
                  window.location.reload();
                }
              }}>Reset App</button>
            </div>
          )}
        </div>
      </header>

      <Search searchTerm={searchTerm} onSearch={handleSearch} />
      
      {isLoading ? (
        <div className="loader">Searching...</div>
      ) : (
        <Display storage={updateBooks} books={fetchedBooks} />
      )}
      
      <div ref={collectionRef} style={{ width: '100%', display: 'flex', justifyContent: 'center' }}>
        <MyBookShelf 
          books={myBooks} 
          onDelete={handleDelete} 
          onToggleRead={toggleReadStatus} 
        />
      </div>

      <footer className="main-footer" ref={aboutRef}>
        <div className="footer-content">
          <h2 className="footer-title">About the Developer</h2>
          <div className="footer-grid">
            <div className="footer-info">
              <p><strong>GitHub:</strong> <a href="https://github.com/mesudxox" target="_blank" rel="noreferrer">mesudxox</a></p>
              <p><strong>Email:</strong> mesudxox@gmail.com</p>
              <p><strong>Project:</strong> XOX Book Tracker</p>
            </div>
            <div className="footer-bio">
              <p>Created with passion for readers. This application helps you discover new adventures and organize your personal library in a 3D immersive environment.</p>
            </div>
          </div>
          <div className="footer-bottom">
            &copy; 2026 MESUDXOX. All rights reserved.
          </div>
        </div>
      </footer>
    </div>
  );
};

export default App;