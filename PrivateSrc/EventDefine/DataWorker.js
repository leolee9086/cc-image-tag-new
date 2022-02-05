const window = {
  crypto: self.crypto,
  TextEncoder: self.TextEncoder,
  TextDecoder: self.TextDecoder,
  WebSocket: self.WebSocket,
};
importScripts("/widgets/cc-baselib/static/dexie.min.js");
importScripts("/widgets/cc-baselib/static/moment-with-locales.js");
importScripts("/widgets/cc-image-tag-new/PrivateSrc/store/rxjs.umd.js");

const liveQuery = Dexie.liveQuery;

self.初始化数据库 = async function (id) {
  self.数据库 = new Dexie(id);
  self.数据库.version(3).stores({
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

  self.画板元数据库 = new Dexie("cc_whiteboardfiles");
  self.画板元数据库.version(5).stores({
    workspace: "id,name,handle",
    boards:
      "id,parent_id,root_id,hash,box,path,name,alias,memo,content,markdown,length,type,subtype,ial,sort,created,updated,attrs",
  });
  liveQuery(() => self.数据库.cards.toArray()).subscribe({
    next: (result) => {
      self.卡片数组 = result;
    },
  });
  liveQuery(() => self.数据库.links.toArray()).subscribe({
    next: (result) => {
      self.链接数组 = result;
    },
  });
  setTimeout(async () => self.发送数据(), 50);
  self.postMessage("数据库初始化完成");
};

self.发送数据 = async function () {
  let 卡片数组 = await self.数据库.cards.toArray();
  let 链接数组 = await self.数据库.links.toArray();
  let flag1 = false
  let flag2 = false
  if (卡片数组!==self.卡片数组){
  self.卡片数组 = 卡片数组 
  flag1 = true
  }
  if (链接数组!==self.链接数组){
    self.链接数组 = 链接数组 
    flag1 = true
  }
  if(flag1||flag2){
  self.postMessage({时间戳:生成毫秒时间戳() ,卡片数组: 卡片数组, 链接数组: 链接数组 });
  }
  setTimeout(async () => self.发送数据(), 50);
};
function 生成毫秒时间戳() {
  let str = moment().format("YYYYMMDDHHmmssSSSS");
  return str;
}
self.卡片数组 = [];
self.链接数组 = [];
self.消息处理器 = function (消息) {
  if (消息) {
    try {
      let 消息函数参数 = 消息.data["处理函数"];
      let 消息处理函数 = function () {
        return `${消息函数参数}出错`;
      };
      if (消息函数参数) {
        消息处理函数 = self[消息函数参数];
      }

      if (消息处理函数) {
        let 负载数据 = 消息["data"]["数据"];
        消息处理函数(负载数据);
      } else {
        self.postMessage(
          `${消息函数参数}出错,可能不存在此函数,传入消息为${JSON.stringify(
            消息.data
          )}`
        );
      }
    } catch (error) {
      self.postMessage({ error: error });
    }
  }
};
onerror = function (e) {
  self.postMessage(e);
};
self.onmessage = self.消息处理器;
