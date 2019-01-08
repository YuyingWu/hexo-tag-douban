/**
* hexo-tag-douban
* https://github.com/YuyingWu/hexo-tag-douban
* Copyright (c) 2018, Yuying Wu
* Licensed under the MIT license.
* Syntax:
* {% douban [subjectUrl] %}
* {% douban "https://book.douban.com/subject/30292589/" %}
* {% douban "https://movie.douban.com/subject/30276726/" %}
*/

var fs = require('fs');
var https = require('https');
var Promise = require('bluebird');

var parseUrl = function (url) {
  var pattern = /(\w+):\/\/([^/:]+)\/subject\/(\d+)/;
  var results = url.match(pattern);
  return {
    host: results[2],
    id: results[3]
  };
}

var promiseDoubanData = function (host, id) {
  // var url = 'https://api.douban.com/v2/book/26541801?fields=id,title,url,image,publisher,pubdate,subtitle,author,translator,price,rating,summary&apikey=0e13da30b101d57c2a3b8e9213058074';

  var type = host.split('.')[0]; // book || movie
  var fields = '';

  switch (type) {
    case 'book':
      fields = 'id,title,alt,image,publisher,pubdate,subtitle,author,translator,price,rating,summary';
      break;
    // case 'movie':
    //   fields = 'title,alt,image,pubdate';
    //   break;
    default:
  }

  // var url = 'https://api.douban.com/v2/' + type + '/' + id + '?fields=' + fields + '&apikey=0e13da30b101d57c2a3b8e9213058074';
  var url = 'https://api.douban.com/v2/' + type + '/' + id + '?fields=' + fields;

  return new Promise(function (resolve, reject) {
    https.get(url, function (res) {
      var data = '';

      res.on('data', function (chunk) {
        data += chunk;
      });

      res.on('end', function () {
        var json = JSON.parse(data);

        // if (json.stat === 'ok') {
        //   resolve(json);
        // } else {
        //   return reject('API status not OK!!!');
        // }
        resolve(json);
      });
    }).on('error', function (e) {
      return reject('API status error: ' + e);
    });
  });
}

var renderTpl = function (type, data) {
  var tpl;

  switch (type) {
    case 'book':
      tpl = [
        '<a href="' + data.alt + '" target="_blank" style="color: #666;display:block;">',
          '<img src="' + data.image + '?apikey=0e13da30b101d57c2a3b8e9213058074" alt="' + data.title + '" style="width: 135px; height: 192px; display:inline-block; margin-right: 14px;"  referrerpolicy="no-referrer" />',
          '<div class="info" style="display:inline-block; vertical-align: top;">',
            '<p style="margin:0; font-size: 14px;">书名：' + data.title + '</p>',
            '<p style="margin:0; font-size: 14px;width:200px;overflow:hidden;text-overflow:ellipsis;white-space:nowrap;" title="' + data.publisher + '">出版社：' + data.publisher + '</p>',
            '<p style="margin:0; font-size: 14px;">出版日期：' + data.pubdate + '</p>',
            '<p style="margin:0; font-size: 14px;">作者：' + data.author.join(',') + '</p>',
            data.translator.length ? '<p style="margin:0; font-size: 14px;">译者：' + data.translator.join(',') + '</p>' : '',
            '<p style="margin:0; font-size: 14px;">出版年：' + data.pubdate + '</p>',
            '<p style="margin:0; font-size: 14px;">定价：' + data.price + '</p>',
          '</div>',
        '</a>'
      ].join('');
      break;
    // case 'movie':
    //   tpl = [
    //     '<a href="' + data.url + '" target="_blank" style="color: #666;display:block;">',
    //       '<img src="' + data.image + '?apikey=0e13da30b101d57c2a3b8e9213058074" alt="' + data.title + '" style="width: 135px; height: 192px; display:inline-block; margin-right: 14px;" />',
    //       '<div class="info" style="display:inline-block; vertical-align: top;">',
    //         '<p style="margin:0; font-size: 14px;">书名：' + data.title + '</p>',
    //         '<p style="margin:0; font-size: 14px;width:200px;overflow:hidden;text-overflow:ellipsis;white-space:nowrap;" title="' + data.publisher + '">出版社：' + data.publisher + '</p>',
    //         '<p style="margin:0; font-size: 14px;">出版日期：' + data.pubdate + '</p>',
    //         '<p style="margin:0; font-size: 14px;">作者：' + data.author.join(',') + '</p>',
    //         data.translator.length ? '<p style="margin:0; font-size: 14px;">译者：' + data.translator.join(',') + '</p>' : '',
    //         '<p style="margin:0; font-size: 14px;">出版年：' + data.pubdate + '</p>',
    //         '<p style="margin:0; font-size: 14px;">定价：' + data.price + '</p>',
    //       '</div>',
    //     '</a>'
    //   ].join('');
    //   break;
    default:
  }

  return tpl;
}

hexo.extend.tag.register('douban', function (args) {
  var url = args[0];
  var doubanData = parseUrl(url);
  var tpl = '<p>获取数据失败，请检查传入URL是否正确。</p>';

  return promiseDoubanData(doubanData.host, doubanData.id).then(function (data) {
    if (data && data.title) {
      tpl = renderTpl(doubanData.host.split('.')[0], data);
    }

    return '<div class="hexo-tag-douban" style="position:relative;width:60%;border:1px solid #666;border-radius: 4px;margin:10px auto;padding: 10px;">'
      + tpl
      + '<div style="background: url(https://img3.doubanio.com/pics/douban-icons/favicon_24x24.png);width: 24px;height: 24px;position: absolute;right: 10px;bottom: 10px;"></div>'
      + '<a href="https://github.com/YuyingWu/hexo-tag-douban" title="hexo-tag-douban" target="_blank" style="display:block;width:24px;height:24px;position: absolute; bottom:10px;right: 39px;"><img src="https://github.com/fluidicon.png" alt="" style="display:block;width:24px;height:24px;" /></a>'
      + '</div>';
  });
}, { async: true });