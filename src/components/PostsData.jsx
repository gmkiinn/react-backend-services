import React from 'react';

function PostsData({ posts, handleEdit, handleDelete }) {
  return (
    <div>
      <table className='table'>
        <thead>
          <tr>
            <th>Title</th>
            <th>Author</th>
            <th>Update</th>
            <th>Delete</th>
          </tr>
        </thead>
        <tbody>
          {posts.map((post) => (
            <tr key={post.id}>
              <td>{post.title}</td>
              <td>{post.author}</td>
              <td>
                <button
                  className='btn btn-sm btn-success'
                  onClick={(e) => handleEdit(e, post.id)}
                >
                  Edit
                </button>
              </td>
              <td>
                <button
                  onClick={(e) => handleDelete(e, post.id)}
                  className='btn btn-sm btn-danger'
                >
                  Delete
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default PostsData;
