// src/components/SearchBooksByAuthor.js
import React, { useState } from 'react';
import axios from 'axios';
import { downloadCSV } from '../utils/downloadCSV';

const SearchBooksByAuthor = () => {
    const [author, setAuthor] = useState('');
    const [books, setBooks] = useState([]);
    const [loading, setLoading] = useState(false);

    const searchBooks = async () => {
        setLoading(true);
        try {
            const response = await axios.get(`https://openlibrary.org/search.json?author=${author}`);
            setBooks(response.data.docs);
        } catch (error) {
            console.error("Error fetching the books", error);
        }
        setLoading(false);
    };

    const handleSearch = (event) => {
        event.preventDefault();
        searchBooks();
    };

    return (
        <div className="min-h-screen bg-gray-900 text-white p-4">
            <header className="bg-gray-800 p-4 text-center">
                <h1 className="text-2xl">Search Books by Author</h1>
            </header>
            <main className="p-4">
                <form onSubmit={handleSearch} className="mb-4">
                    <input
                        type="text"
                        value={author}
                        onChange={(e) => setAuthor(e.target.value)}
                        placeholder="Enter author name"
                        className="p-2 rounded-md bg-gray-700 text-white"
                    />
                    <button type="submit" className="ml-2 p-2 rounded-md bg-blue-600 text-white">Search</button>
                </form>
                {loading && <p>Loading...</p>}
                <div className="mb-4">
                    <button onClick={() => downloadCSV(books, 'books.csv')} className="p-2 rounded-md bg-green-600 text-white">Download CSV</button>
                </div>
                <table className="min-w-full bg-gray-800">
                    <thead className="bg-gray-700">
                        <tr>
                            <th>Title</th>
                            <th>First Publish Year</th>
                            <th>Author Name</th>
                        </tr>
                    </thead>
                    <tbody>
                        {books.map((book, index) => (
                            <tr key={index} className="border-t border-gray-700">
                                <td>{book.title}</td>
                                <td>{book.first_publish_year}</td>
                                <td>{book.author_name?.join(', ')}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </main>
        </div>
    );
};

export default SearchBooksByAuthor;
