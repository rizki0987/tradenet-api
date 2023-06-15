const login = require('./handler/login')
const register = require('./handler/register')
const logout = require('./handler/logout')
const interest = require('./handler/interest')
const getProfile = require('./handler/getProfile')
const createPost = require('./handler/createPost')
const deletePost = require('./handler/deletePost')
const getPost = require('./handler/getPost')
const getContent = require('./handler/getContent')
const routes = [
    {
        method: 'POST',
        path: "/api/auth/login",
        handler: login
    },
    {
        method: 'POST',
        path: "/api/auth/register",
        handler: register
    },
    {
        method: 'POST',
        path: "/api/auth/logout",
        handler: logout
    },
    {
        method: 'POST',
        path: '/api/interest',
        handler: interest

    },
    {
        method: 'GET',
        path: '/api/getProfile/{id}',
        handler: getProfile

    },
    {
        method: 'PUT',
        path: '/api/createPost',
        handler: createPost

    },
    {
        method: 'DELETE',
        path: '/api/deletePost/{contentId}',
        handler: deletePost

    },
    {
        method: 'GET',
        path: '/api/getPost/{userId}',
        handler: getPost

    },
    {
        method: 'GET',
        path: '/api/getContent/{id}',
        handler: getContent

    }
]

module.exports = routes
