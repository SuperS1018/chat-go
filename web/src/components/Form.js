import React, { useState } from 'react';
import '../stylesheets/Form.css';

const Form = ({
  showFormFn,
  setError,
  handleSubmit,
  error
}) => {
  const [username, setUsername] = useState('');

  const handleChange = (e) => {
    setUsername(e.target.value);
  }

  const handleUsernameSubmit = (e) => {
    e.preventDefault();
    setError('');
    handleSubmit(username)
  };

    return (
      <div className="mask">
        <div className="form-wrap col-sm-6 col-sm-offset-3">
          <div className="clearfix">&nbsp;</div>
          <form onSubmit={ handleUsernameSubmit }>
            <div className="col-sm-10 col-sm-offset-1">
              <div className={ `form-group one-line ${ (error)?'has-error':null }` }>
                <label className="text f18 text-normal text-gray">Please create a new username</label>
                <input type="text" className="form-control" onChange={handleChange} />
                <div className="clearfix">&nbsp;</div>
                { error && <span className='form-text text-danger'>{ error }</span> }
              </div>
            </div>
            <div className="btn-wrap right">
              <button className="btn btn-app">Submit</button>
            </div>
          </form>
        </div>
      </div>
    );
}


export default Form;