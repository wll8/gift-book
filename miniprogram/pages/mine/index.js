const userService = require('../../alicloud/services/user')
const jinrishici = require('../../utils/jinrishici.js')
const giftOutService = require('../../alicloud/services/giftOut')
const giftReceiveService = require('../../alicloud/services/giftReceive')

import {
	welcome
} from '../../utils/index.js'
const app = getApp();
Page({
	/**
	 * 页面的初始数据
	 */
	data: {
		scrollTop: 0,
		jinrishici: '',
		avatarUrl: '',
		nickName: '',
		showProfile: false,
		welcome: welcome(),
		totalGift: {
			receiveTotal: '',
			outTotal: ''
		},
		menus: [{
				icon: "cicon-home-community",
				name: "我的家庭",
				color: "text-mauve",
				path: "/pages/family/index"
			},
			{
				icon: "cicon-event-list",
				name: "数据导出",
				color: "text-orange",
				path: "/pages/backup/index"
			},
			{
				icon: "cicon-demo",
				name: "统计分析",
				color: "text-red",
				path: "/pages/analysis/index"
			},
			{
				icon: "cicon-person-pin-circle-o",
				name: "亲友关系",
				color: "text-green",
				path: "/pages/relationship/index"
			}
		],
	},
	// 监听用户滑动页面事件。
	onPageScroll(e) {
		// 注意：请只在需要的时候才在 page 中定义此方法，不要定义空方法。以减少不必要的事件派发对渲染层-逻辑层通信的影响。
		// 注意：请避免在 onPageScroll 中过于频繁的执行 setData 等引起逻辑层-渲染层通信的操作。尤其是每次传输大量数据，会影响通信耗时。
		// https://developers.weixin.qq.com/miniprogram/dev/reference/api/Page.html#onPageScroll-Object-object
		this.setData({
			scrollTop: e.scrollTop
		})
	},
	tapToUrl(e) {
		wx.navigateTo({
			url: e.currentTarget.dataset.url
		})
	},
	/**
	 * 生命周期函数--监听页面加载
	 */
	onLoad: function (options) {
		jinrishici.load(result => {
			this.setData({
				jinrishici: result.data.content,
			})
		})
		this.setData({
			avatarUrl: app.userInfo.avatarUrl,
			nickName: app.userInfo.nickName,
		})
	},
	// 选择头像
	onChooseAvatar(e) {
		const {
			avatarUrl
		} = e.detail
		const options = {
			filePath: avatarUrl,
		};
		console.log(avatarUrl)
		app.mpserverless.file.uploadFile(options).then(res => {
			console.log(res);
			this.setData({
				avatarUrl: res.fileUrl
			})
		});
	},
	onShowProfile() {
		this.setData({
			showProfile: true
		})
	},
	onCloseProfile() {
		this.setData({
			showProfile: false
		})
	},
	// 保存个人信息
	async onSaveProfile() {
		const res = await userService.updateUserInfo({
			_id: app.userInfo._id,
			nickName: this.data.nickName,
			avatarUrl: this.data.avatarUrl,
		})
		if (res.success) {
			wx.showToast({
				title: '更新成功',
			})
			app.userInfo.nickName = this.data.nickName
			app.userInfo.avatarUrl = this.data.avatarUrl
		}
		this.setData({
			showProfile: false
		})
	},
	async getGiftTotal() {
		const {
			data: rTotal
		} = await giftReceiveService.computedTotalGiftReceive()
		const {
			data: oTotal
		} = await giftOutService.computedTotalGiftOut()
		this.setData({
			totalGift: {
				receiveTotal: rTotal || 0,
				outTotal: oTotal || 0
			}
		})
		console.log('getGiftTotal', this.data.totalGift)
		app.refreshTotalGift = false
	},
	/**
	 * 生命周期函数--监听页面初次渲染完成
	 */
	onReady: function () {},

	/**
	 * 生命周期函数--监听页面显示
	 */
	async onShow() {
		if (app.refreshTotalGift) {
			this.getGiftTotal()
		}
	},

	/**
	 * 生命周期函数--监听页面隐藏
	 */
	onHide: function () {},

	/**
	 * 生命周期函数--监听页面卸载
	 */
	onUnload: function () {},

	/**
	 * 页面相关事件处理函数--监听用户下拉动作
	 */
	onPullDownRefresh: function () {},

	/**
	 * 页面上拉触底事件的处理函数
	 */
	onReachBottom: function () {},

	/**
	 * 用户点击右上角分享
	 */
	onShareAppMessage: function () {
		return {
			title: '可能是东半球最好用的人情记账工具',
			path: "pages/start/index",
			imageUrl: '/static/img/share.jpg'
		}
	}
})