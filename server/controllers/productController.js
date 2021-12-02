const bcrypt = require( 'bcrypt' );
const {ProductModel} = require('../models/productsModel');

const ProductController = {
    addProduct : function( request, response ){
        if( request.session.email === undefined ){
            response.redirect( '/logout' );
        }
        else{
            const title = request.body.title;
            const description = request.body.description;
            const price = request.body.price;
            const owneremail = request.body.owneremail;

            let isValid = true
            
            if(title === '' || description === '' || price === null || owneremail === '') {
                request.flash('productBlank', "There is an empty space");
                isValid = false;
            }
            if(title.length < 3){
                request.flash('registerFname', "The title must be at least than 3 characters");
                isValid = false;
            }
            if(description.length < 3){
                request.flash('registerLname', "The description must be at least than 3 characters");
                isValid = false;
            }
            if(price === null){
                request.flash('registerEmail', "The email must be at least than 3 characters");
                isValid = false;
            }
            
            if(isValid){
                    const newProduct = {
                        title,
                        description,
                        price,
                        email,
                    };
                        console.log("This user wants to be added: " + newUser.title );
                        console.log("This user wants to be added: " + newUser.description );
                        console.log("This user wants to be added: " + newUser.price );
                        console.log("This user wants to be added: " + newUser.email );
                        ProductModel
                        .createProduct( newProduct )
                        .then( result => {
                            response.redirect( '/dashboard' );
                        })
                        .catch( err => {
                            console.log("There is an error on addproduct");
                            request.flash( 'error1', 'Error adding a product' );
                            response.redirect( '/dashboard' );
                        });
                
            }
            else{
                response.redirect( '/dashboard' );
            }
        }
    },

}

module.exports = { ProductController };