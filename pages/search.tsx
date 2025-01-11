import React from 'react';

const Search = () => {
    return (
        <div style={{ padding: '20px' }}>
            <section className='mb-4'>
                <h2>Search</h2>
            </section>
            <section>
                <input type="text" placeholder="Search..." style={{
                    border: '1px solid #ccc',
                }} />
            </section>
        </div>
    );
};

export default Search;