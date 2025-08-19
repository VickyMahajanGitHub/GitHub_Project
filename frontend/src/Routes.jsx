import React, { useEffect } from 'react';
import { useNavigate, useRoutes } from 'react-router-dom';

// Pages List

import Dashboard from './components/dashboard/Dashboard.jsx';
import Profile from './components/user/Profile.jsx';
import Login from './components/auth/Login.jsx';
import Signup from './components/auth/Signup.jsx';

//Auth Context
import { AuthProvider, useAuth } from './authContext.jsx';


const ProjectRoutes = () => {
    const { currentUser, setCurrentUser } = useAuth();
    const navigate = useNavigate();

    useEffect(() => {
        const userIdFromStorage = localStorage.getItem('userId');
        if (userIdFromStorage && !currentUser) {
            // If user is not logged in but userId exists in storage, log them in
            setCurrentUser({ userIdFromStorage });
        }

        if (!userIdFromStorage && !["/auth", "/signup"].includes(window.location.pathname)) {
            // If user is not logged in and trying to access a protected route, redirect to login
            navigate('/auth');
        }

        if (userIdFromStorage && window.location.pathname == '/auth') {
            navigate('/');
        }
    }, [currentUser, setCurrentUser, navigate]);

    let element = useRoutes([
        {
            path: '/',
            element: <Dashboard />

        },
      
        {
            path: "/auth",
            element: <Login />
        },
        {
            path: "/signup",
            element: <Signup />
        },
        {
            path: "/profile",
            element: <Profile />
        }

    ]);
    return element;
}

export default ProjectRoutes;
