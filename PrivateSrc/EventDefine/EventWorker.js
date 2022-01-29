const window = {
  crypto: self.crypto,
  TextEncoder: self.TextEncoder,
  TextDecoder: self.TextDecoder,
  WebSocket: self.WebSocket,
}
importScripts("/widgets/cc-baselib/static/dexie.min.js")
const 初始化数据库 = function(id){ 
  const 数据库 = new Dexie(id);
  数据库.version(3).stores({
    cards:
      "id,parent_id,root_id,hash,box,path,name,alias,memo,content,markdown,length,type,subtype,ial,sort,created,updated,attrs",
    links:
      "id,parent_id,root_id,hash,box,path,name,alias,memo,content,markdown,length,type,subtype,ial,sort,created,updated,attrs",
    states: "++id,current_cardid,current_linkid,viewcenter",
    metadata: "key,value",
    history: "++id,data",
    cardpresets:
      "id,parent_id,root_id,hash,box,path,&name,alias,memo,content,markdown,length,type,subtype,ial,sort,created,updated,attrs",
    linkpresets:
      "id,parent_id,root_id,hash,box,path,&name,alias,memo,content,markdown,length,type,subtype,ial,sort,created,updated,attrs",
  });

  const 画板元数据库 = new Dexie("cc_whiteboardfiles");
  画板元数据库.version(5).stores({
    workspace: "id,name,handle",
    boards:
      "id,parent_id,root_id,hash,box,path,name,alias,memo,content,markdown,length,type,subtype,ial,sort,created,updated,attrs",
  });
}




const 获取数据=  function(数据请求对象){ 
  let 数据表名 = 数据请求对象["数据表名"]
  数据库[数据表名].get(
  数据请求对象["数据id"],function(目标数据){
    self.postMessage( {
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
const 保存数据 =async  function(数据){
  let 数据表名 =  数据.type +'s'
  await 数据库[数据表名].put(数据)
}
/*定义消息处理过程*/
const 消息处理器 = function(消息){
  if(消息){
    try {
      let 消息函数参数 = 消息.data["处理函数"]
      let 消息处理函数 =function(){return `${消息函数参数}出错`}
      if(消息函数参数){
       消息处理函数 =self[消息函数参数]
      }
      
      if(消息处理函数){
      let 负载数据 =  消息["data"]["数据"]
      消息处理函数(负载数据)
      }
      else{port.postMessage(`${消息函数参数}出错,可能不存在此函数,传入消息为${JSON.stringify(消息.data)}`)}
    }catch(error){
      self.postMessage({"error":error})
    }
  }
}



onerror = function(e){

      self.postMessage(e)
   
}

self.onmessage=self.消息处理器


  