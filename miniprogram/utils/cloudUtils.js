const db = wx.cloud.database();
/**
 * 获取info
 * @param {*} param 参数
 * @callback 回调函数
 */
function getCakeInfo(callback){
      wx.cloud.callFunction({
          name:"dao-cakeInfo", //云函数模块名
          data:{},
    }).then(res => {
        if(typeof(callback) === 'function'){
          callback(res.result.result)
        }
    }).catch(console.error)
}

/**
 * 添加信息
 * @param {} param 
 * @param {} callback 
 */
function addCakeInfo(param, callback){
    //添加新增操作表示
    param.flag = "add";
    wx.cloud.callFunction({
        name:"dao-cakeInfo", //云函数模块名
        data:param,
        success:(res)=>{
          if(typeof(callback) === 'function'){
            callback(res.result.result)
          }
        }
  })
}

/**
 * 拿到banner表广告图路径
 */
function getBannerList(callback){
    db.collection('banner').get().then((res)=>{
        //console.log(res.data);
        if(typeof(callback) === 'function'){
           callback(res);
        }
    });
}

/**
 * 拿到种类列表
 */
function getCakeTypeList(callback){
  db.collection('cakeType').get().then((res)=>{

      if(typeof(callback) === 'function'){
         callback(res);
      }
  });
}


/**
 * 查询相应产品
 */
function queryTypeItem(param, skipCount, limit, callback){

  db.collection('shopInfo').where(param).skip(skipCount).limit(limit).get().then((res)=>{
      //console.log("query:"+JSON.stringify(res.data));
      if(typeof(callback) === 'function'){
         callback(res);
      }
  });
}

//对外开放访问
module.exports.addCakeInfo = addCakeInfo;
module.exports.getCakeInfo = getCakeInfo;
module.exports.getBannerList = getBannerList;

module.exports.getCakeTypeList = getCakeTypeList;
module.exports.queryTypeItem = queryTypeItem;