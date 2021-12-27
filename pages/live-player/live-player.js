import url from "../../utils/url"
import { request } from "../../utils/http"
Page({
  onShareAppMessage() {
    return {
      title: 'live-player',
      path: 'page/component/pages/live-player/live-player'
    }
  },
  data: {
    radioGroup: [
      // { id: "ezopen", label: "ezopen", value: "1"},
      // { id: "hls", label: "hls", value: "2"},
      { id: "rtmp", label: "rtmp", value: "3", checked: true },
      { id: "flv", label: "flv", value: "4" }
    ],
    deviceOffline: false,
    videoLoadingStatus: 0,
    videoNetWorkError: false,
    protocolType: "3",
    channelNo: "1",
    deviceSerial: "E59225077",
    projectId: "2059190290597712",
    videoSrc: ""
  },
  onReady(res) {
    this.ctx = wx.createLivePlayerContext('player')
    this.handleRequestVideoUrl();
  },
  handleRequestVideoUrl() {
    const { deviceSerial, projectId } = this.data;
    request({
      method: "POST",
      url: url.getRtmpUrl,
      data: {
        "channelNo": "1",
        "deviceSerial": deviceSerial,
        "projectId": projectId,
        "protocol": this.data.protocolType
      }
    }, res => {
      if (res.code === "200" && res.data.url) {
        this.setData({
          videoSrc: res.data.url
        });
        this.handlePlay();
      } else {
        wx.showToast({
          title: res.msg,
        });
      }
    }, err => {
      console.log("requestTokenErr", err)
    })
  },
  radioChange(e) {
    console.log(e.detail.value)
    this.setData({
      protocolType: e.detail.value
    })
    this.handleRequestVideoUrl()
  },
  handleLivePlayerStateChange(e) {
    console.log('live-player code:', e.detail.code)
    console.log('live-player code:', e.detail.code, e.detail);
    const { code } = e.detail;
    let videoLoadingStatus = 0;
    let videoNetWorkError = false;
    switch (code) {
      case 2007: //启动loading
        videoLoadingStatus = 0;
        console.log("视频播放Loading")
        break;
      case 2001: //连接服务器
        videoLoadingStatus = 20;
        console.log("已经连接服务器")
        break;
      case 2002: //已经连接 RTMP 服务器,开始拉流
        videoLoadingStatus = 40;
        console.log("已经连接 RTMP 服务器,开始拉流")
        break;
      case 2008: // 解码器启动
        console.log("解码器启动")
        videoLoadingStatus = 60;
        break;
      case 2009: //视频分辨率改动
        // this.handlePlay();
        console.log("视频分辨率改动")
        break;
      case 2004: // 视频播放开始
        videoLoadingStatus = 80;
        console.log("case 2004: // 视频播放开始");
        break;
      case 2003: //网络接收到首个视频数据包(IDR)
        console.log("case 2003: //网络接收到首个视频数据包(IDR)");
        videoLoadingStatus = 100;
        break;
      case 2103: //网络断连, 已启动自动重连（本小程序不自动重连）
        console.log("网络断连, 已启动自动重连（本小程序不自动重连）");
        break;
      case 3001:
      case 3002:
      case 3003:
      case 3005: // 播放失败
        console.log("case 3005: // 播放失败");
        videoLoadingStatus = 100;
        videoNetWorkError = true;
        this.checkNetWork();
        this.handleStop();
        wx.showToast({
          title: '当前网络异常',
          icon: 'none'
        })
        break;
      case 2105:
        // this.handlePlay();
        console.log("当前视频播放出现卡顿")
        break;
      case -2301: // 经多次重连抢救无效，更多重试请自行重启播放
        videoLoadingStatus = 100;
        videoNetWorkError = true;
        console.log("经多次重连抢救无效，更多重试请自行重启播放")
        break;
      case 2032: // 播放中
        videoLoadingStatus = 100;
        console.log("视频播放中")
        break;
    }
    console.log(videoLoadingStatus, "============================", videoNetWorkError)
    this.setData({
      videoLoadingStatus: videoLoadingStatus,
      videoNetWorkError: videoNetWorkError,
    });
  },
  handleLivePlayerError(e) {
    console.error('live-player error:', e.detail.errMsg)
  },
  handlePlay() {
    this.ctx.play({
      success: res => {
        console.log('play success', res)
        this.setData({
          videoLoadingStatus: 100
        });
      },
      fail: res => {
        console.log('play fail====', res)
      }
    })
  },
  handlePause() {
    this.ctx.pause({
      success: res => {
        console.log('pause success', res)
      },
      fail: res => {
        console.log('pause fail', res)
      }
    })
  },
  handleStop() {
    this.ctx.stop({
      success: res => {
        console.log('stop success', res)
      },
      fail: res => {
        console.log('stop fail', res)
      }
    })
  },
  handleResume() {
    this.ctx.resume({
      success: res => {
        console.log('resume success', res)
      },
      fail: res => {
        console.log('resume fail', res)
      }
    })
  },
  handleMute() {
    this.ctx.mute({
      success: res => {
        console.log('mute success', res)
      },
      fail: res => {
        console.log('mute fail', res)
      }
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
  },
  checkNetWork() {
    const _this = this;
    wx.getNetworkType({
      success(res) {
        console.log("checkNetWork", res)
        const networkType = res.networkType
        if (!networkType || networkType === 'none') {
          wx.showToast({
            title: '当前网络异常',
            icon: 'none',
            duration: 2000,
          })
        }
      }
    })
  },
})
