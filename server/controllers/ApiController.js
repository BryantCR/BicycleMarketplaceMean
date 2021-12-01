const bcrypt = require( 'bcrypt' );
const {UserModel} = require('./../models/ApiModel');

function validateEmail(email) {
    const re = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    return re.test(String(email).toLowerCase());
}

const UserController = {
    loadLogin : function( request, response ){
        response.render( 'logandreg' );
    },

    createUser : function( request, response ){
    
        const firstname = request.body.first_name;
        const lastname = request.body.last_name;
        const email = request.body.email;
        const birthday = new Date(request.body.birthday)
        const password = request.body.password;
        const confpassword = request.body.passwordReview;
    //--------------------------------------------------------Validations-----------------------
        let isValid = true

        if(firstname === '' || lastname === '' || email === '' || password === '' ){
            request.flash('registerBlank', "There is an empty space");
            isValid = false;
        }
        if(!validateEmail(email)){
            request.flash('registerEmail3', "Please write a valid email");
            isValid = false;
        }
        if(firstname.length < 3){
            request.flash('registerFname', "The firstname must be at least than 3 characters");
            isValid = false;
        }
        if(lastname.length < 3){
            request.flash('registerLname', "The lastname must be at least than 3 characters");
            isValid = false;
        }
        if(email.length < 3){
            request.flash('registerEmail', "The email must be at least than 3 characters");
            isValid = false;
        }
        if(password.length < 6){
            request.flash('registerPass', "The password must be at least than 6 characters");
            isValid = false;
        }
        if(birthday == "Invalid Date"){
            request.flash('registerDate', "You didn't fill your birthday");
            isValid = false;
        }
        if(password !== confpassword){
            request.flash('registerPass2', "The passwords didn't match");
            isValid = false;
        }
        
        //--------------------------------------------------------Validations end-----------------------
        if(isValid){
            //Encript password
            bcrypt.hash(password, 10)
            .then(encryptedPassword =>{
                const newUser = {
                    firstname,
                    lastname,
                    email,
                    birthday,
                    password : encryptedPassword
                };
                console.log("This user wants to be added: " + newUser.firstname );
                    console.log("This user wants to be added: " + newUser.lastname );
                    console.log("This user wants to be added: " + newUser.email );
                    console.log("This user wants to be added: " + newUser.password );
                    console.log("This user wants to be added: " + newUser.birthday );
                UserModel
                    .createUser( newUser )
                    .then( result => {
                        request.session.firstname = result.firstname;
                        request.session.lastname = result.lastname;
                        request.session.email = result.email;
                        request.session.birthday = result.birthday;
                        response.redirect( '/dashboard' );
                    })
                    .catch( err => {
                        console.log("There is an error on register");
                        request.flash( 'registerEmail2', 'That username is already in use!' );
                        response.redirect( '/' );
                    });
            })
        }
        else{
            response.redirect( '/' );
        }
    
    },

    loadLanding : function( request, response ){
        if( request.session.email === undefined ){
            response.redirect( '/' );
        }
        else{
            let userinfo = {
            firstname : request.session.firstname,
            lastname : request.session.lastname,
            email : request.session.email
        };
        response.render( 'dashboard', {user: userinfo} );
        }
        
    },

    userLogin : function( request, response ){
        let email = request.body.email;
        console.log( "Result: ", email );
        let password = request.body.user_password;
    
        let isValid = true
    
        if(email === '' || password === ''){
            request.flash('loginBlank', "There is an empty space");
            isValid = false;
        }
        if(email === '' ){
            request.flash('emailBlank', "There is an empty space");
            isValid = false;
        }
        if(password === '' || password.length < 6){
            request.flash('passwordBlank', "The password must be at least than 6 characters");
            isValid = false;
        }
        if(!validateEmail(email)){
            request.flash( 'emailBlank', 'The email field must have valid characters' );
            isValid = false;
        }
    
        if(isValid){
        UserModel
            .getUserByEmail( email )
            .then( result => {
                console.log( "Result", result );
                if( result === null ){
                    request.flash( 'login1', "That user doesn't exist!" );
                }
    
                bcrypt.compare( password, result.password )
                    .then( flag => {
                        if( !flag ){
                            request.flash( 'login2', "Wrong Password!" );
                            throw new Error( "Wrong Password!" );
                        }
                        request.session.firstname = result.firstname;
                        request.session.lastname = result.lastname;
                        request.session.email = result.email;
                        console.log(flag);
                        response.redirect( '/dashboard' );
                    })
                    .catch( error => {
                        response.redirect( '/' );
                    }); 
            })
            .catch( error => {
                response.redirect( '/' );
            });
        }
        else{
            response.redirect( '/' );
        }
    },

    userLogout : function( request, response ){
        request.session.destroy();
        response.redirect( '/' ); 
    }

    // getUserById : function( request, response ){
    //     let id = request.query.id;
    //     UserModel
    //         .getUserById( id )
    //         .then( result => {
    //             if( result === null ){
    //                 throw new Error( "That user doesn't exist" );
    //             }
    //             response.render( 'user', { found: true, user: result } );
    //         })
    //         .catch( error => {
    //             response.render( 'user', { found: false } );
    //         });
    // },

    // getUserByIdParam : function( request, response ){
    //     let id = request.params.identifier;
    
    //     UserModel
    //         .getUserById( id )
    //         .then( result => {
    //             if( result === null ){
    //                 throw new Error( "That user doesn't exist" );
    //             }
    //             response.render( 'user', { found: true, user: result } );
    //         })
    //         .catch( error => {
    //             response.render( 'user', { found: false } );
    //         });
    // }
}


module.exports = { UserController };