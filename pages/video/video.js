import url from "../../utils/url"
import { request } from "../../utils/http"
import { getRandomColor } from "../../utils/util"

Page({
  onShareAppMessage() {
    return {
      title: 'video',
      path: 'page/component/pages/video/video'
    }
  },

  onReady() {
    this.videoContext = wx.createVideoContext('myVideo')
    this.handleRequestVideoUrl();
  },

  onHide() {

  },

  inputValue: '',
  data: {
    protocolType: "2",
    radioGroup: [
      // { id: "ezopen", label: "ezopen", value: "1"},
      { id: "hls", label: "hls", value: "2",  checked: true},
      // { id: "rtmp", label: "rtmp", value: "3"},
      // { id: "flv", label: "flv", value: "4"}
    ],
    enableAutoRotation: true,
    channelNo: "1",
    deviceSerial: "E59225077",
    projectId: "2059190290597712",
    src: '',
    videoSrc: "",
    danmuList:
    [{
      text: '第 1s 出现的弹幕',
      color: '#ff0000',
      time: 1
    }, {
      text: '第 3s 出现的弹幕',
      color: '#ff00ff',
      time: 3
    }],
  },

  handleRequestVideoUrl () {
    const {deviceSerial, projectId} = this.data;
    request({
      method: "POST",
      url: url.getRtmpUrl,
      data: {
          "channelNo": "1",
          "deviceSerial": deviceSerial,
          "projectId": projectId,
          "protocol":  this.data.protocolType
      }
    },res => {
      if(res.code === "200" &&  res.data.url){
        this.setData({
          videoSrc: res.data.url
        });
      } else {
        wx.showToast({
          title: res.msg,
        });
      }
    }, err => {
      console.log("requestTokenErr", err)
    })
  },

  radioChange (e) {
    console.log(e.detail.value)
    this.setData({
      protocolType: e.detail.value
    })
  },

  bindInputBlur(e) {
    this.inputValue = e.detail.value
  },

  bindButtonTap() {
    const that = this
    wx.chooseVideo({
      sourceType: ['album', 'camera'],
      maxDuration: 60,
      camera: ['front', 'back'],
      success(res) {
        that.setData({
          src: res.tempFilePath
        })
      }
    })
  },

  bindVideoEnterPictureInPicture() {
    console.log('进入小窗模式')
  },

  bindVideoLeavePictureInPicture() {
    console.log('退出小窗模式')
  },

  bindPlayVideo() {
    this.videoContext.play()
    this.setData({})
  },
  bindSendDanmu() {
    this.videoContext.sendDanmu({
      text: this.inputValue,
      color: getRandomColor()
    })
  },

  videoErrorCallback(e) {
    console.log('视频错误信息:')
    console.log(e.detail.errMsg)
  },
  handleSwitchChange(e) {
    this.setData({
      enableAutoRotation: e.detail.value
    })
  },

  handleProjectIdInput(e) {
    this.setData({
      projectId: e.detail.value
    })
  },
  handleDeviceSerialInput(e) {
    this.setData({
      deviceSerial: e.detail.value
    })
  }
})
