import React, { useState } from 'react';
import axios from 'axios';
import './Bookser.css';

const Bookser = () => {
    const [input, setInput] = useState('');
    const [books, setBooks] = useState([]);
    const [recommendations, setRecommendations] = useState({});

    const fetchBooks = async () => {
        try {
            console.log('Fetching books for input:', input);
            const response = await axios.get(
                `https://www.googleapis.com/books/v1/volumes?q=${input}&maxResults=10`
            );
            console.log('Books fetched successfully:', response.data.items);
            setBooks(response.data.items || []);
        } catch (error) {
            console.error('Error fetching books:', error);
        }
    };

    const fetchWorldCat = async (isbn) => {
        try {
            console.log('Fetching WorldCat URL for ISBN:', isbn);
            const worldCatUrl = `https://www.worldcat.org/search?q=isbn:${isbn}`;
            setRecommendations((prev) => ({
                ...prev,
                [isbn]: worldCatUrl,
            }));
            console.log('WorldCat URL set for ISBN:', isbn);
        } catch (error) {
            console.error('Error fetching WorldCat data:', error);
        }
    };

    const handleSearch = () => {
        console.log('Handling search for input:', input);
        fetchBooks();
        setRecommendations({});
    };

    return (
        <div className="container">
            <h1 className="title">Bookser</h1>
            <div className="search-area">
                <input
                    type="text"
                    className="input"
                    placeholder="Enter your search here"
                    value={input}
                    onChange={(e) => {
                        console.log('Input changed to:', e.target.value);
                        setInput(e.target.value);
                    }}
                />
                <button className="search-button" onClick={handleSearch}>
                    Search
                </button>
            </div>
            <div className="results">
                {books.map((book) => {
                    const isbn = book.volumeInfo.industryIdentifiers?.find(
                        (id) => id.type === 'ISBN_13'
                    )?.identifier;

                    console.log('Rendering book:', book.volumeInfo.title, 'ISBN:', isbn);

                    return (
                        <div key={book.id} className="book-card">
                            <h3>{book.volumeInfo.title}</h3>
                            <p>{book.volumeInfo.authors?.join(', ')}</p>
                            {isbn && (
                                <button
                                    className="recommendation-button"
                                    onClick={() => fetchWorldCat(isbn)}
                                >
                                    Find Libraries
                                </button>
                            )}
                            {recommendations[isbn] && (
                                <p className="recommendation">
                                    Available at: <a href={recommendations[isbn]} target="_blank" rel="noopener noreferrer">
                                        WorldCat
                                    </a>
                                </p>
                            )}
                            {book.volumeInfo.infoLink && (
                                <p className="recommendation">
                                    More info: <a href={book.volumeInfo.infoLink} target="_blank" rel="noopener noreferrer">
                                        Google Books
                                    </a>
                                </p>
                            )}
                        </div>
                    );
                })}
            </div>
        </div>
    );
};

export default Bookser;
