const express = require( 'express' );
const UserRouter = express.Router();
const {UserController} = require( '../controllers/ApiController' );

UserRouter
    .get( '/',  UserController.loadLogin );
/*
    .route( '/login' )
    .get( UserController.loadLogin )
    .post( UserController.userLogin );
*/
UserRouter
    .post( '/register', UserController.createUser );

UserRouter
    .post( '/login', UserController.userLogin );

UserRouter
    .get( '/dashboard',  UserController.loadLanding );

UserRouter
    .post( '/logout', UserController.userLogout );

// UserRouter
//     .get( '/getById', UserController.getUserById );

// UserRouter
//     .get( '/:identifier', UserController.getUserByIdParam );

module.exports = { UserRouter };