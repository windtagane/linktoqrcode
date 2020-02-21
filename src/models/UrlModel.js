const mongoose = require("mongoose");

const DATABASE = require("../../bin/database");

	// L'adresse de mon serveur
    //let dbUrl = DATABASE.LOCAL.URL + DATABASE.LOCAL.NAME;
    let dbUrl = "mongodb://localhost:27017/" + "onsaitpas";
	
	mongoose
		.connect(dbUrl, {useNewUrlParser: true, useUnifiedTopology: true, useCreateIndex: true})
		.then(() => console.log("Connected to database."))
        .catch(err => {if (err) throw err;});

let urlSchema = mongoose.Schema({
    url: {type: String, trim: true, index: {unique: true }},
    shortUrl: {type: String, trim: true},
    protocol: {type: String, trim: true},
    status: {type: Boolean, default: true},
});

let UrlModel = mongoose.model("url", urlSchema);
        
module.exports = UrlModel;