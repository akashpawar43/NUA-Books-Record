import React, { useState, useEffect } from 'react';
import axios from 'axios';

const BookTable = () => {
    const [books, setBooks] = useState([]);
    const [currentPage, setCurrentPage] = useState(1);
    const [recordsPerPage, setRecordsPerPage] = useState(10);
    const [sortConfig, setSortConfig] = useState({ key: '', direction: '' });

    const fetchBooks = async () => {
        try {
            const response = await axios.get('https://openlibrary.org/subjects/romance.json?details=true');
            setBooks(response.data.works);
        } catch (error) {
            console.error("Error fetching the books", error);
        }
    };

    useEffect(() => {
        fetchBooks();
    }, []);

    const handleSort = (key) => {
        let direction = 'asc';
        if (sortConfig.key === key && sortConfig.direction === 'asc') {
            direction = 'desc';
        }
        setSortConfig({ key, direction });
        setBooks((prevBooks) =>
            [...prevBooks].sort((a, b) => {
                if (a[key] < b[key]) return direction === 'asc' ? -1 : 1;
                if (a[key] > b[key]) return direction === 'asc' ? 1 : -1;
                return 0;
            })
        );
    };

    const handlePageChange = (event) => {
        setCurrentPage(Number(event.target.value));
    };

    const handleRecordsPerPageChange = (event) => {
        setRecordsPerPage(Number(event.target.value));
    };

    const indexOfLastRecord = currentPage * recordsPerPage;
    const indexOfFirstRecord = indexOfLastRecord - recordsPerPage;
    const currentRecords = books.slice(indexOfFirstRecord, indexOfLastRecord);

    return (
        <div className="p-4 bg-gray-900 text-white">
            <div className="flex justify-between mb-4">
                <div>
                    <label htmlFor="recordsPerPage" className="mr-2">Records per page:</label>
                    <select id="recordsPerPage" className=' bg-gray-700 rounded-md' value={recordsPerPage} onChange={handleRecordsPerPageChange}>
                        <option value={10}>10</option>
                        <option value={50}>50</option>
                        <option value={100}>100</option>
                    </select>
                </div>
                <div>
                    <button onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}>Previous</button>
                    <input type="number" value={currentPage} onChange={handlePageChange} min="1" className="mx-2 w-14 text-center bg-gray-700 rounded-md" />
                    <button onClick={() => setCurrentPage((prev) => prev + 1)}>Next</button>
                </div>
            </div>
            <table className="min-w-full bg-gray-800 border">
                <thead className='bg-gray-700'>
                    <tr>
                        <th onClick={() => handleSort('ratings_average')} className="cursor-pointer">Ratings Average</th>
                        <th onClick={() => handleSort('author_name')} className="cursor-pointer">Author Name</th>
                        <th onClick={() => handleSort('title')} className="cursor-pointer">Title</th>
                        <th onClick={() => handleSort('first_publish_year')} className="cursor-pointer">First Publish Year</th>
                        <th onClick={() => handleSort('subject')} className="cursor-pointer">Subject</th>
                        <th onClick={() => handleSort('author_birth_date')} className="cursor-pointer">Author Birth Date</th>
                        <th onClick={() => handleSort('author_top_work')} className="cursor-pointer">Author Top Work</th>
                    </tr>
                </thead>
                <tbody>
                    {currentRecords.map((book, index) => (
                        <tr key={index} className="border-t border-gray-600">
                            <td>{book.ratings_average}</td>
                            <td>{book.authors[0]?.name}</td>
                            <td>{book.title}</td>
                            <td>{book.first_publish_year}</td>
                            <td>{book.subject}</td>
                            <td>{book.authors[0]?.birth_date}</td>
                            <td>{book.authors[0]?.top_work}</td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
};

export default BookTable;
