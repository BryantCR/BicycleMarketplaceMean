const mongoose = require('mongoose');
const AutoIncrement = require('mongoose-sequence')(mongoose); // Auto-Increment

//*----------------CONSTRUCTOR-------------------------------------------------------------------------------------
const ProductSchema = new mongoose.Schema({

    title: {
        type: String,
        required: [true, "Title is required"],
        minlength : 3,
        maxlength : 255
    },
    description: {
        type: String,
        required: [true, "Description is required"]
    },
    price: {
        type: Number,
        required: [true, "Price is required"],
        min: [0, "Price must be equal to or greater than $0"]
    },
    created_at : {
        type : Date,
    },
    updated_at : {
        type : Date,
    },
    owneremail : {
        type : String,
        required : true,
        unique : true
    }

});
//*----------------CONSTRUCTOR END----------------------------------------------------------------------------------
ProductSchema.plugin(AutoIncrement, {inc_field: 'product_id'});

const Product = mongoose.model( 'products', ProductSchema );

const ProductModel = {
    createProduct : function (newProduct) {
        return Product.create(newProduct); //User is in the connection up ☝️
    },
    getProductByEmail : function( email ){
        return Product.findOne({ email });
    }
    //TODO INSERT MORE QUERYS
}
module.exports = {ProductSchema, ProductModel};