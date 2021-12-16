import React from 'react';

function PostForm({
  updateState,
  post,
  handleUpdate,
  handleSubmit,
  handleChange,
}) {
  return (
    <div>
      <h1 style={{ textAlign: 'center' }}>Add Post</h1>
      <form onSubmit={updateState.updatePost ? handleUpdate : handleSubmit}>
        <div className='mb-3'>
          <label htmlFor='description' className='form-label'>
            Description
          </label>
          <input
            type='text'
            className='form-control'
            id='description'
            name='description'
            value={post.description}
            onChange={handleChange}
          />
        </div>
        <div className='mb-3'>
          <label htmlFor='author' className='form-label'>
            Author
          </label>
          <input
            type='text'
            className='form-control'
            id='author'
            name='author'
            value={post.author}
            onChange={handleChange}
          />
        </div>
        {updateState.updatePost ? (
          <button type='submit' className='btn btn-success'>
            Update
          </button>
        ) : (
          <button type='submit' className='btn btn-primary'>
            Submit
          </button>
        )}
      </form>
    </div>
  );
}

export default PostForm;
