import React, { useState, useEffect } from 'react';
import '../stylesheets/Sidebar.css';
import { fetchUserlist, createUsername, delUsername } from "../actions";
import Form from "./Form";

const Sidebar = ({ show }) => {
    const username = window.localStorage.getItem('username');
    const [userList, setUserList] = useState([]);
    const [showForm, setShowForm] = useState(false);
    const [error, setError] = useState('');

    const getUserList = () => {
      fetchUserlist()
          .then(data => {
              setUserList(data.body ?? [])
          })
    }

    useEffect(() => {
        getUserList();
        // let interval = setInterval(getUserList, 5000);
        // return () => {
        //     clearInterval(interval);
        // }
    }, [])

    useEffect(() => {
        setShowForm(!username)
    }, [username])

    const handleDelete = (username) => {
        delUsername(username)
            .then(data => {
              if(data.statusCode === 200) {
                window.localStorage.removeItem('username');
                getUserList();
              }
            });
    };

    const handleSubmit = (username) => {
        const re = /[!@#$%^&*(),.?":{}|<>]/g;
        if (username) {
            if(re.test(username)) {
                setError('English letters and numbers only');
            } else {
                createUsername(username)
                    .then(res => {
                        if (res.statusCode === 200) {
                            window.localStorage.setItem('username', username);
                            getUserList();
                            setShowForm(false);
                        }
                        if (res.statusCode === 400) {
                            setError('Username has been taken');
                        }
                    })
                    .catch(err => {
                        if(err) {
                            this.setError(err.message)
                        }

                    });
            }
        } else {
            setError('This field can not be empty');
        }
    };

    return (
        <>
            { showForm && <Form
                showFormFn={ () => setShowForm(false) }
                handleSubmit={handleSubmit}
                error={error}
                setError={setError}
            /> }

            <div className={ `sidebar-wrap ${ (show)? 'show-xs':'hidden-xs' } `}>
                <aside className="col-sm-4 col-md-2 sidebar padding-top-0">
                    <ul className="nav nav-sidebar">
                        { userList.length ? userList.map((i, index) => {
                            return (
                                <li className={ `nav-item col-xs-6 col-sm-12 ${(i === username || i.active)?'active':''}` } key={ index }>
                                    <span className="text box-text">{ i[0] }</span>&nbsp;<span className="text f18 text-normal text-white">{ i }</span>
                                    { (i === username || i.active) && <span className="glyphicon glyphicon-remove-circle pull-right text f18 text-app del-btn" onClick={ () => handleDelete(i) } /> }
                                </li>
                            )
                        }):<li className="nav-item col-xs-6 col-sm-12 text text-white">No user on the list</li> }
                    </ul>
                    <div className="col-sm-4 col-md-2 person hidden-xs">
                        <span className="text f14 text-white text-semi">{ userList.length } Person(s)</span>
                    </div>
                </aside>
            </div>
        </>
    );
}

export default Sidebar;