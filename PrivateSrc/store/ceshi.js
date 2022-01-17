const window = {
  crypto: self.crypto,
  TextEncoder: self.TextEncoder,
  TextDecoder: self.TextDecoder,
  WebSocket: self.WebSocket,
}
importScripts("/widgets/cc-baselib/static/dexie.min.js")
const 数据库 = new Dexie('datas');
数据库.version(3).stores({
  cards: 'id,parent_id,root_id,hash,box,path,name,alias,memo,content,markdown,length,type,subtype,ial,sort,created,updated,attrs', 
  links:'id,parent_id,root_id,hash,box,path,name,alias,memo,content,markdown,length,type,subtype,ial,sort,created,updated,attrs',
  states:"++id,current_cardid,current_linkid,viewcenter",
  metadata:"key,value",
  history:"++id,data",
  cardpresets:"id,parent_id,root_id,hash,box,path,&name,alias,memo,content,markdown,length,type,subtype,ial,sort,created,updated,attrs",
  linkpresets:"id,parent_id,root_id,hash,box,path,&name,alias,memo,content,markdown,length,type,subtype,ial,sort,created,updated,attrs",
});



测试函数=function(消息){
  return 消息["data"]["数据"]
}
变更卡片数据=function(数据){
  数据库.cards.put(数据)
  setTimeout(广播消息({"类型":"变更卡片数据","id":数据.id,"数据":数据}),10)
  return `卡片数据${数据.id}变更为${JSON.stringify(数据)}`
}

获取数据=  function(数据请求对象,port){ 
  
  
  let 数据表名 = 数据请求对象["数据表名"]
  数据库[数据表名].get(
  数据请求对象["数据id"],function(目标数据){
    port.postMessage( {
        "类型":"单独下发数据",
        "数据":{
          "目标数据":目标数据,
          "数据名":数据请求对象["本地数据名"],
          "本地数据id":数据请求对象["数据id"]
        }
      })
    }
  )
}

/*定义消息处理过程*/
var portList = [];
消息处理器 = function(port,消息){
  if(消息){
    try {
      let 消息函数参数 = 消息.data["处理函数"]
      let 消息处理函数 =function(){return `${消息函数参数}出错`}
      if(消息函数参数){
       消息处理函数 =self[消息函数参数]
      }
      
      if(消息处理函数){
      let 负载数据 =  消息["data"]["数据"]
      消息处理函数(负载数据,port)
      }
      else{port.postMessage(`${消息函数参数}出错,可能不存在此函数,传入消息为${JSON.stringify(消息.data)}`)}
    }catch(error){
      port.postMessage({"error":error})
    }
  }
}
广播消息 = function(e){
  portList.forEach(
    port=>{
      port.postMessage(e)
    }
  )
}, 
onconnect = function(e) {
  var port = e.ports[0];
  portList.push(port)
  portList.forEach(
      port=>{
        port.postMessage("页面连接")
        port.onmessage=(e)=>self.消息处理器(port,e) 
      }
    )
}

onerror = function(e){
  portList.forEach(
    port=>{
      port.postMessage(e)
    }
  )
}




  