var util = require('../../utils/util.js');
var app = getApp();
Page({
  data: {
    inTheater: {},
    comingSoon: {},
    top250: {},
    searchResult: {},
    containerShow: true,
    searchPanelShow: false,
  },
  onLoad: function(event) {
    var inTheaterUrl = app.globalData.doubanBase + '/v2/movie/in_theaters?start=0&count=3';
    var comingSoonUrl = app.globalData.doubanBase + '/v2/movie/coming_soon?start=0&count=3';
    var top250Url = app.globalData.doubanBase + '/v2/movie/top250?start=0&count=3';
    this.getMovieListData(inTheaterUrl, "inTheater", "正在热映");
    this.getMovieListData(comingSoonUrl, "comingSoon", "即将上映");
    this.getMovieListData(top250Url, "top250", "豆瓣top250");
  },

  //搜索框聚焦
  onBindFocus: function() {
    this.setData({
      containerShow: false,
      searchPanelShow: true
    })
  },
  //点击搜索框的XX按钮
  onCancelImgTap: function(event) {
    this.setData({
      containerShow: true,
      searchPanelShow: false,
      searchResult: {}
    })
  },

  //进行搜索
  onBindChange: function(event) {
    var text = event.detail.value;
    var searchUrl = app.globalData.doubanBase + '/v2/movie/search?q=' + text;
    // console.log(searchUrl);
    this.getMovieListData(searchUrl, 'searchResult', '');
  },

  getMovieListData: function(url, settedKey, catogoryTitle) {
    var that = this;
    wx.request({
      url: url,
      data: '',
      header: {},
      method: 'GET',
      dataType: 'json',
      responseType: 'text',
      success: function(res) {
        that.processDoubanData(res.data, settedKey, catogoryTitle);
      },
      fail: function(res) {},
      complete: function(res) {},
    })
  },

  processDoubanData: function(moviesData, settedKey, catogoryTitle) {
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
    var readyData = {};
    readyData[settedKey] = {
      catogoryTitle: catogoryTitle,
      movies: movies
    };
    this.setData(readyData);
  },


  onMoreTap: function(event) {
    var catogory = event.currentTarget.dataset.catogory;
    wx.navigateTo({
      url: 'more-movies/more-movies?catogory=' + catogory,
      success: function(res) {},
      fail: function(res) {},
      complete: function(res) {},
    })
  },

  //点击电影，跳转至电影详情页面
  onMovieTap: function (event) {
    var id = event.currentTarget.dataset.movieid;
    wx.navigateTo({
      url: 'movie-detail/movie-detail?id=' + id
    })
  }
})