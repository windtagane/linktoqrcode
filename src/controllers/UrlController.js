const UrlModel = require("../models/UrlModel");
const UrlController = {};

const paginate = require("express-paginate");
const QRCode = require("qrcode");

const sanitize = require("mongo-sanitize");

//Fonctions
/**
 * Raccourcie une chaîne de caractère avec la méthode .slice()
 * @param {string} url - URL de base.
 * @param {number} substring - Nombre de caractères à découper.
 * @returns {string} Chaîne de caractère raccourcie.
 */
function GetShortUrl(url, substring) {
	if (url) {
		//console.log(url)
		if (typeof substring === "null" || typeof substring === "undefined") {
			substring = 15;
		}
		let shortUrl = url.toString().substring(substring);
		return shortUrl;
	}
}

UrlController.list = (req, res) => {
	UrlModel.find()
		.then(urls => {
			res.render("index", {
				title: "Express",
				urls: urls
			});
		})
		.catch(error => res.json({ requestStatus: "KO", message: error }));
};
UrlController.create = (req, res) => {
	let AddUrl = new UrlModel({
		url: sanitize(req.body.url),
		protocol: sanitize(req.body.protocol)
	});
	AddUrl.shortUrl = GetShortUrl(AddUrl._id);
	AddUrl.save()
		.then(res.redirect("/"))
		.catch(error => res.json({ requestStatus: "KO", message: error }));
};

UrlController.update = (req, res) => {};
UrlController.delete = (req, res) => {};

UrlController.getUrlOfItem = (req, res) => {
	let itemID = sanitize(req.params.id);
	let id = itemID.split("-")[1];
	UrlModel.findById(id)
		.then(data => {
			res.redirect(data.protocol + "://" + data.url);
		})
		.catch(error => res.json({ requestStatus: "KO", message: error }));
};

UrlController.paginate = async(req, res, next) => {
	try {
		const [results, itemCount] = await Promise.all([
			UrlModel.find({})
				.limit(req.query.limit)
				.skip(req.skip)
				.lean()
				.exec(),
			UrlModel.estimatedDocumentCount({})
		]);

		const pageCount = Math.ceil(itemCount / req.query.limit);
		res.render("paginate", {
			pagination: results,
			pageCount,
			itemCount,
			pages: paginate.getArrayPages(req)(5, pageCount, req.query.page)
		});
	} catch (err) {
		next(err);
	}
};


UrlController.qrcode = (req, res) => {
	let url = "/getUrlOf/item-" + req.params.id;
	QRCode.toDataURL(url, function(err, url) {
		res.json({
			success: "OK",
			qrcode: url.toString()
		});
	});
};

module.exports = UrlController;
