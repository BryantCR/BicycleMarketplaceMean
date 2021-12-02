const express = require('express');
const session = require( 'express-session' );
const flash = require( 'express-flash' );
const path = require( 'path' );

const { UserRouter } = require('./server/routes/apiRoutes');
//const { ProductRouter } = require('./server/routes/apiRoutes');

const ejs = require('ejs');

// DATABASES
require( './server/config/Database' );
require( './server/config/productDB' );
const app = express();

app.set( 'views', __dirname + '/views' );
app.set( 'view engine', 'ejs' );
//app.use(express.static(path.join(__dirname, "/client/static")));

app.use( flash() );
app.use( express.urlencoded({extended:true}) );
app.use( express.json() );
app.use(session({
    secret: 'secret',
    resave: false,
    saveUninitialized: true,
    cookie: { maxAge: 60000 * 30 } 
}));

app.use( '/', UserRouter );
//app.use( '/product', ProductRouter );

app.listen( 8080, function(){
    console.log( "The server is running in port 8080." );
});


/*
app.get( '/', function( request, response ){
    response.render( 'logandreg' );
});

app.get( '/dashboard', function( request, response ){
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
    
});

function validateEmail(email) {
    const re = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    return re.test(String(email).toLowerCase());
}


//?--------------(Register as User)-----------------------------------
app.post( '/register', function( request, response ){
    
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
    
});

//?--------------(Login)-------------------------------------------------------
app.post( '/login', function( request, response ){
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
});

//?--------------(LogOut)--------------------
app.post( '/logout', function( request, response ){
    request.session.destroy();
    response.redirect( '/' ); 
});

//*--------------ENDPOINTS-----------------------------------------------------------------------------------------------------------------------
*/
