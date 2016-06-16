/**
 * Created by chuan.jin on 2016/6/13.
 */
var nodemailer = require('nodemailer');
var EmailTemplate = require('email-templates').EmailTemplate;
var globalVar = require('./globalVariable');

var templatePath = __dirname + '/emailTemplate';

exports.sendOne = function (locals, fn) {
    var defaultTransport = nodemailer.createTransport(globalVar.emailConfig);
    var template  = new EmailTemplate(templatePath);
    template.render(locals,function(err, result){
        defaultTransport.sendMail({
            from: locals.fromEmail,
            to: locals.toEmail,
            subject: locals.subject,
            html: result.html,
            // generateTextFromHTML: true,
            text: result.text
        }, function (err, responseStatus) {
            if (err) {
                return fn(err);
            }
            return fn(null, responseStatus.message, result.html, result.text);
        });
    });


    /*  emailTemplates(templatePath, function (err, template) {
     if (err) {
     //console.log(err);
     return fn(err);
     }
     // Send a single email
     template(templateName+'.ejs', locals, function (err, html, text) {
     if (err) {
     //console.log(err);
     return fn(err);
     }

     var transport = defaultTransport;
     transport.sendMail({
     from: locals.fromEmail,
     to: locals.toEmail,
     subject: locals.subject,
     html: html,
     // generateTextFromHTML: true,
     text: text
     }, function (err, responseStatus) {
     if (err) {
     return fn(err);
     }
     return fn(null, responseStatus.message, html, text);
     });
     });
     });*/
};