// components/cakemenu/cakemenu.js
//云函数工具
const cloudUtils = require('../../utils/cloudUtils')

Component({
  /**
   * 组件的属性列表
   */
  properties: {
      lineHeight : {
         type : String,
         value : ""
      },
      cakeInfo : Array,
      showType : String //显示类型, title为标题, cakeInfo传字符串数组, info为详情,cakeInfo传对象
  },

  /**
   * 组件生命周期
   */
  lifetimes:{

    created : function(){

    },

    attached : function(){
       
    }
  },

  /**
   * 组件的初始数据
   */
  data: {
      current_idx : 0, //通过判断下标更改选中样式
      scrollHeight:"",
      imgLoadCount : 0 //图片加载的数量

  },

  /**
   * 组件的方法列表
   */
  methods: {

        /**
         * 点击种类
         */
        tapTypeTab : function(event){
             let dataset = event.currentTarget.dataset;
             let targetId = dataset.index;
             let targetName = dataset.name;
             this.setData({
                "current_idx": targetId
             });
             //传值给父组件
             var detail = {
                 "index":targetId,
                 "name":targetName
             }
             this.triggerEvent("tapItemType",detail)
        }
  }
})
