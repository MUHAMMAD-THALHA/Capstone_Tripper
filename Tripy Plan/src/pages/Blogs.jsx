import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { FaCalendarAlt, FaUser, FaTag, FaSearch, FaFilter, FaEdit } from 'react-icons/fa';
import { Helmet } from 'react-helmet-async';
import { toast } from 'react-hot-toast';

const Blogs = () => {
  const [posts, setPosts] = useState([]);
  const [newPost, setNewPost] = useState({
    title: '',
    content: '',
    image: null,
    author: localStorage.getItem('userName') || 'Anonymous',
    category: 'general'
  });
  const [editingPost, setEditingPost] = useState(null);
  const [showNewPostForm, setShowNewPostForm] = useState(false);
  const [selectedImage, setSelectedImage] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [sortBy, setSortBy] = useState('newest');

  const categories = [
    'all',
    'adventure',
    'culture',
    'food',
    'tips',
    'general'
  ];

  useEffect(() => {
    // Load posts from localStorage
    const savedPosts = JSON.parse(localStorage.getItem('blogPosts') || '[]');
    setPosts(savedPosts);
  }, []);

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setSelectedImage(reader.result);
        if (editingPost) {
          setEditingPost(prev => ({ ...prev, image: reader.result }));
        } else {
          setNewPost(prev => ({ ...prev, image: reader.result }));
        }
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    if (!newPost.title || !newPost.content) {
      toast.error('Please fill in all required fields');
      return;
    }

    const post = {
      ...newPost,
      id: Date.now(),
      date: new Date().toISOString(),
      comments: [],
      likes: 0
    };

    const updatedPosts = [post, ...posts];
    setPosts(updatedPosts);
    localStorage.setItem('blogPosts', JSON.stringify(updatedPosts));
    
    // Reset form
    setNewPost({
      title: '',
      content: '',
      image: null,
      author: localStorage.getItem('userName') || 'Anonymous',
      category: 'general'
    });
    setSelectedImage(null);
    setShowNewPostForm(false);
    toast.success('Blog post created successfully!');
  };

  const handleDeletePost = (postId) => {
    const updatedPosts = posts.filter(post => post.id !== postId);
    setPosts(updatedPosts);
    localStorage.setItem('blogPosts', JSON.stringify(updatedPosts));
    toast.success('Post deleted successfully!');
  };

  const handleAddComment = (postId, comment) => {
    const updatedPosts = posts.map(post => {
      if (post.id === postId) {
        return {
          ...post,
          comments: [...post.comments, {
            id: Date.now(),
            text: comment,
            author: localStorage.getItem('userName') || 'Anonymous',
            date: new Date().toISOString()
          }]
        };
      }
      return post;
    });
    setPosts(updatedPosts);
    localStorage.setItem('blogPosts', JSON.stringify(updatedPosts));
  };

  const handleDeleteComment = (postId, commentId) => {
    const updatedPosts = posts.map(post => {
      if (post.id === postId) {
        return {
          ...post,
          comments: post.comments.filter(comment => comment.id !== commentId)
        };
      }
      return post;
    });
    setPosts(updatedPosts);
    localStorage.setItem('blogPosts', JSON.stringify(updatedPosts));
  };

  const handleLike = (postId) => {
    const updatedPosts = posts.map(post => {
      if (post.id === postId) {
        return {
          ...post,
          likes: (post.likes || 0) + 1
        };
      }
      return post;
    });
    setPosts(updatedPosts);
    localStorage.setItem('blogPosts', JSON.stringify(updatedPosts));
  };

  const handleEditPost = (post) => {
    setEditingPost({
      ...post,
      image: post.image || null
    });
    setSelectedImage(post.image || null);
    setShowNewPostForm(false);
  };

  const handleUpdatePost = (e) => {
    e.preventDefault();
    
    if (!editingPost.title || !editingPost.content) {
      toast.error('Please fill in all required fields');
      return;
    }

    const updatedPosts = posts.map(post => {
      if (post.id === editingPost.id) {
        return {
          ...editingPost,
          date: new Date().toISOString()
        };
      }
      return post;
    });

    setPosts(updatedPosts);
    localStorage.setItem('blogPosts', JSON.stringify(updatedPosts));
    
    // Reset form
    setEditingPost(null);
    setSelectedImage(null);
    toast.success('Blog post updated successfully!');
  };

  const handleCancelEdit = () => {
    setEditingPost(null);
    setSelectedImage(null);
  };

  // Filter and sort posts
  const filteredAndSortedPosts = posts
    .filter(post => {
      const matchesSearch = post.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          post.content.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesCategory = selectedCategory === 'all' || post.category === selectedCategory;
      return matchesSearch && matchesCategory;
    })
    .sort((a, b) => {
      if (sortBy === 'newest') {
        return new Date(b.date) - new Date(a.date);
      } else if (sortBy === 'oldest') {
        return new Date(a.date) - new Date(b.date);
      } else if (sortBy === 'mostLiked') {
        return (b.likes || 0) - (a.likes || 0);
      }
      return 0;
    });

  return (
    <div className="min-h-screen bg-peach py-8 px-4">
      <Helmet>
        <title>Blog - Tripy</title>
      </Helmet>
      <div className="max-w-4xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold text-darkpink">Travel Blog</h1>
          <button
            onClick={() => setShowNewPostForm(!showNewPostForm)}
            className="bg-pink text-white px-6 py-2 rounded-lg hover:bg-darkpink transition-colors"
          >
            {showNewPostForm ? 'Cancel' : 'New Post'}
          </button>
        </div>

        {/* Search and Filter Bar */}
        <div className="bg-white rounded-xl shadow-lg p-4 mb-8">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1">
              <div className="relative">
                <input
                  type="text"
                  placeholder="Search posts..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 rounded-lg border border-gray-300 focus:outline-none focus:border-pink"
                />
                <FaSearch className="absolute left-3 top-3 text-gray-400" />
              </div>
            </div>
            <div className="flex gap-4">
              <select
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                className="px-4 py-2 rounded-lg border border-gray-300 focus:outline-none focus:border-pink"
              >
                {categories.map(category => (
                  <option key={category} value={category}>
                    {category.charAt(0).toUpperCase() + category.slice(1)}
                  </option>
                ))}
              </select>
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="px-4 py-2 rounded-lg border border-gray-300 focus:outline-none focus:border-pink"
              >
                <option value="newest">Newest First</option>
                <option value="oldest">Oldest First</option>
                <option value="mostLiked">Most Liked</option>
              </select>
            </div>
          </div>
        </div>

        {/* New Post Form */}
        {showNewPostForm && (
          <div className="bg-white rounded-xl shadow-lg p-6 mb-8">
            <h2 className="text-xl font-bold mb-4">Create New Post</h2>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-gray-700 mb-2">Title</label>
                <input
                  type="text"
                  value={newPost.title}
                  onChange={(e) => setNewPost(prev => ({ ...prev, title: e.target.value }))}
                  className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:outline-none focus:border-pink"
                  required
                />
              </div>
              <div>
                <label className="block text-gray-700 mb-2">Category</label>
                <select
                  value={newPost.category}
                  onChange={(e) => setNewPost(prev => ({ ...prev, category: e.target.value }))}
                  className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:outline-none focus:border-pink"
                >
                  {categories.filter(cat => cat !== 'all').map(category => (
                    <option key={category} value={category}>
                      {category.charAt(0).toUpperCase() + category.slice(1)}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-gray-700 mb-2">Content</label>
                <textarea
                  value={newPost.content}
                  onChange={(e) => setNewPost(prev => ({ ...prev, content: e.target.value }))}
                  rows="6"
                  className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:outline-none focus:border-pink"
                  required
                ></textarea>
              </div>
              <div>
                <label className="block text-gray-700 mb-2">Image</label>
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleImageChange}
                  className="w-full"
                />
                {selectedImage && (
                  <img
                    src={selectedImage}
                    alt="Preview"
                    className="mt-2 max-h-48 rounded-lg"
                  />
                )}
              </div>
              <button
                type="submit"
                className="w-full bg-pink text-white py-2 rounded-lg hover:bg-darkpink transition-colors"
              >
                Publish Post
              </button>
            </form>
          </div>
        )}

        {/* Edit Post Form */}
        {editingPost && (
          <div className="bg-white rounded-xl shadow-lg p-6 mb-8">
            <h2 className="text-xl font-bold mb-4">Edit Post</h2>
            <form onSubmit={handleUpdatePost} className="space-y-4">
              <div>
                <label className="block text-gray-700 mb-2">Title</label>
                <input
                  type="text"
                  value={editingPost.title}
                  onChange={(e) => setEditingPost(prev => ({ ...prev, title: e.target.value }))}
                  className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:outline-none focus:border-pink"
                  required
                />
              </div>
              <div>
                <label className="block text-gray-700 mb-2">Category</label>
                <select
                  value={editingPost.category}
                  onChange={(e) => setEditingPost(prev => ({ ...prev, category: e.target.value }))}
                  className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:outline-none focus:border-pink"
                >
                  {categories.filter(cat => cat !== 'all').map(category => (
                    <option key={category} value={category}>
                      {category.charAt(0).toUpperCase() + category.slice(1)}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-gray-700 mb-2">Content</label>
                <textarea
                  value={editingPost.content}
                  onChange={(e) => setEditingPost(prev => ({ ...prev, content: e.target.value }))}
                  rows="6"
                  className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:outline-none focus:border-pink"
                  required
                ></textarea>
              </div>
              <div>
                <label className="block text-gray-700 mb-2">Image</label>
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleImageChange}
                  className="w-full"
                />
                {selectedImage && (
                  <img
                    src={selectedImage}
                    alt="Preview"
                    className="mt-2 max-h-48 rounded-lg"
                  />
                )}
              </div>
              <div className="flex gap-4">
                <button
                  type="submit"
                  className="flex-1 bg-pink text-white py-2 rounded-lg hover:bg-darkpink transition-colors"
                >
                  Update Post
                </button>
                <button
                  type="button"
                  onClick={handleCancelEdit}
                  className="flex-1 bg-gray-500 text-white py-2 rounded-lg hover:bg-gray-600 transition-colors"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        )}

        {/* Blog Posts */}
        <div className="space-y-8">
          {filteredAndSortedPosts.map((post) => (
            <div key={post.id} className="bg-white rounded-xl shadow-lg overflow-hidden">
              {post.image && (
                <img
                  src={post.image}
                  alt={post.title}
                  className="w-full h-64 object-cover"
                />
              )}
              <div className="p-6">
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <h2 className="text-2xl font-bold">{post.title}</h2>
                    <span className="inline-block bg-pink text-white px-3 py-1 rounded-full text-sm mt-2">
                      {post.category}
                    </span>
                  </div>
                  <div className="flex gap-2">
                    <button
                      onClick={() => handleEditPost(post)}
                      className="text-blue-500 hover:text-blue-700"
                    >
                      <FaEdit className="w-5 h-5" />
                    </button>
                    <button
                      onClick={() => handleDeletePost(post.id)}
                      className="text-red-500 hover:text-red-700"
                    >
                      Delete
                    </button>
                  </div>
                </div>
                <p className="text-gray-600 mb-4">{post.content}</p>
                <div className="flex justify-between items-center text-sm text-gray-500 mb-4">
                  <div>
                    Posted by {post.author} on {new Date(post.date).toLocaleDateString()}
                  </div>
                  <button
                    onClick={() => handleLike(post.id)}
                    className="flex items-center gap-1 text-pink hover:text-darkpink"
                  >
                    <span>❤️</span>
                    <span>{post.likes || 0} likes</span>
                  </button>
                </div>

                {/* Comments Section */}
                <div className="mt-6">
                  <h3 className="text-lg font-bold mb-4">Comments ({post.comments.length})</h3>
                  <div className="space-y-4">
                    {post.comments.map((comment) => (
                      <div key={comment.id} className="bg-gray-50 p-4 rounded-lg">
                        <div className="flex justify-between items-start">
                          <div>
                            <p className="font-bold">{comment.author}</p>
                            <p className="text-gray-600">{comment.text}</p>
                            <p className="text-sm text-gray-500">
                              {new Date(comment.date).toLocaleDateString()}
                            </p>
                          </div>
                          <button
                            onClick={() => handleDeleteComment(post.id, comment.id)}
                            className="text-red-500 hover:text-red-700"
                          >
                            Delete
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>

                  {/* Add Comment Form */}
                  <form
                    onSubmit={(e) => {
                      e.preventDefault();
                      const comment = e.target.comment.value;
                      if (comment.trim()) {
                        handleAddComment(post.id, comment);
                        e.target.comment.value = '';
                      }
                    }}
                    className="mt-4"
                  >
                    <textarea
                      name="comment"
                      placeholder="Write a comment..."
                      className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:outline-none focus:border-pink"
                      rows="2"
                    ></textarea>
                    <button
                      type="submit"
                      className="mt-2 bg-pink text-white px-4 py-2 rounded-lg hover:bg-darkpink transition-colors"
                    >
                      Post Comment
                    </button>
                  </form>
                </div>
              </div>
            </div>
          ))}

          {filteredAndSortedPosts.length === 0 && (
            <div className="text-center py-12">
              <p className="text-gray-600 mb-4">No blog posts found.</p>
              <button
                onClick={() => setShowNewPostForm(true)}
                className="bg-pink text-white px-6 py-2 rounded-lg hover:bg-darkpink transition-colors"
              >
                Create First Post
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Blogs; 