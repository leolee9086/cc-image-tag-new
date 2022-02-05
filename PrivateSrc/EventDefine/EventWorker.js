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

self.初始化数据库 = function (id) {
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
  self.postMessage("数据库初始化完成");
};
self.保存历史 = async function () {
  let data = {};
  data.cards = await self.数据库.cards.toArray();
  data.links = await self.数据库.links.toArray();
  data.metadata = await self.数据库.metadata.toArray();
  data.states = await self.数据库.states.toArray();
  data.linkpresets = await self.数据库.linkpresets.toArray();
  data.cardpresets = await self.数据库.cardpresets.toArray();
  data.timestamp = 生成毫秒时间戳();
  await self.$数据库.history.put(data);
};

function 生成毫秒时间戳() {
  let str = moment().format("YYYYMMDDHHmmssSSSS");
  return str;
}

self.获取数据 = function (数据请求对象) {
  let 数据表名 = 数据请求对象["数据表名"];
  slef.数据库[数据表名].get(数据请求对象["数据id"], function (目标数据) {
    self.postMessage({
      类型: "单独下发数据",
      数据: {
        目标数据: 目标数据,
        数据名: 数据请求对象["本地数据名"],
        本地数据id: 数据请求对象["数据id"],
      },
    });
  });
};
self.保存数据 =async function (数据) {
  let 数据表名 = 数据.type + "s";
  await self.数据库[数据表名].put(数据);
};
self.删除数据 = function(传入数据){
  if(传入数据.attrs){
  传入数据.attrs.trashed = true;}
    if (!传入数据.type) {
      return null;
    }
    let 数据表名 = 传入数据.type + "s";
    let id = 传入数据.id;
    if (!传入数据.attrs) {
      传入数据.attrs = {};
      传入数据.attrs.trashed = true
    }
    self.数据库[数据表名].put(传入数据).then(() => {
      self.数据库[数据表名].delete(id).then(() => {
        self.数据库.links
          .filter((data) => {
            if (data && (data.attrs.from_id == id || data.attrs.to_id == id)) {
              return true;
            }
          })
          .toArray((array) => {
            array[0]
              ? array.forEach((data) => self.删除数据(data))
              : null;
          });
      });
    });
    if (传入数据.attrs.collection) {
       this.$数据库.cards
        .filter((data) => {
          return data.parent_id == 传入数据.id;
        })
        .toArray(
          array.forEach((data) => {
            data.parent_id = 传入数据.parent_id;
            self.保存数据(传入数据);
          })
        );
    }
}
/*定义消息处理过程*/
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
