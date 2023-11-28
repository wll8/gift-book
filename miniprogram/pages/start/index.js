// pages/start/index.js
const app = getApp();

Page({
  /**
   * 页面的初始数据
   */
  data: {
    netError: false,
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad(options) {
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady() {},
  /**
   * 生命周期函数--监听页面显示
   */
  async onShow() {
    await wx.$awaitLogin()
    wx.switchTab({
      url: "/pages/index/index",
    });
  },
  onRetry() {
    this.setData({
      netError: true,
    });
    // 小程序重启
    wx.reLaunch({
      url: "/pages/start/index",
    });
  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide() {},

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload() {},

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh() {},

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom() {},
});
