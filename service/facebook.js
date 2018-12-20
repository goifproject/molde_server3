const logger = require('../service/logger');
let fs = require("fs");
var FB = require('fb');
var moment = require('moment');
let News = require('../models/newsSchema');

let FacebookConfig = fs.readFileSync("./config/fbconfig.json");
let Facebook = JSON.parse(FacebookConfig);
var pageToken = Facebook.pageToken;

FB.setAccessToken(pageToken);

exports.getFacebookPosts = function(){

    FB.api('2000008220011384/posts?fields=picture,message,updated_time', function (res) {
        if(!res || res.error) {
            logger.info(!res ? 'facebook crawling error occurred' : 'facebook crawling error occurred ' + res.error);
            return;
        }
        logger.info('Facebook cardnews post checkup - count ' + res.data.length)

        var page_num = 0;
        for (var i = 0; i < res.data.length; i++){
            var news = {description: "", news_img: [], date: "", post_id: ""}
            var postData = res.data[i];
            // 생성 날짜
            if(postData.updated_time){
                news.date = moment(postData.created_time).format();
                // 하루에 한번씩 업데이트 되기 때문에 1일 이전 데이터는 지나간다
                if(moment(postData.updated_time).isBefore(moment().subtract(1, 'days'))) continue;
            }
            
            // 포스트 아이디
            if(!postData.id) continue;
            news.post_id = postData.id;

            // 포스트 이미지
            if (!postData.picture) continue;
            news.news_img.push({
                'url': postData.picture,
                'page_num': page_num
            });
            page_num++;

            // 포스트 메시지
            if (postData.message) news.description = res.data[i].message;
            
            News.updateNewsFromFB(news);
        }
    });
}