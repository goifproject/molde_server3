const logger = require('../service/logger');
var mongoose = require("mongoose");
var Counter = require('./counterSchema');
var Schema = mongoose.Schema;

var photoSchema = new Schema([{
    filepath: {type: String, default: null},
}]);

var resultSchema = new Schema({
    result_id: {type: Number},
    rep_id: {type: Number},
    result_date: {type: String},
    result_img: [[photoSchema]]
});

function getNextId(name,cb){
    Counter.findOneAndUpdate(
        {_id: name },
        {$inc: {seq: 1}},
        {projection: {"_id": 0, "seq": 1 }},
        function(err, result){
            if(err) {
                logger.info('get result collection count and update schema error - '+err);
            } else{
                cb(result.seq);
            }
        }
     );
}

// 신고 내역 추가
resultSchema.statics.insertReportResultFunc = function (rep_id, img_object, callback) {
    let now = new Date;
    getNextId('Results',function(_seq){
        Result.collection.insert({
            result_id: _seq,
            rep_id: Number(rep_id),
            result_date: now.getTime(),
            result_img: img_object,
        }, function (err, result) {
            if (err) {
                logger.info('insert report result schema error - ' + err);
                callback(err);
            } else {
                callback(null, result);
            }   
        })
    })
};

resultSchema.statics.showReportResult = function (rep_id, callback) {
    Result.collection.find({
        rep_id: Number(rep_id) 
    }, {projection: {"_id": 0, "result_id": 1, "rep_id": 1,
            "result_date": 1, "result_img": 1 }},
    function (error, results) {
            if (error) {
                logger.info('show report result schema error - ' + err);
                callback(error);
            } else {
                results.toArray(function(err,result){
                    if(err) {
                        logger.info('show report result schema error - '+err);
                        callback(err);
                    } else {
                        callback(null, result);
                    }
                });
            }
        }
    );
}

var Result = mongoose.model("Result", resultSchema);

module.exports = Result;