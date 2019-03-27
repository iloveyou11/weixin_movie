var app = getApp();
var util = require('../../../utils/util.js');

Page({
  data: {
    movies: {},
    requestUrl: '',
    totalCount: 0,
    isEmtpy: true
  },

  onLoad: function (options) {
    var catogory = options.catogory;
    //获取是点击了哪类电影的“更多”
    // console.log(catogory);
    wx.setNavigationBarTitle({
      title: catogory,
      success: function (res) { },
      fail: function (res) { },
      complete: function (res) { },
    });
    var url = '';
    switch (catogory) {
      case "正在热映":
        url = app.globalData.doubanBase + '/v2/movie/in_theaters';
        break;
      case "即将上映":
        url = app.globalData.doubanBase + '/v2/movie/coming_soon';
        break;
      case "豆瓣top250":
        url = app.globalData.doubanBase + '/v2/movie/top250';
        break;
    }
    this.setData({
      requestUrl: url
    })
    util.http(url, this.processDoubanData);
  },


  processDoubanData: function (moviesData) {
    var movies = [];
    for (var index in moviesData.subjects) {
      var subject = moviesData.subjects[index];
      var title = subject.title;
      if (title.length > 6) {
        title = title.substring(0, 6) + '...';
      }
      var temp = {
        stars: util.convertToStarArray(subject.rating.stars),
        title: title,
        score: subject.rating.avarage,
        coverUrl: subject.images.large,
        movieId: subject.id
      };
      movies.push(temp);
    }

    var totalMovies = {};
    if (!this.data.isEmtpy) {
      totalMovies = this.data.movies.concat(movies);
    } else {
      totalMovies = movies;
      this.data.isEmtpy = false;
    }

    this.setData({
      movies: totalMovies
    });
    this.data.totalCount += 20;

    wx.hideNavigationBarLoading();
    wx.stopPullDownRefresh();
  },


onReachBottom: function () {
    var nextUrl = this.data.requestUrl + '?start=' + this.data.totalCount + '&count=20';
    util.http(nextUrl, this.processDoubanData);
    wx.showNavigationBarLoading();
  },

  //点击电影，跳转至电影详情页面
  onMovieTap: function (event) {
    var id = event.currentTarget.dataset.movieid;
    wx.navigateTo({
      url: '../movie-detail/movie-detail?id=' + id
    })
  },

  onPullDownRefresh: function () {
    var refreshUrl = this.data.requestUrl + '?start=0&count=20';
    this.data.movies={};
    this.data.isEmtpy=true;
    this.data.totalCount=0;
    util.http(refreshUrl,this.processDoubanData);
    wx.showNavigationBarLoading();
  },


})