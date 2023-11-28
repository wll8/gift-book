import config from "@/config/index.js";
import api from "@/utils/api.js";
import * as utils from "@/utils/index.js";

wx.$config = config
wx.$userInfo = undefined
wx.$awaitList = [] // 登录结束前等待调用的接口
wx.$awaitLogin = () => new Promise((resolve, reject) => {
  wx.$awaitList ? wx.$awaitList.push(resolve) : resolve()
})
wx.$api = api
wx.$utils = utils
wx.$app = {
  //挂载到app上
  colorUI: config.colorUI,
  giftTotal: {
    receive: 0,
    out: 0,
  },
  async onLaunch() {
    wx.login({
      success: async (e) => {
        const [, user] = await wx.$api.get(`/login`, {code: e.code})
        wx.$userInfo = user
        wx.setStorageSync(`token`, user.token)
        wx.setStorageSync(`id`, user.id)
        wx.$awaitList.forEach((fn) => fn())
        wx.$awaitList = undefined
      }
    })
  },
}

App(wx.$app);
