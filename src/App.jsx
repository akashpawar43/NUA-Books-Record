import React from 'react';
import BookTable from './components/BookTable';
import { Route, Routes, Link } from 'react-router-dom';
import SearchBooksByAuthor from './components/SearchBooksByAuthor';

function App() {
  return (
    <div className="App min-h-screen bg-gray-900">
      <header className="bg-gray-800 text-white p-4 text-center">
        <h1 className="text-2xl">Book Dashboard</h1>
        <nav className="mt-2">
          <Link to="/" className="mr-4">Home</Link>
          <Link to="/search">Search by Author</Link>
        </nav>
      </header>
      <main className="p-4 bg-gray-900 text-white">
        <Routes>
          <Route exact path="/" element={<BookTable />} />
          <Route path="/search" element={<SearchBooksByAuthor />} />
        </Routes>
      </main>
    </div>
  );
}

export default App;
