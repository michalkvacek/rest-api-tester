var nodemailer = require ('nodemailer');
var smtpTransport = require ('nodemailer-smtp-transport');

module.exports.email = {
	service: 'nodemailer-smtp-transport',
	templateDir: 'views/emails'
};