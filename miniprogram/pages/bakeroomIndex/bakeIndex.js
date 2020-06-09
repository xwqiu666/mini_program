// miniprogram/pages/bakeroomIndex/bakeIndex.js
const cloudUtils = require('../../utils/cloudUtils');

Page({

  /**
   * 页面的初始数据
   */
  data: {
      skipCount : 0, //第几页
      limitCount :6, //每次查询记录数
      topTipMsg : "", //显示提示信息
      showPageLoading : false,


      notice : "有意订购请点击此链接识别二维码联系卖家,谢谢！",//公告栏
      //页面数据
      viewImgs :[],
      cakeInfo:[],
      cakeItemInfo:[],

      bannerLoadFinish : false
  },

  statusObj : {
     currentCakeType : ""//当前蛋糕种类
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
       this.showLoading('');
       let that = this;
       cloudUtils.getBannerList(res=>{
          //拿到res渲染广告图
          this.setData({
            viewImgs : res.data
          });
          //查询商品列表
          cloudUtils.getCakeTypeList(result=>{
              //把cakeType放入数组
              let infoArray = result.data;
              var cakeInfoList = [];
              for (let i=0; i<infoArray.length; i++) {
                   //过滤掉活动商品,活动商品另外显示
                   let cakeType = infoArray[i].cake_type;
                   if(!!cakeType && cakeType.indexOf("活动") > 0){
                      continue;
                   }
                   cakeInfoList.push(cakeType)
              }
              this.setData({
                cakeInfo : cakeInfoList
              });
              that.queryFirstItem()
          })
       })
  },

  //点击轮播图，跳到相应的活动菜单
  tapViewImg : function(event){
    //跳过去调用触摸相应菜单的方法
    let dataset = event.currentTarget.dataset;
    let cakeType = dataset.caketype;

    var currentIndex = this.data.cakeInfo.indexOf(cakeType);
    if( -1 == currentIndex){
       //没有此类商品则不操作
       return;
    }

    var instance = this.selectComponent("#cakeTypeID"); //获取子组件实例
    //拼接子组件需要的参数
    var event = {
        currentTarget : {
            dataset : {
              index : currentIndex,
              name : cakeType
            }
        }
    }
    instance.tapTypeTab(event);
  },
 
  //联系卖家
  contactSeller : function(){
    wx.previewImage({
      current: "cloud://bake-room-0tq2s.6261-bake-room-0tq2s-1302026607/qrcode/qrCode.jpg", // 当前显示图片的http链接
      urls: ["cloud://bake-room-0tq2s.6261-bake-room-0tq2s-1302026607/qrcode/qrCode.jpg"], // 需要预览的图片http链接列表
      /* success : function(){
          // wx.scanCode({
          //   complete: (res) => {},
          // })
      } */
    })
  },

  //显示内容并隐藏加载框
   showContent : function(){
      wx.hideLoading({
      })
   },

  /**
   * 查询第一栏的蛋糕信息
   */
  queryFirstItem : function(){
     /* this.setData({
          currentCakeType : this.data.cakeInfo[0]
     }) */  
     this.statusObj.currentCakeType = this.data.cakeInfo[0]

      //然后去请求
      var queryParam = {
        "cake_type": this.statusObj.currentCakeType
      }
      cloudUtils.queryTypeItem(queryParam, this.data.skipCount,this.data.limitCount ,res=>{
          this.setData({
              cakeItemInfo : res.data,
              skipCount : this.data.limitCount //变为下一次查询跳过数
          });
          this.showContent();
     })
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

  //scroll=view滚动到底部触发刷新
  scrollRefreshItem : function(){

    let queryParam = {
        "cake_type":this.statusObj.currentCakeType
    }

    //显示加载框
    wx.showLoading({
      title: '加载中...',
    })

    cloudUtils.queryTypeItem(queryParam, this.data.skipCount,this.data.limitCount ,res=>{

      //判断数据是否空
      if(!res.data || res.data.length == 0){
         wx.hideLoading()
         //没有数据则
         this.setData({
             showTopTip : true,
             topTipMsg : "没有更多内容了"
         })
         return;
      }
      //在原数据基础上增加
      this.setData({
          cakeItemInfo : [...this.data.cakeItemInfo, ...res.data], //合并数组
          skipCount: (this.data.skipCount+this.data.limitCount)
      });
      //隐藏
      wx.hideLoading()
   })
  },


   /**
    * 显示加载框
    */
   showLoading : function(text){
      if(!text){
         text = '加载中...'
      }
      wx.showLoading({
        title: text
      })
      //设置超时隐藏
      setTimeout(() => {
         wx.hideLoading();
      }, 10000);
   },

  //子组件调用,触摸切换种类
  tapItemType : function(event){
      let currentCakeType = this.statusObj.currentCakeType;
      //判断是否重复点击当前类型
      if(event.detail.name == currentCakeType){
         return;
      }
      
      this.showLoading('');

      //另一类蛋糕，最开始的条数
      this.setData({
        skipCount : 0, //变为下一次查询跳过数
        cakeItemInfo : []
      });

      //变更当前类型
      /* this.setData({
          currentCakeType : event.detail.name
      }) */
      this.statusObj.currentCakeType = event.detail.name;

      //查询
      let queryParam = {
          "cake_type": this.statusObj.currentCakeType
      }

      //初始预览10条
      cloudUtils.queryTypeItem(queryParam, this.data.skipCount, this.data.limitCount ,res=>{
         this.setData({
             cakeItemInfo : res.data,
             skipCount : this.data.limitCount //变为下一次查询跳过数
         });
         wx.hideLoading();
      })
  }
})