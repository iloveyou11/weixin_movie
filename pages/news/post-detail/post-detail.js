var postData = require('../../../data/post_data.js');
var app = getApp();

Page({

  data: {
    //记录该详情页面中音乐播放的状态
    isMusicPlay: false
  },

  onLoad: function(options) {
    var postid = options.id;
    //设置data中的postid
    this.setData({
      postid
    });
    var postContents = postData.contents;
    var detail = postContents[postid - 1];
    //设置data中的tedatl
    this.setData({
      detail
    });

    //请求文章收藏状态缓存
    var postsCollected = wx.getStorageSync('posts_collected');
    if (postsCollected) {
      var postCollected = postsCollected[postid];
      //设置data中的collected（文章的收藏状态）
      this.setData({
        collected: postCollected
      })
    } else {
      postsCollected = {};
      postsCollected[postid] = false;
      wx.setStorageSync('posts_collected', postsCollected)
    }
    //监听全局变量，判断是否是该文章的音乐在播放
    if (app.globalData.g_isMusicPlay && app.globalData.g_currentMusicPostId === postid) {
      this.setData({
        isMusicPlay: true
      })
    }
    this.setAudioMonitor();
  },

  setAudioMonitor: function() {
    var that = this;
    wx.onBackgroundAudioPlay(function() {
      that.setData({
        isMusicPlay: true
      });
      app.globalData.g_isMusicPlay = true;
      app.globalData.g_currentMusicPostId = that.data.postid;
    });

    wx.onBackgroundAudioPause(function() {
      that.setData({
        isMusicPlay: false
      });
      app.globalData.g_isMusicPlay = false;
      app.globalData.g_currentMusicPostId = null;
    });

    wx.onBackgroundAudioStop(function() {
      that.setData({
        isMusicPlay: false
      });
      app.globalData.g_isMusicPlay = false;
      app.globalData.g_currentMusicPostId = null;
    })
  },

  //点击收藏事件
  onCollectionTap: function() {
    var postsCollected = wx.getStorageSync('posts_collected');
    var postCollected = postsCollected[this.data.postid];
    postCollected = !postCollected;
    postsCollected[this.data.postid] = postCollected;
    wx.setStorageSync('posts_collected', postsCollected);
    this.setData({
      collected: postCollected
    });
    //使用showModal用户体验不太好
    // this.showModal(postsCollected,postCollected);

    this.showToast(postsCollected, postCollected);
  },

  showModal: function(postsCollected, postCollected) {
    var that = this;
    wx.showModal({
      title: '收藏',
      content: postCollected ? '收藏该文章？' : '取消收藏该文章？',
      showCancel: true,
      cancelText: '取消',
      cancelColor: '#333',
      confirmText: '确认',
      confirmColor: '#405f80',
      success: function(res) {
        if (res.confirm) {
          wx.setStorageSync('posts_collected', postsCollected);
          that.setData({
            collected: postCollected
          })
        }
      },
      fail: function(res) {},
      complete: function(res) {},
    })
  },

  showToast: function(postsCollected, postCollected) {
    var that = this;
    wx.setStorageSync('posts_collected', postsCollected);
    that.setData({
      collected: postCollected
    });
    wx.showToast({
      title: postCollected ? '收藏成功！' : '取消成功！',
      icon: 'success',
      duration: 1000
    })
  },
  //点击分享事件
  onShareTap: function() {
    var itemList = [
      "分享给微信好友",
      "分享到朋友圈",
      "分享给QQ好友",
      "分享到QQ空间",
      "分享到微博"
    ];
    wx.showActionSheet({
      itemList: itemList,
      itemColor: '#405f80',
      success: function(res) {
        wx.showModal({
          title: '用户' + itemList[res.tapIndex],
          content: '用户是否点击了取消？' + res.cancel + '抱歉，现在暂时无法分享！',
        })
      }
    })
  },
  //点击音乐播放事件
  onMusicTap: function(event) {
    var detail = this.data.detail;
    var isMusicPlay = this.data.isMusicPlay;
    if (isMusicPlay) {
      wx.pauseBackgroundAudio();
      this.setData({
        isMusicPlay: !isMusicPlay
      })
    } else {
      wx.playBackgroundAudio({
        dataUrl: detail.music.url,
        title: detail.music.title
      });
      this.setData({
        isMusicPlay: !isMusicPlay
      })
    }
  }

  
})