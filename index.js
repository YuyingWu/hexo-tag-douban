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

hexo.extend.tag.register('douban', function (args) {
  var url = parseInt(args[0]);
  // var page = parseInt(args[1]) || 1;
  // var config = hexo.config.bilibili || {};
  // config.width = config.width || 452;
  // config.height = config.height || 544;
  // var bili_video = new bili_convert(av_id, page);
  return '<div class="hexo-tag-douban">'
    + 'Hello, Tag Douban!'
    + url
    + '</div>';
});