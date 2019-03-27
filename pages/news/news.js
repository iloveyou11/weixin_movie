var post_list = require('../../data/post_data.js');


Page({
  onLoad: function () {
    this.setData({
      contents: post_list.contents
    });
  },

  onPostTap: function(event) {
    var postid = event.currentTarget.dataset.postid;
    wx.navigateTo({
      url: 'post-detail/post-detail?id=' + postid,
    })
  },

  onSwiperTap: function(event) {
    var postid = event.target.dataset.postid;
    wx.navigateTo({
      url: 'post-detail/post-detail?id=' + postid,
    })
  }


})