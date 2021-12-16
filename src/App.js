import React, { Component } from 'react';
import PostsData from './components/PostsData';
import PostForm from './components/PostForm';
import http from './services/httpService';
import config from './config/config.json';
import { ToastContainer, toast } from 'react-toastify';
// import * as Sentry from '@sentry/react';
import logger from './services/loggerService';

export class App extends Component {
  state = {
    posts: [],
    post: { description: '', author: '' },
    updateState: { updatePost: false, postId: '' },
  };

  componentDidMount = async () => {
    const { data } = await http.get(config.endpoint);
    this.setState({ posts: data });
  };

  handleChange = (event) => {
    const post = { ...this.state.post };
    post[event.target.name] = event.target.value;
    this.setState({ post });
  };

  handleSubmit = async (event) => {
    event.preventDefault();
    const bodyData = {
      title: this.state.post.description,
      author: this.state.post.author,
    };
    const { data: post } = await http.post(config.endpoint, bodyData);
    const intialPost = { description: '', author: '' };
    const posts = [...this.state.posts, post];
    this.setState({ posts, post: intialPost });
  };

  handleUpdate = async (event) => {
    event.preventDefault();
    const { post, updateState } = this.state;
    const bodyData = {
      title: post.description,
      author: post.author,
    };
    const { data } = await http.put(
      `${config.endpoint}/${updateState.postId}`,
      bodyData
    );
    const intiaUpdateState = { updatePost: false, postId: '' };
    const intialPost = { description: '', author: '' };
    const posts = [...this.state.posts];
    const index = posts.findIndex((post) => post.id === data.id);
    posts[index] = { ...data };
    this.setState({ posts, updateState: intiaUpdateState, post: intialPost });
  };

  handleEdit = (event, id) => {
    const post = this.state.posts.find((post) => post.id === id);
    const updatedPost = { description: post.title, author: post.author };
    const updateState = { updatePost: true, postId: id };
    this.setState({ post: updatedPost, updateState });
  };

  handleDelete = async (event, id) => {
    const orginalPosts = [...this.state.posts];
    const posts = this.state.posts.filter((post) => post.id !== id);
    this.setState({ posts });
    try {
      await http.delete(`s${config.endpoint}/${id}`);
      // await http.delete(`${config.endpoint}/99`);
      // await http.delete(`${endpoint}/${id}`);
    } catch (ex) {
      if (ex.response && ex.response.status === 404) {
        // console.log(ex, ex.request, ex.response);
        // Sentry.captureMessage('404 Error', ex);
        logger.captureMessage('404 Error', ex);
        toast.warn('Post Not Found', { theme: 'colored' });
      }
      this.setState({ posts: orginalPosts });
    }
  };

  render() {
    const { posts, post, updateState } = this.state;
    return (
      <div className='container'>
        <ToastContainer />
        <PostForm
          updateState={updateState}
          post={post}
          handleUpdate={this.handleUpdate}
          handleSubmit={this.handleSubmit}
          handleChange={this.handleChange}
        />
        <PostsData
          posts={posts}
          handleEdit={this.handleEdit}
          handleDelete={this.handleDelete}
        />
      </div>
    );
  }
}

export default App;
