const mpserverless = require('../index');
const db = mpserverless.db;

/**
 * 获取用户信息
 * 如果没有会自动创建用户
 *
 * @author chadwuo
 */
exports.getUserInfo = async () => {
  try {
    const res = await mpserverless.user.getInfo()
    if (!res.success) {
      throw new Error("操作失败");
    }
    const userId = res.result.user.userId // Serverless平台生成的用户ID
    let {
      result: user
    } = await db.collection('user').findOne({
      _id: userId
    })
    if (!user) {
      // 创建用户
      user = {
        _id: userId,
        nickName: '微信用户',
        avatarUrl: 'https://mmbiz.qpic.cn/mmbiz/icTdbqWNOwNRna42FI242Lcia07jQodd2FJGIYQfG0LAJGFxM4FbnQP6yfMxBgJ0F3YRqJCJ1aPAK2dQagdusBZg/0',
        familyId: '',
        isVip: false,
        createTime: new Date(),
      }
      await db.collection('user').insertOne(user)
    }

    return {
      success: true,
      data: user
    }
  } catch (e) {
    return {
      success: false,
      message: e
    };
  }
}

/**
 * 获取用户数据范围
 *
 * @return data {Array.<string>} 用户id集合。
 * @author chadwuo
 */
exports.getUserDataScope = async () => {
  const {
    userInfo
  } = getApp()

  // 没有加入家庭，就返回自己的id
  if (!userInfo.familyId) {
    return [userInfo._id]
  }

  // 获取家庭信息
  const {
    result: familyInfos
  } = await db.collection('family_member').find({
    familyId: userInfo.familyId,
    status: 1
  })

  let dataScope = familyInfos.map(i => {
    return i.userId
  })

  return dataScope
}