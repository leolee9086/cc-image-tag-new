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
  console.log(数据)
  let 数据表名 = 数据.type + "s";
  数据.type == "link"?数据=await self.计算链接(数据):null
  console.log(数据表名)
  await self.数据库[数据表名].put(数据);
  self.搜索并计算链接(数据)
};
self.搜索并计算链接 = async function(数据){
  let 链接数组  = await self.数据库.links.filter(
    data=>{
      if (data.attrs.from_id==数据.id||data.attrs.to_id==数据.id){
        return true
      }
    }
  ).toArray()
  if(链接数组[0]){
    console.log(链接数组)
    for(let i=0;i <链接数组.length;i++){
      let 链接 = 链接数组[i]
      链接 =await self.计算链接(链接)||链接
      await self.保存数据(链接)
    }
  }
}

self.计算链接=async function(链接){
  let 起始标记=await self.数据库.cards.get(链接.attrs.from_id)||await self.数据库.links.get(链接.attrs.from_id)
  let 结束标记=await self.数据库.cards.get(链接.attrs.to_id)|| await self.数据库.links.get(链接.attrs.to_id)
  let 起始标记属性 = 起始标记["attrs"];
  let 结束标记属性 = 结束标记["attrs"];
  let 链接属性 = 链接["attrs"];
  let 路径 = "";
  if (起始标记属性.folded) {
    起始标记属性.width = 100;
    起始标记属性.height = 30;
  }
  if (结束标记属性.folded) {
    结束标记属性.width = 100;
    结束标记属性.height = 30;
  }
  switch (链接.attrs.path_type) {
    case "折线": {
      路径 = self.生成折线路径(起始标记属性, 结束标记属性, 链接属性);
      链接.attrs.path = 路径.d;
      链接.attrs.top = 路径.mid.y;
      链接.attrs.left = 路径.mid.x;
      break;
    }
    case "简单曲线": {
      路径 = self.两点生成三次贝塞尔曲线(起始标记属性, 结束标记属性, 链接属性);
      链接.attrs.path = 路径.d;
      链接.attrs.top = 路径.mid.y;
      链接.attrs.left = 路径.mid.x;

      break;
    }
    default: {
      路径 = self.生成直线路径(起始标记属性, 结束标记属性, 链接属性);
      链接.attrs.path = 路径.d;
      链接.attrs.top = 路径.mid.y;
      链接.attrs.left = 路径.mid.x;
      链接.attrs.mid = 路径.mid;
    }
  }
  return 链接
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





const 几何定义 = {
  矢量加(矢量1, 矢量2) {
    return { x: 矢量1.x + 矢量2.x, y: 矢量1.y + 矢量2.y };
  },
  矢量减: function (矢量1, 矢量2) {
    return { x: 矢量1.x - 矢量2.x, y: 矢量1.y - 矢量2.y };
  },
  矢量内积(矢量1, 矢量2) {
    return { x: 矢量1.x + 矢量2.x, y: 矢量2.y + 矢量2.y };
  },
  矢量除标量(矢量, 标量) {
    return { x: 矢量.x / 标量, y: 矢量.y / 标量 };
  },
  矢量(x, y) {
    return { x: x, y: y };
  },
  矢量乘标量(矢量, 标量) {
    return { x: 标量 * 矢量["x"], y: 标量 * 矢量["y"] };
  },
  矢量模(矢量) {
    let x = 矢量.x;
    let y = 矢量.y;
    return Math.sqrt(x * x + y * y);
  },
  单位矢量(矢量) {
    let x = 矢量.x;
    let y = 矢量.y;
    let 矢量模 = 矢量模(矢量);
    return { x: x / 矢量模, y: y / 矢量模 };
  },
  圆形内接正方形(圆形) {
    let 圆心 = 圆形.center;
    let 半径 = 圆形.radius;
  },
};


self.计算中心 = function (代理标记) {
  let 中心 = {};
  if (代理标记.offsetx + "" != "undefined" && 代理标记.offsetx + "" != "NAN") {
    中心 = {
      x: 代理标记.left + (1 / 2) * 代理标记.width + 代理标记.offsetx,
      y: 代理标记.top + (1 / 2) * 代理标记.height + 代理标记.offsety,
    };
  } else {
    中心 = {
      x: 代理标记.left + (1 / 2) * 代理标记.width,
      y: 代理标记.top + (1 / 2) * 代理标记.height,
    };
  }
  return 中心;
};

self.计算引线 = function (链接) {
  let 引线链接 = JSON.parse(JSON.stringify(链接));
  let 引线终点 = { x: 引线链接.attrs.left, y: 引线链接.attrs.top };
  let 引线矢量 = {
    x: (引线链接.attrs.offsetx + 引线链接.attrs.width / 2) * -1,
    y: (引线链接.attrs.offsety + 引线链接.attrs.height / 2) * -1,
  };
  let 真实矩形 = {
    left: 引线链接.attrs.left + 引线链接.attrs.offsetx,
    top: 引线链接.attrs.top + 引线链接.attrs.offsety,
    width: 引线链接.attrs.width,
    height: 引线链接.attrs.height,
  };
  if (链接.attrs.folded) {
    真实矩形.width = 100;
    真实矩形.height = 30;
  }
  let 引线起点 = self.矩形与矢量交点(真实矩形, 引线矢量);

  let 引线线段 = { 起点: 引线起点, 终点: 引线终点 };
  //   console.log(JSON.stringify(引线线段));
  引线路径 = self.生成引线路径(引线线段)
  链接.attrs.lead_path=引线路径.d||链接.attrs.lead_path
  return 链接
};

self.矩形与矢量交点 = function (矩形, 矢量) {
  let 矩形中心 = self.计算中心(矩形);
  //    console.log(矩形中心);
  let 交点 = { x: 0, y: 0 };

  x偏移 = Math.abs(((矩形.height / 2) * 矢量.x) / 矢量.y);
  y偏移 = Math.abs(((矩形.width / 2) * 矢量.y) / 矢量.x);
  if (Math.abs(y偏移) > Math.abs(矩形.height / 2)) {
    y偏移 = 矩形.height / 2;
    矩形.fixed_anchor ? (x偏移 = 0) : null;
  }

  if (Math.abs(x偏移) > Math.abs(矩形.width / 2)) {
    x偏移 = 矩形.width / 2;
    矩形.fixed_anchor ? (y偏移 = 0) : null;
  }
  //别问我为什么不用math.sign  反正不要用

  if (矢量.x > 0) {
    交点.x = 矩形中心.x + x偏移;
  } else {
    交点.x = 矩形中心.x - x偏移;
  }
  if (矢量.y > 0) {
    交点.y = 矩形中心.y + y偏移;
  } else {
    交点.y = 矩形中心.y - y偏移;
  }
  return 交点;
};
function 生成毫秒时间戳() {
  let str = moment().format("YYYYMMDDHHmmssSSSS");
  return str;
}
self.生成引线路径 = function (路径线段) {
  let 起始节点 = 路径线段.起点;
  let 结束节点 = 路径线段.终点;
  let 路径矢量 = 几何定义.矢量减(结束节点, 起始节点);
  let define = "";
  let midpoint = {};
  define = `
        M ${起始节点.x} ${起始节点.y}
        l ${路径矢量.x} ${路径矢量.y}
        `;
  midpoint = 几何定义.矢量加(起始节点, 几何定义.矢量除标量(路径矢量, 2));
  return { d: define, mid: midpoint };
};

self.生成链接路径 =async function (数据数组) {
  let 起始标记 = 数据数组[0];
  let 结束标记 = 数据数组[1];
  let 链接 = 数据数组[2];
  if(!链接){return null}
  console.log("数据数组",数据数组)
  !起始标记?起始标记=await self.数据库.cards.get(链接.attrs.from_id)||await self.数据库.links.get(链接.attrs.from_id):null
  !结束标记?结束标记=await self.数据库.cards.get(链接.attrs.to_id)|| await self.数据库.links.get(链接.attrs.to_id):null

  let 起始标记属性 = 起始标记["attrs"];
  let 结束标记属性 = 结束标记["attrs"];
  let 链接属性 = 链接["attrs"];
  let 路径 = "";
  let 中点 = "";
  if (起始标记属性.folded) {
    起始标记属性.width = 100;
    起始标记属性.height = 30;
  }
  if (结束标记属性.folded) {
    结束标记属性.width = 100;
    结束标记属性.height = 30;
  }
  switch (链接.attrs.path_type) {
    case "折线": {
      路径 = self.生成折线路径(起始标记属性, 结束标记属性, 链接属性);
      链接.attrs.path = 路径.d;
      链接.attrs.top = 路径.mid.y||0;
      链接.attrs.left = 路径.mid.x||0;
      中点 = 路径.mid;
      break;
    }

    case "简单曲线": {
      路径 = self.两点生成三次贝塞尔曲线(起始标记属性, 结束标记属性, 链接属性);
      链接.attrs.path = 路径.d;
      链接.attrs.top = 路径.mid.y||0;
      链接.attrs.left = 路径.mid.x||0;
      中点 = 路径.mid;

      break;
    }
    default: {
      路径 = self.生成直线路径(起始标记属性, 结束标记属性, 链接属性);
      链接.attrs.path = 路径.d;
      链接.attrs.top = 路径.mid.y||0;
      链接.attrs.left = 路径.mid.x||0;
      链接.attrs.mid = 路径.mid;
    }
  }
  链接= self.计算引线(链接)
  console.log(链接)

  if (链接 && 链接.attrs.top && 链接.attrs.left) {
    self.postMessage({
      数据id: 链接.id,
      数据名: "链接",
      数据值: 链接,
    });
  }
};
self.计算路径线段 = function (起始标记属性, 结束标记属性) {
  let 起始中心 = self.计算中心(起始标记属性);
  let 结束中心 = self.计算中心(结束标记属性);
  let 方向矢量 = 几何定义.矢量减(结束中心, 起始中心);
  if (方向矢量.x === 0) {
    方向矢量.x = 0.00000000001;
  }
  if (方向矢量.y === 0) {
    方向矢量.y = 0.00000000001;
  }
  let 反转方向矢量 = 几何定义.矢量乘标量(方向矢量, -1);
  方向矢量 = 几何定义.矢量乘标量(方向矢量, 1);
  let 起始节点 = self.矩形与矢量交点(起始标记属性, 方向矢量);
  let 结束节点 = self.矩形与矢量交点(结束标记属性, 反转方向矢量);
  let 路径线段 = { 起点: 起始节点, 终点: 结束节点 };
  return 路径线段;
};

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

self.生成折线路径=function(起始标记,结束标记,链接属性){
  let 路径线段 = self.计算路径线段(起始标记, 结束标记);
  let 起点坐标 = 路径线段.起点;
  let 终点坐标 = 路径线段.终点;
  let 起始节点偏移 = self.计算节点标志偏移(
    起始标记,
    起点坐标,
    终点坐标,
    链接属性,
    "from",
    10
  );
  let 结束节点偏移 = self.计算节点标志偏移(
    结束标记,
    终点坐标,
    起点坐标,
    链接属性,
    "to",
    10
  );
  let 起始节点 = 几何定义.矢量减(路径线段.起点, 起始节点偏移);
  let 结束节点 = 几何定义.矢量减(路径线段.终点, 结束节点偏移);
  let 路径矢量 = 几何定义.矢量减(结束节点, 起始节点);
  let define = "";
  let midpoint = {};
  if (路径矢量["x"] * 路径矢量["x"] - 路径矢量["y"] * 路径矢量["y"] >= 0) {
    define = `
                    M ${起始节点.x} ${起始节点.y}
                    l ${路径矢量["x"] / 2}  0
                    l 0  ${路径矢量["y"] / 2}
                    l 0  ${路径矢量["y"] / 2}
                    l ${路径矢量["x"] / 2}  0
                    `;
  } else {
    define = `
                    M ${起始节点.x} ${起始节点.y}
                    l 0  ${路径矢量["y"] / 2}
                    l ${路径矢量["x"] / 2}  0
                    l ${路径矢量["x"] / 2}  0
                    l 0  ${路径矢量["y"] / 2}
                    `;
  }
  mid = { x: 起始节点.x + 路径矢量.x / 2, y: 起始节点.y + 路径矢量.y / 2 };
  return { d: define, mid: mid };
}
self.生成贝塞尔曲线路径 = function(起始标记,结束标记,链接属性){
  
  let 路径线段 = self.计算路径线段(起始标记, 结束标记);
  let 起点坐标 = 路径线段.起点;
  let 终点坐标 = 路径线段.终点;
  let 起始节点偏移 = self.计算节点标志偏移(
    起始标记,
    起点坐标,
    终点坐标,
    链接属性,
    "from",
    10
  );
  let 结束节点偏移 = self.计算节点标志偏移(
    结束标记,
    终点坐标,
    起点坐标,
    链接属性,
    "to",
    10
  );
  let 起始节点 = 几何定义.矢量减(路径线段.起点, 起始节点偏移);
  let 结束节点 = 几何定义.矢量减(路径线段.终点, 结束节点偏移);
  let 路径矢量 = 几何定义.矢量减(结束节点, 起始节点);
  let define = "";
  let midpoint = {};
  midpoint = 几何定义.矢量加(起始节点, 几何定义.矢量除标量(路径矢量, 2));
      define = `
            M ${起始节点.x} ${起始节点.y}
            l ${-起始节点偏移.x * 2} ${-起始节点偏移.y * 2}
            C ${起始节点.x - 起始节点偏移.x * 20} ${
        起始节点.y - 起始节点偏移.y * 20
      } ${结束节点.x - 结束节点偏移.x * 20} ${
        结束节点.y - 结束节点偏移.y * 20
      } ${结束节点.x - 结束节点偏移.x * 2} ${结束节点.y - 结束节点偏移.y * 2}

            L ${结束节点.x} ${结束节点.y}
            `;
      return { d: define, mid: midpoint };
}

self.生成直线路径 = function (起始标记, 结束标记, 链接属性) {
  let 路径线段 = self.计算路径线段(起始标记, 结束标记);
  console.log(路径线段);
  let 起点坐标 = 路径线段.起点;
  let 终点坐标 = 路径线段.终点;
  let 起始节点偏移 = self.计算节点标志偏移(
    起始标记,
    起点坐标,
    终点坐标,
    链接属性,
    "from",
    10
  );
  let 结束节点偏移 = self.计算节点标志偏移(
    结束标记,
    终点坐标,
    起点坐标,
    链接属性,
    "to",
    10
  );
  console.log("计算偏移",起始节点偏移,结束节点偏移);
  let 起始节点 = 几何定义.矢量减(路径线段.起点, 起始节点偏移);
  let 结束节点 = 几何定义.矢量减(路径线段.终点, 结束节点偏移);
  let 路径矢量 = 几何定义.矢量减(结束节点, 起始节点);
  let define = "";
  let midpoint = {};
  define = `
        M ${起始节点.x} ${起始节点.y}
        l ${路径矢量.x} ${路径矢量.y}
        `;
        console.log(define);

  midpoint = 几何定义.矢量加(起始节点, 几何定义.矢量除标量(路径矢量, 2));
  console.log(midpoint);

  return { d: define, mid: midpoint };
};

self.计算节点标志偏移 = function (
  起始标记,
  起点坐标,
  终点坐标,
  链接属性,
  方向,
  计算容差
) {
  console.log("计算偏移",起始标记,起点坐标,终点坐标,链接属性,方向,计算容差)
  let 矩形 = 起始标记;
  方向 === "from"
    ? (标记大小 = 链接属性.from_anchor_size||30)
    : (标记大小 = 链接属性.to_anchor_size||30);
  方向 === "from"
    ? (是否自动旋转 = 链接属性.from_anchor_rotate||false)
    : (是否自动旋转 = 链接属性.to_anchor_rotate||false);
  console.log(标记大小,是否自动旋转)
  let obj = {};
  let 角度 = 0;
  if (起点坐标.y <= 矩形.top + 计算容差) {
    角度 = 0;
    obj.x = 0;
    obj.y = 标记大小 / 2;
  }

  if (起点坐标.x >= 矩形.left + 矩形.width - 计算容差) {
    角度 = 90;
    obj.x = 0 - 标记大小 / 2;
    obj.y = 0;
  }
  if (起点坐标.x <= 矩形.left + 计算容差) {
    角度 = 270;
    obj.x = 标记大小 / 2;
    obj.y = 0;
  }

  if (起点坐标.y >= 矩形.top + 矩形.height - 计算容差) {
    obj.x = 0;
    obj.y = 0 - 标记大小 / 2;
    角度 = 180;
  }
  console.log("计算结果",obj);
  obj.rotation = 角度;
  if (是否自动旋转) {
    let 方向矢量 = { x: 终点坐标.x - 起点坐标.x, y: 终点坐标.y - 起点坐标.y };
    let 单位方向矢量 = 几何定义.单位矢量(方向矢量);
    角度 = self.计算角度(单位方向矢量);
    obj.rotation = 角度 - 90;
  }
  return obj;
};
self.计算角度 = function (角度向量) {
  let 象限 = self.象限判断(角度向量);
  let 角度 = (360 * Math.atan(角度向量.y / 角度向量.x)) / (2 * Math.PI);
  switch (象限) {
    case "第一象限":
      角度向量.x = 角度向量.x;
      角度向量.y = 角度向量.y;
      break;
    case "第二象限":
      角度向量.x = -角度向量.x;
      角度向量.y = -角度向量.y;
      break;
    case "第三象限":
      角度向量.x = -角度向量.x;
      角度向量.y = -角度向量.y;
      break;
    case "第四象限":
      角度向量.x = 角度向量.x;
      角度向量.y = 角度向量.y;
      break;
  }
  switch (象限) {
    case "第一象限":
      角度 = 180 + 角度;
      break;
    case "第四象限":
      角度 = 180 + 角度;
      break;
    case "第三象限":
      角度 = 360 + 角度;
      break;
  }

  return 角度;
};
self.象限判断 = function (位移向量) {
  let x = 位移向量["x"];
  let y = 位移向量["y"];
  let 象限 = "第一象限";
  if (x > 0 && y > 0) {
    象限 = "第四象限";
  }
  if (x > 0 && y < 0) {
    象限 = "第一象限";
  }
  if (x < 0 && y < 0) {
    象限 = "第二象限";
  }
  if (x < 0 && y > 0) {
    象限 = "第三象限";
  }
  return 象限;
};
