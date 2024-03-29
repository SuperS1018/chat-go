const uri = '/chat-go/chat/'

export const fetchUserlist = () => {
  return fetch(uri + 'getUserList.json')
    .then(handleResponse)
    .then(data => data);
};

export const createUsername = (username) => {
  return fetch(uri + 'createUser.json', {
    method: 'POST',
    body: JSON.stringify({ username }),
    headers: {
      "Content-Type": "application/json"
    }
  }).then(handleResponse)
      .then(data => data);
};

export const delUsername = (username) => {
  return fetch(uri + 'deleteUser.json', {
    method: 'POST',
    body: JSON.stringify({ username }),
    headers: {
      "Content-Type": "application/json"
    }
  }).then(handleResponse)
      .then(data => data)
};

export const submitMessage = (data) => {
  const { username, message } = data;
    return fetch(uri + 'addMessage.json', {
      method: 'POST',
      body: JSON.stringify({ username, message }),
      headers: {
        "Content-Type": "application/json"
      }
    }).then(handleResponse)
        .then(data => data)
};

export const fetchMessages = () => {
  return fetch(uri + 'getMessages.json')
      .then(handleResponse)
      .then(data => data)
};

const handleResponse = (res) => {
  if(res.ok) {
    return res.json();
  } else {
	  console.error(res)
    try{
      let error = new Error(res.statusText);
      error['response'] = res;
      throw error;
    }
    catch(err) {};
  }
};
