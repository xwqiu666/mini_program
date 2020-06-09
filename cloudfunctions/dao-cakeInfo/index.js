// 云函数入口文件
const cloud = require('wx-server-sdk')

cloud.init()

const db = cloud.database();

// 云函数入口函数
exports.main = async (event, context) => {
  const wxContext = cloud.getWXContext()
  let result = "";
  let flag = event.flag;
  if(flag == "add"){
     //增加操作
     result = await db.collection('shopInfo').add({
         data : event.param,
     })
  }else{
     result = await db.collection('shopInfo').get();
  }

  return {
    result:result,
    event
  }
}