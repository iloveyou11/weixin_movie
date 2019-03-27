import { Movie } from 'class/Movie.js';
var app = getApp();

Page({

  data: {
    movie: {}
  },

  onLoad: function (options) {
    var movieId = options.id;
    var detailUrl = app.globalData.doubanBase + '/v2/movie/subject/' + movieId;
    var movie = new Movie(detailUrl);
    movie.getMovieData((movie) => {
      this.setData({
        movie: movie
      })
    })
  },


  //点击图片实现大图预览
  viewMoviePostImg: function (event) {
    var src = event.currentTarget.dataset.src;
    wx.previewImage({
      current: 'src',
      urls: [src]
    })
  }
})