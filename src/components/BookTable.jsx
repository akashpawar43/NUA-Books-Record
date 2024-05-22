import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { downloadCSV } from '../utils/downloadCSV';

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
            <div className="flex flex-col md:flex-row justify-between mb-4">
                <div className="flex items-center mb-2 md:mb-0">
                    <label htmlFor="recordsPerPage" className="mr-2">Records per page:</label>
                    <select id="recordsPerPage" className="bg-gray-700 rounded-md" value={recordsPerPage} onChange={handleRecordsPerPageChange}>
                        <option value={10}>10</option>
                        <option value={50}>50</option>
                        <option value={100}>100</option>
                    </select>
                </div>
                <div className="flex items-center">
                    <button className="p-2 bg-blue-600 rounded-md" onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}>Previous</button>
                    <input type="number" value={currentPage} onChange={handlePageChange} min="1" className="mx-2 w-14 text-center bg-gray-700 rounded-md" />
                    <button className="p-2 bg-blue-600 rounded-md" onClick={() => setCurrentPage((prev) => prev + 1)}>Next</button>
                </div>
            </div>
            <div className="mb-4">
                <button onClick={() => downloadCSV(currentRecords, 'books.csv')} className="p-2 rounded-md bg-green-600 text-white">Download CSV</button>
            </div>
            <div className="overflow-x-auto">
                <table className="min-w-full bg-gray-800 border">
                    <thead className="bg-gray-700">
                        <tr>
                            <th onClick={() => handleSort('ratings_average')} className="cursor-pointer p-2">Ratings Average</th>
                            <th onClick={() => handleSort('author_name')} className="cursor-pointer p-2">Author Name</th>
                            <th onClick={() => handleSort('title')} className="cursor-pointer p-2">Title</th>
                            <th onClick={() => handleSort('first_publish_year')} className="cursor-pointer p-2">First Publish Year</th>
                            <th onClick={() => handleSort('subject')} className="cursor-pointer p-2">Subject</th>
                            <th onClick={() => handleSort('author_birth_date')} className="cursor-pointer p-2">Author Birth Date</th>
                            <th onClick={() => handleSort('author_top_work')} className="cursor-pointer p-2">Author Top Work</th>
                        </tr>
                    </thead>
                    <tbody>
                        {currentRecords.map((book, index) => (
                            <tr key={index} className="border-t border-gray-600">
                                <td className="p-2">{book.ratings_average}</td>
                                <td className="p-2">{book.authors[0]?.name}</td>
                                <td className="p-2">{book.title}</td>
                                <td className="p-2">{book.first_publish_year}</td>
                                <td className="p-2">{book.subject}</td>
                                <td className="p-2">{book.authors[0]?.birth_date}</td>
                                <td className="p-2">{book.authors[0]?.top_work}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default BookTable;
