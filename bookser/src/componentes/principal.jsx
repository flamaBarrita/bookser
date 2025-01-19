import React, { useState } from 'react';
import axios from 'axios';
import './Bookser.css';

const Bookser = () => {
    const [input, setInput] = useState('');
    const [results, setResults] = useState([]);

    const handleSearch = async () => {
        if (input.trim() === '') return; // No buscar si el campo está vacío

        try {
            const response = await axios.get('https://www.googleapis.com/books/v1/volumes', {
                params: {
                    q: input,
                    maxResults: 10, // Número máximo de resultados
                },
            });
            setResults(response.data.items || []);
        } catch (error) {
            console.error('Error fetching books:', error);
        }
    };

    return (
        <div className="container">
            <h1 className="title">Bookser</h1>
            <input
                type="text"
                className="input"
                placeholder="Enter your search here"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleSearch()} // Busca al presionar Enter
            />
            <div className="results">
                {results.map((book) => (
                    <div key={book.id} className="result-item">
                        <h3>{book.volumeInfo.title}</h3>
                        <p>{book.volumeInfo.authors?.join(', ')}</p>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default Bookser;
