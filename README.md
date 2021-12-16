### Optimistic Vs Pessimistic updates

```js
handleDelete = async (event, id) => {
  const orginalPosts = [...this.state.posts];
  const posts = this.state.posts.filter((post) => post.id !== id);
  this.setState({ posts });
  try {
    throw new Error('Custom Error');
    await axios.delete(`${endpoint}/${id}`);
  } catch (ex) {
    console.log('Post could not be deleted');
    this.setState({ posts: orginalPosts });
  }
};
```

### Expected Errors Vs Unexpected Errors

Expected Errors (Client Errors): Api end points predict and return

- 404: Not Found
- 400: Bad Request
- 401: Access Denied
- 403: Access Fobidden
  - Client Error need not be log them.
  - Display a specific error message to client.

Unexpected Errors

- Internet Down
- Server Down
- DB Down
- 500: Internal Server Error
  - Log the error for future reference.
  - Display a genreic message to client.

axios error object has two properties **request** and **response**

- **response**
  - The request was made and the server responded with a status code
  - that falls out of the range of 2xx
- **request**
  - The request was made but no response was received

```js
handleDelete = async (event, id) => {
  const orginalPosts = [...this.state.posts];
  const posts = this.state.posts.filter((post) => post.id !== id);
  this.setState({ posts });
  try {
    // await axios.delete(`s${endpoint}/${id}`);
    await axios.delete(`${endpoint}/99`);
    // await axios.delete(`${endpoint}/${id}`);
  } catch (ex) {
    if (ex.response && ex.response.status === 404) {
      console.log(ex, ex.request, ex.response);
      alert('Post Not Found');
    } else {
      console.log(ex, ex.request, ex.response);
      alert('Some unexpected error happened');
    }
    this.setState({ posts: orginalPosts });
  }
};
```

### Axios Interceptors

```js
// Add a request interceptor
axios.interceptors.request.use(
  function (config) {
    // Do something before request is sent
    return config;
  },
  function (error) {
    // Do something with request error
    return Promise.reject(error);
  }
);

// Add a response interceptor
axios.interceptors.response.use(
  function (response) {
    // Any status code that lie within the range of 2xx cause this function to trigger
    // Do something with response data
    return response;
  },
  function (error) {
    // Any status codes that falls outside the range of 2xx cause this function to trigger
    // Do something with response error
    return Promise.reject(error);
  }
);
```

use try catch block, when specific error message has to be sent

### Reusable Http Service

```js
import axios from 'axios';
import { toast } from 'react-toastify';
import * as Sentry from '@sentry/react';

axios.interceptors.response.use(null, (error) => {
  const expectedError =
    error.response &&
    error.response.status >= 400 &&
    error.response.status < 500;
  if (expectedError) return Promise.reject(error);
  //   console.log(error, error.response);
  Sentry.captureException(error);
  toast.error('Some unexpected error happened', { theme: 'colored' });
});

export default {
  get: axios.get,
  post: axios.post,
  put: axios.put,
  delete: axios.delete,
};
```

### Config Module

```js
// config.json
{
  "endpoint": "http://localhost:3004/posts"
}
// app.js
import config from './config/config.json';
const { data: post } = await http.post(config.endpoint, bodyData);
```

### Displaying Toast Notifications

```js
npm install --save react-toastify

import React from 'react';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

function App(){
    const notify = () => {
        toast.success("Lorem ipsum dolor", {
        theme: "colored"
        })
    }

    return (
        <div>
            <button onClick={notify}>Notify !</button>
            <ToastContainer />
        </div>
        );
    }
```

### Sentry Logger Service

```js
import * as Sentry from '@sentry/react';
import { Integrations } from '@sentry/tracing';

function init() {
  Sentry.init({
    dsn: 'https://1b36792bcac64c8ba11c58fafa8f4edb@o524407.ingest.sentry.io/6110039',
    integrations: [new Integrations.BrowserTracing()],

    // Set tracesSampleRate to 1.0 to capture 100%
    // of transactions for performance monitoring.
    // We recommend adjusting this value in production
    tracesSampleRate: 0,
  });
}

const captureException = Sentry.captureException;
const captureMessage = Sentry.captureMessage;

export default {
  init,
  captureException,
  captureMessage,
};

// index.js
import logger from './services/loggerService';

logger.init();

// app.js
logger.captureMessage('404 Error', ex);
```
