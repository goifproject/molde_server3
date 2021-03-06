const logger = require('../service/logger');
let CommentReport = require("../models/commReportSchema");
let bodyParser = require("body-parser");

module.exports = function (router) {
    router.use(bodyParser.urlencoded({extended: true}));

    // 댓글 신고 리스트 가져오기
    router.get("/commreport", function (req, res, next) {
        let page = req.query.page != undefined ? Number(req.query.page) : -1;
        let per_page = req.query.perPage != undefined ? Number(req.query.perPage) : -1;
        CommentReport.getCommentReports(per_page, page, function (err, reps) {
            if (err) {
                logger.info('get comment reports error - '+err);
            } else {
                res.json({data:reps});
            }
        })
    });

    // 댓글 신고 삭제
    router.delete("/commreport", function (req, res, next) {
        let comm_id = req.body.commentId;
        CommentReport.removeCommentReport(comm_id, function (err, reps) {
            if (err) {
                logger.info('remove comment for admin error - '+err);
                res.status(200).send({result:0});
            }
            else {
                res.status(200).send({result:1});
            }
        })
    });
};