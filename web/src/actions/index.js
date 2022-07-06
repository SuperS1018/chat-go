const uri = 'https://faas-nyc1-2ef2e6cc.doserverless.co/api/v1/web/fn-744054ea-e270-40d0-8e34-8b58c972a262/chat/'

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

// export const delMessage = (timestamp) => {
//   return {
//     type: DEL_MESSAGE,
//     timestamp
//   }
// };
//
// export const removeMessage = (data) => {
//   return dispatch => {
//     return fetch(uri + 'delMessage.json', {
//       method: 'POST',
//       body: JSON.stringify({ item: data }),
//       headers: {
//         "Content-Type": "application/json"
//       }
//     }).then(handleResponse)
//         .then(res => {
//           if(res.returnCode === 0) {
//             dispatch(delMessage(res.timestamp))
//           }
//         });
//   }
// };

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
