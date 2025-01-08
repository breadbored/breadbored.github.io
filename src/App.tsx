/* eslint-disable jsx-a11y/no-distracting-elements */
import React, { useState, useEffect, ReactElement } from 'react';
import { HashRouter as Router, Routes, Route, Link } from 'react-router-dom';
import { Post as PostType } from './types';

const Layout = ({ children }: {
  children: ReactElement | ReactElement[] | string | string[] | number | number[] | boolean | boolean[] | null | undefined;
}) => (
  <div>
    <div className="page-width min-h-screen">
      <div className="py-20 text-center bg-white">
        <marquee className="mb-4">Software Development Is My Passion</marquee>
        <h1 className="text-4xl font-bold mb-2">bread.codes</h1>
        <h3 className="text-xl mb-4">code stuff</h3>

        <nav className="space-x-4 mb-8">
          <Link to="/" className="hover:text-blue-600">Home</Link>
          <Link to="/search" className="hover:text-blue-600">Search</Link>
          <Link to="/about" className="hover:text-blue-600">About</Link>
          <Link to="/archive" className="hover:text-blue-600">Archive</Link>
        </nav>

        <main className="px-4">
          {children}
        </main>
      </div>
    </div>

    <footer className="page-width text-center py-4 space-y-4">
      <div>
        <img src={process.env.PUBLIC_URL + "/assets/ie_logo.gif"} alt="IE Logo" className="inline mx-1" />
        <img src={process.env.PUBLIC_URL + "/assets/ns_logo.gif"} alt="Netscape Logo" className="inline mx-1" />
        <img src={process.env.PUBLIC_URL + "/assets/notepad.gif"} alt="Notepad" className="inline mx-1" />
      </div>
      <div>
        <img src={process.env.PUBLIC_URL + "/assets/pokemon3.gif"} alt="Pokemon" className="inline mx-1" />
        <a href="mailto:brad@bread.codes">
          <img src={process.env.PUBLIC_URL + "/assets/emailme.gif"} alt="Email Me" className="inline mx-1" />
        </a>
        <img src={process.env.PUBLIC_URL + "/assets/pokemon3.gif"} alt="Pokemon" className="inline mx-1" />
      </div>
    </footer>
  </div>
);

const PostPreview = ({ post }: {
  post: PostType;
}) => {
  const formattedDate = new Date(post.date).toLocaleDateString('en-US', {
    month: 'long',
    day: 'numeric',
    year: 'numeric'
  });

  return (
    <article className="border border-black m-2.5 p-4">
      <Link to={`/posts/${post.slug}`} className="block">
        <h1 className="text-2xl font-bold mb-2">{post.title}</h1>
        <div className="mb-4">
          <p className="text-gray-600">{formattedDate}</p>
        </div>
      </Link>

      <div className="prose max-w-none mb-4">
        {post.excerpt}
      </div>

      <Link to={`/posts/${post.slug}`} className="block">
        <img src={process.env.PUBLIC_URL + "/assets/more.gif"} alt="Read more" className="inline" />
      </Link>
    </article>
  );
};

const Home = () => {
  const [posts, setPosts] = useState<PostType[]>([]);

  useEffect(() => {
    // You'll need to host your posts data as a static JSON file
    fetch(process.env.PUBLIC_URL + '/data/posts.json')
      .then(res => res.json())
      .then(data => setPosts(data));
  }, []);

  return (
    <div className="posts">
      {posts.map(post => (
        <PostPreview key={post.slug} post={post} />
      ))}
    </div>
  );
};

const About = () => (
  <div className="max-w-2xl mx-auto">
    <h1 className="text-2xl font-bold mb-4">About</h1>
    <p className="mb-4">Contact:</p>
    <p>Email: <a href="mailto:brad@bread.codes" className="text-blue-600 hover:text-blue-800">brad@bread.codes</a></p>
    <p>LinkedIn: <a href="https://www.linkedin.com/in/breadbored/" className="text-blue-600 hover:text-blue-800">breadbored</a></p>
  </div>
);

const Search = () => (
  <div className="max-w-2xl mx-auto">
    <h1 className="text-2xl font-bold mb-4">Search</h1>
    <div id="search-container">
      <input
        type="text"
        id="search-input"
        placeholder="Search through the blog posts..."
        className="w-full p-2 border border-gray-300 rounded"
      />
      <ul id="results-container" className="mt-4"></ul>
    </div>
  </div>
);

const App = () => {
  return (
    <Router>
      <Layout>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/about" element={<About />} />
          <Route path="/search" element={<Search />} />
          <Route path="/archive" element={<div>Archive Page</div>} />
          <Route path="/posts/:slug" element={<div>Post Page</div>} />
        </Routes>
      </Layout>
    </Router>
  );
};

export default App;