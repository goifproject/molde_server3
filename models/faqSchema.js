const logger = require('../service/logger');
let mongoose = require("mongoose");
var Counter = require('./counterSchema');
let Schema = mongoose.Schema;

let faqSchema = new Schema({
    faq_id: {type: Number},
    user_id: {type: String},
    user_name: {type: String},
    faq_contents: {type: String},
    faq_email: {type: String}
});

function getNextId(name,cb){
    Counter.findOneAndUpdate(
        {_id: name },
        {$inc: {seq: 1}},
        {projection: {"_id": 0, "seq": 1 }},
        function(err, result){
            if(err) {
                logger.info('get faq collection count and update schema error - '+err);
            } else {
                cb(result.seq);
            }
        }
     );
}

faqSchema.statics.insertFaqData = function (user_id, user_name, faq_contents, faq_email, callback) {
    getNextId('FAQS',function(_seq){
        FaQ.collection.insert({
            faq_id: _seq,
            user_id: user_id,
            user_name: user_name,
            faq_contents: faq_contents,
            faq_email: faq_email
        }, function (err, result) {
            if (err) {
                logger.info('inser faq schema error - '+err);
                callback(new Error(err));
            } else {
               callback(null, result);
            }
        });
    });
};

faqSchema.statics.getFaqs = function(per_page, page, callback){
    FaQ.collection.find({
    }, {projection: {"_id": 0, "faq_id": 1, "user_id": 1,
        "user_name": 1, "faq_contents": 1, "faq_email": 1 }},
    function (err, faqs) {
        if (err) {
            logger.info('get faqs schema error - '+err);
            callback(err);
        } else {
            if(per_page != -1 && page != -1)
                faqs.sort({'faq_id':1}).skip(page*per_page).limit(per_page).toArray(function(err,docs){
                    if (err) {
                        logger.info('get faqs schema error - '+err);
                        callback(err);
                    } else {
                        callback(null, result);
                    }
                });
            else
                faqs.toArray(function(err,docs){
                    if (err) {
                        logger.info('get faqs schema error - '+err);
                        callback(err);
                    } else {
                        callback(null, docs);
                    }
                });
        }
    });
};

let FaQ = mongoose.model("FaQ", faqSchema);

module.exports = FaQ;