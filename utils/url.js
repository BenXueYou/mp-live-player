
const serverHost = "https://open.hikyun.com"
module.exports = {
  getAccessToken: `${serverHost}/artemis/oauth/token/v2`,
  getRtmpUrl: `${serverHost}/artemis/api/eits/v1/global/live/address/get/by/deviceSerial`,
  getEZTokenUrl: `${serverHost}/artemis/api/eits/v1/global/ys/restricted/token/get`,
  getEZTimeUrl: `${serverHost}/artemis/api/eits/v1/global/monitor/video/by/time`
}
