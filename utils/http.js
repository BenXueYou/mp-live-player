import url from "./url"
const serverHost = "https://open.hikyun.com";
const errCodeArr = ["0x02401006", "0x02401005"];
const appGlobalData = getApp().globalData;
const requestToken = () => {
  return new Promise((resolve, reject) => {
    wx.request({
      method: "POST",
      url: url.getAccessToken,
      data: {
          "accessKey": appGlobalData.accessKey,
          "secretKey": appGlobalData.secretKey,
          "productCode": appGlobalData.productCode,
          "projectId": appGlobalData.projectId
      },
      success (res) {
        if(res.statusCode === 200 && res.data.code === "200"){
          const accessToken = res.data.data.access_token;
          appGlobalData.access_token = accessToken;
          resolve(accessToken)
        }
        reject()
      },
      fail(err) {
        wx.showToast({
          title: '网络异常',
        });
        reject()
      }
    })
  });
}

const request = (req, rescb, rejcb) => {
  if(appGlobalData.access_token){
    req.header = {
      ...req.header,
      access_token: appGlobalData.access_token
    }
  }
  wx.request({
    ...req,
    success: async (res) => {
      if(res.statusCode === 200 && errCodeArr.includes(res.data.code)) {
        const token = await requestToken()
        wx.request({
          ...req,
          header: {
            access_token:token
          },
          success: (rs) => {
            rescb(rs.data)
          },
          fail: rejcb
        });
      } else {
        rescb(res.data)
      }
    },
    fail(err) {
      wx.showToast({
        title: '网络异常',
      });
      rejcb && rejcb(err)
    }
  })
}
module.exports = {
  request,
}
