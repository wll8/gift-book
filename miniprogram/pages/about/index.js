// pages/about/index.js
Page({

    /**
     * 页面的初始数据
     */
    data: {

    },
    goGuide(){
        wx.showToast({
            title: '开发中...',
            icon:'none',
          })
    },
    micahh(){
        const arr = ['你拍了拍作者头顶\r\n却没摸到秀发', '用技术提供无限可能', '记得住恩情 守得住初心', '每一份人情\r\n都值得礼记']
        const index = Math.floor(Math.random() * arr.length)
        wx.showToast({
            title: arr[index],
            icon:'none',
            duration: 2500
          })
    },
    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function (options) {

    },

    /**
     * 生命周期函数--监听页面初次渲染完成
     */
    onReady: function () {

    },

    /**
     * 生命周期函数--监听页面显示
     */
    onShow: function () {

    },

    /**
     * 生命周期函数--监听页面隐藏
     */
    onHide: function () {

    },

    /**
     * 生命周期函数--监听页面卸载
     */
    onUnload: function () {

    },

    /**
     * 页面相关事件处理函数--监听用户下拉动作
     */
    onPullDownRefresh: function () {

    },

    /**
     * 页面上拉触底事件的处理函数
     */
    onReachBottom: function () {

    },

    /**
     * 用户点击右上角分享
     */
    onShareAppMessage: function () {
        
    },
})