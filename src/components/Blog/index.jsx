import React, { useEffect, useState } from 'react';
import { getBlogPosts } from '../../utils/posts';

const Blog = () => {
  const [posts, setPosts] = useState([]);

  // load posts on mount and fills the `posts` array
  useEffect(() => {
    (async () => {
      const blogPosts = await getBlogPosts();

      setPosts(blogPosts);
    })();
  }, []);

  if (posts && posts.length) {
    return (
      <p dangerouslySetInnerHTML={{
        __html: posts[0].content
      }}></p>
    );
  }

  return null;
}

export default Blog;
