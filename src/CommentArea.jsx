import React, { useState, useEffect } from 'react';
import { Form, Button, ListGroup, Alert } from 'react-bootstrap';

const CommentArea = ({ asin, incrementReviewCount }) => {
  const [comments, setComments] = useState([]);
  const [newComment, setNewComment] = useState({ comment: '', rate: 1, elementId: asin });
  const [errorMessage, setErrorMessage] = useState('');
  const [successMessage, setSuccessMessage] = useState('');

  useEffect(() => {
    if (asin) {
      fetchComments(asin);
      setNewComment((prev) => ({ ...prev, elementId: asin }));
    }
  }, [asin]);

  const fetchComments = async (asin) => {
    try {
      const response = await fetch(`https://striveschool-api.herokuapp.com/api/books/${asin}/comments/`);
      if (response.ok) {
        const data = await response.json();
        setComments(data);
      } else {
        setErrorMessage('Errore durante il caricamento dei commenti.');
      }
    } catch (error) {
      console.error(error);
    }
  };

  const submitReview = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch(`https://striveschool-api.herokuapp.com/api/comments`, {
        method: 'POST',
        body: JSON.stringify(newComment),
        headers: {
          'Content-Type': 'application/json',
        },
      });
      if (response.ok) {
        fetchComments(asin);
        setNewComment({ comment: '', rate: 1, elementId: asin });
        incrementReviewCount(asin);
        setSuccessMessage('Recensione inviata con successo.');
        setErrorMessage('');
      } else {
        setErrorMessage('Errore durante l\'invio della recensione.');
      }
    } catch (error) {
      console.error(error);
      setErrorMessage('Errore durante l\'invio della recensione.');
    }
  };

  const deleteComment = async (commentId) => {
    try {
      const response = await fetch(`https://striveschool-api.herokuapp.com/api/comments/${commentId}`, {
        method: 'DELETE',
      });
      if (response.ok) {
        fetchComments(asin);
        setSuccessMessage('Commento eliminato.');
        setErrorMessage('');
      } else {
        setErrorMessage('Errore durante la cancellazione del commento.');
      }
    } catch (error) {
      console.error(error);
      setErrorMessage('Errore durante la cancellazione del commento.');
    }
  };

  return (
    <div>
      {errorMessage && <Alert variant="danger">{errorMessage}</Alert>}
      {successMessage && <Alert variant="success">{successMessage}</Alert>}
      <Form onSubmit={submitReview}>
        <Form.Group controlId="formComment">
          <Form.Label>Recensione</Form.Label>
          <Form.Control
            as="textarea"
            rows={3}
            value={newComment.comment}
            onChange={(e) => setNewComment({ ...newComment, comment: e.target.value })}
            required
          />
        </Form.Group>
        <Form.Group controlId="formRate">
          <Form.Label>Valutazione</Form.Label>
          <Form.Control
            as="select"
            value={newComment.rate}
            onChange={(e) => setNewComment({ ...newComment, rate: e.target.value })}
          >
            <option value="1">1</option>
            <option value="2">2</option>
            <option value="3">3</option>
            <option value="4">4</option>
            <option value="5">5</option>
          </Form.Control>
        </Form.Group>
        <Button variant="primary" type="submit">
          Invia
        </Button>
      </Form>
      <ListGroup className="mt-3">
        {comments.map((comment, index) => (
          <ListGroup.Item key={index}>
            <strong>{comment.rate} stelle</strong> - {comment.comment}
            <Button variant="danger" className="ml-2" onClick={() => deleteComment(comment._id)}>
              Elimina
            </Button>
          </ListGroup.Item>
        ))}
      </ListGroup>
    </div>
  );
};

export default CommentArea;