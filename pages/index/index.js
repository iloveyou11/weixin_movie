Page({
  data: {
    
  },
  // 目前只能用switchTab跳转至tab页
  onTap:function(){
    wx.switchTab({
      url: '../news/news',
    })
  }
})