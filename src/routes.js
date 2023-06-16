const login = require('./handler/login')
const register = require('./handler/register')
const logout = require('./handler/logout')
const interest = require('./handler/interest')
const getProfile = require('./handler/getProfile')
const createPost = require('./handler/createPost')
const deletePost = require('./handler/deletePost')
const getPost = require('./handler/getPost')
const getContent = require('./handler/getContent')
const getInterest = require('./handler/getInterest')
const getMarket= require('./handler/getMarket')
const getInterestsById = require('./handler/getInterestById')
const createComments = require('./handler/createComments')

const routes = [
    {
        method: 'POST',
        path: "/api/auth/login",
        handler: login
    },
    {
        method: 'POST',
        path: "/api/auth/registration",
        handler: register
    },
    {
        method: 'POST',
        path: "/api/auth/logout",
        handler: logout
    },
    {
        method: 'POST',
        path: '/api/profile/interest',
        handler: interest

    },
    {
        method: 'GET',
        path: '/api/profile',
        handler: getProfile

    },
    {
        method: 'POST',
        path: '/api/post',
        handler: createPost

    },
    {
        method: 'DELETE',
        path: '/deletePost/{contentId}',
        handler: deletePost

    },
    {
        method: 'GET',
        path: '/api/post-list',
        handler: getPost

    },
    {
        method: 'GET',
        path: '/api/content',
        handler: getContent

    },
    {
        method: 'GET',
        path: '/api/lookup/interest',
        handler: getInterest

    },
    {
        method: 'GET',
        path: '/api/market-post-list',
        handler: getMarket

    },
    {
        method: 'GET',
        path: '/api/lookup/interest/{id}',
        handler: getInterestsById

    },
    {
        method: 'POST',
        path: '/api/post/comment',
        handler: createComments

    },
    
]

module.exports = routes