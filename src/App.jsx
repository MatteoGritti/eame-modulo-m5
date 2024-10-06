import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Card, Button, Form } from 'react-bootstrap';
import Welcome from './Welcome';
import CommentArea from './CommentArea';
import './App.css';

function App() {
  const [books, setBooks] = useState([]);
  const [activeGenre, setActiveGenre] = useState('sports');
  const [selectedBook, setSelectedBook] = useState(null);
  const [reviewsCount, setReviewsCount] = useState({});

  const fetchBooksByGenre = (genre) => {
    return fetch(`https://www.googleapis.com/books/v1/volumes?q=subject:${genre}&maxResults=12`)
      .then((response) => response.json())
      .then((data) => data.items || []);
  };

  const fetchBooksForAllGenres = () => {
    Promise.all([
      fetchBooksByGenre('sports'),
      fetchBooksByGenre('fiction'),
      fetchBooksByGenre('thriller'),
      fetchBooksByGenre('fantasy')
    ]).then((results) => {
      const combinedBooks = [].concat(...results);
      setBooks(combinedBooks);

      const updatedReviewsCount = { ...reviewsCount }; 
      combinedBooks.forEach((book) => {
        if (!updatedReviewsCount[book.id]) {
          updatedReviewsCount[book.id] = 0;
        }
      });
      setReviewsCount(updatedReviewsCount);
    });
  };

  useEffect(() => {
    if (activeGenre === 'all') {
      fetchBooksForAllGenres();
    } else {
      fetchBooksByGenre(activeGenre).then((genreBooks) => {
        setBooks(genreBooks);

        const updatedReviewsCount = { ...reviewsCount };
        genreBooks.forEach((book) => {
          if (!updatedReviewsCount[book.id]) {
            updatedReviewsCount[book.id] = 0;
          }
        });
        setReviewsCount(updatedReviewsCount);
      });
    }
  }, [activeGenre]);

  const handleBookClick = (book, event) => {
    if (event.target.tagName === 'TEXTAREA' || event.target.tagName === 'SELECT') {
      return;
    }

    if (selectedBook === book.id) {
      setSelectedBook(null);
    } else {
      setSelectedBook(book.id);
    }
  };

  const handleSubmitReview = (bookId) => {
    setReviewsCount((prevCounts) => ({
      ...prevCounts,
      [bookId]: (prevCounts[bookId] || 0) + 1
    }));
  };

  return (
    <>
      {/* Header con Navbar */}
      <header className="d-flex justify-content-center align-items-center p-3 bg-dark text-white">
        <nav className="ml-5">
          <ul className="nav">
            <li className="nav-item">
              <a
                className={`nav-link ${activeGenre === 'all' ? 'active-link' : ''}`}
                href="#"
                onClick={() => setActiveGenre('all')}
              >
                Tutti i generi
              </a>
            </li>
            <li className="nav-item">
              <a
                className={`nav-link ${activeGenre === 'sports' ? 'active-link' : ''}`}
                href="#"
                onClick={() => setActiveGenre('sports')}
              >
                Sport
              </a>
            </li>
            <li className="nav-item">
              <a
                className={`nav-link ${activeGenre === 'fiction' ? 'active-link' : ''}`}
                href="#"
                onClick={() => setActiveGenre('fiction')}
              >
                Fiction
              </a>
            </li>
            <li className="nav-item">
              <a
                className={`nav-link ${activeGenre === 'thriller' ? 'active-link' : ''}`}
                href="#"
                onClick={() => setActiveGenre('thriller')}
              >
                Thriller
              </a>
            </li>
            <li className="nav-item">
              <a
                className={`nav-link ${activeGenre === 'fantasy' ? 'active-link' : ''}`}
                href="#"
                onClick={() => setActiveGenre('fantasy')}
              >
                Fantasy
              </a>
            </li>
          </ul>
        </nav>
      </header>

      <Welcome />

      {/* Main con card dei libri */}
      <Container className="my-5 d-flex justify-content-center">
        <Row>
          {books.map((book) => (
            <Col key={book.id} sm={12} md={6} lg={3} className="mb-4">
              <Card
                className={`h-100 d-flex flex-column justify-content-between ${
                  selectedBook === book.id ? 'selected' : ''
                }`}
                onClick={(event) => handleBookClick(book, event)}
              >
                <Card.Img variant="top" src={book.volumeInfo.imageLinks?.thumbnail} alt={book.volumeInfo.title} />
                <Card.Body className="d-flex flex-column">
                  <Card.Title>{book.volumeInfo.title}</Card.Title>
                  <Card.Text>{book.volumeInfo.authors?.join(', ')}</Card.Text>

                  {/* Mostra il conteggio delle recensioni inviate */}
                  <p>Recensioni inviate: {reviewsCount[book.id]}</p>

                  {selectedBook === book.id && (
                    <CommentArea
                      asin={book.id}
                      handleSubmitReview={() => handleSubmitReview(book.id)}
                    />
                  )}
                </Card.Body>
              </Card>
            </Col>
          ))}
        </Row>
      </Container>

      {/* Footer */}
      <footer className="text-center p-3 bg-dark text-white">
        <p>Privacy Policy | &copy; 2024 Tutti i diritti riservati</p>
      </footer>
    </>
  );
}

export default App;