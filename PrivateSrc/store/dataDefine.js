let url参数 = Vue.prototype.$解析url(window.location.href);
/*挂件模式的判定在baselib的commonfunctionforsiyuan里*/
/*挂件自身元素的获取也在baselib的commonfunctionforsiyuan里*/

if (!Vue.prototype.$挂件模式()) {
  Vue.prototype.$baseid = url参数.baseid || Lute.NewNodeID();
} else {
  Vue.prototype.$baseid = Vue.prototype
    .$挂件自身元素()
    .getAttribute("data-node-id");
}
const 数据库 = new Dexie(Vue.prototype.$baseid);
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
画板元数据库.open();
const 默认链接预设 = {
  attrs: {
    backgroundColor: "byref",
    borderColor: "byref",
    color: "byref",
    def_block: "byref",
    borderWidth: "byref",
    fixed_anchor: "byref",
    borderStyle: "byref",
    from_anchor_image: "byref",
    from_anchor_rotate: "byref",
    from_anchor_rotate_offset: "byref",
    from_anchor_size: "byref",
    mid_anchor_image: "byref",
    mid_anchor_rotate: "byref",
    mid_anchor_rotate_offset: "byref",
    mid_anchor_size: "byref",
    path_color: "byref",
    path_type: "byref",
    path_width: "byref",
    to_anchor_image: "byref",
    to_anchor_rotate: "byref",
    to_anchor_rotate_offset: "byref",
    to_anchor_size: "byref",
  },
  id: "20211230113017-0vgkowg",
  name: "属于",
};

const 默认卡片预设 = {
  attrs: {
    backgroundColor: "byref",
    borderColor: "byref",
    color: "byref",
    def_block: "byref",
    borderWidth: "byref",
    fixed_anchor: "byref",
    borderStyle: "byref",
    from_anchor_image: "byref",
    from_anchor_rotate: "byref",
    from_anchor_rotate_offset: "byref",
    from_anchor_size: "byref",
    mid_anchor_image: "byref",
    mid_anchor_rotate: "byref",
    mid_anchor_rotate_offset: "byref",
    mid_anchor_size: "byref",
    path_color: "byref",
    path_type: "byref",
    path_width: "byref",
    to_anchor_image: "byref",
    to_anchor_rotate: "byref",
    to_anchor_rotate_offset: "byref",
    to_anchor_size: "byref",
  },
  id: "20211230111132-wbdnm23",
  name: "一般概念",
};

数据库.linkpresets.put(默认链接预设);
数据库.cardpresets.put(默认卡片预设);

Vue.prototype.$数据库 = 数据库;
Vue.prototype.$画板元数据库 = 画板元数据库;

Vue.prototype.$从数据库获取更新数据 = async function (表名, 本地数据) {
  let 数据库数据 = await this.$数据库[表名].get(本地数据.id);
  let 数据库数据更新时间 = 数据库数据.updated;
  let 本地数据更新时间 = 本地数据.updated;
  let flag =
    数据库数据更新时间 &&
    本地数据更新时间 &&
    parseInt(数据库数据更新时间) > parseInt(本地数据更新时间);
  if (flag) {
    return 数据库数据;
  } else {
    return null;
  }
};
Vue.prototype.$用Lute生成时间戳 = function () {
  return Lute.NewNodeID().slice(0, 14);
};
Vue.prototype.$生成毫秒时间戳 = function () {
  let str = moment().format("YYYYMMDDHHmmssSSSS");
  return str;
};
Vue.prototype.$更新数据时间戳 = function (数据) {
  数据.updated = this.$生成毫秒时间戳();
  return 数据;
};
Vue.prototype.$生成ial = function (属性数组, 卡片数据) {
  if (卡片数据) {
  } else {
    let string = "";
    for (i in 属性数组) {
      string = string + `${属性名}="${属性值}"`;
    }
    string = `{: }`;
  }
};
Vue.prototype.$根据属性生成卡片 = function (属性对象) {
  let 空标签 = {
    id: Lute.NewNodeID(),
    parent_id: "",
    root_id: "",
    hash: "",
    box: Vue.prototype.$baseid,
    path: "",
    name: "未命名",
    alias: [],
    memo: "",
    content: "",
    markdown: "此处输入内容",
    length: "",
    type: "card",
    subtype: "一般概念",
    ial: {},
    sort: "",
    created: Vue.prototype.$用Lute生成时间戳(),
    updated: Vue.prototype.$用Lute生成时间戳(),
    attrs: {
      top: 100,
      left: 100,
      width: 200,
      height: 100,
      folded: false,
      backgroundColor: "lightblue",
      color: "black",
      borderColor: "black",
      borderWidth: 1,
      fixed_anchor: false,
    },
  };
  for (属性名 in 空标签) {
    属性对象[属性名] ? (空标签[属性名] = 属性对象[属性名]) : null;
  }
  for (属性名 in 属性对象) {
    空标签[属性名] ? null : (空标签.attrs[属性名] = 属性对象[属性名]);
  }
  return 空标签;
};
(Vue.prototype.$根据属性生成链接 = function (属性对象) {
  let 空标签 = {
    id: Lute.NewNodeID(),
    parent_id: "",
    root_id: "",
    hash: "",
    box: Vue.prototype.$baseid,
    path: "",
    name: "未命名",
    alias: [],
    memo: "",
    content: "",
    markdown: "此处输入内容",
    length: "",
    type: "link",
    subtype: "属于",
    ial: {},
    sort: "",
    created: Vue.prototype.$用Lute生成时间戳(),
    updated: Vue.prototype.$用Lute生成时间戳(),
    attrs: {
      offsetx: 0,
      offsety: 0,
      from_id: "",
      to_id: "",
      path_width: 5,
      path_color: "",
      width: 200,
      height: 100,
      path_type: "simpleLine",
      folded: true,
      backgroundColor: "lightblue",
      color: "black",
      borderColor: "black",
      mid_anchor_rotate: true,
      borderWidth: 1,
      fixed_anchor: false,
    },
  };
  for (属性名 in 空标签) {
    属性对象[属性名] ? (空标签[属性名] = 属性对象[属性名]) : null;
  }
  for (属性名 in 属性对象) {
    空标签[属性名] ? null : (空标签.attrs[属性名] = 属性对象[属性名]);
  }
  return 空标签;
}),
  (Vue.prototype.$从数据生成文件 = function (数据, 文件类型, 文件名) {
    let 数据blob = new Blob([JSON.stringify(数据)], {
      type: 文件类型,
    });
    let 文件 = new File([数据blob], 文件名, { lastModified: Date.now() });
    return 文件;
  });
Vue.prototype.$预设属性默认值列表 = {
  color:{
    name: "color",
    label: "文字颜色",
    cardDefault: "black",
    linkDefault: "black",
  },
  borderColor:{
    name: "borderColor",
    label: "边框颜色",
    cardDefault: "black",
    linkDefault: "black",
  },
  backgroundColor:{
    name: "backgroundColor",
    label: "背景色",
    cardDefault: "lightblue",
    linkDefault: "lightblue",
  },
  def_block:{ 
    name: "def_block", 
    label: "思源块id", 
    cardDefault: "", 
    linkDefault: "" 
  },
  borderWidth:{ 
    name: "borderWidth", 
    label: "边框宽度", 
    cardDefault: 1, 
    linkDefault: 1 
  },
  fixed_anchor:{
    name: "fixed_anchor",
    label: "锚点定位于中点",
    cardDefault: false,
    linkDefault: false,
  },
  borderStyle:{
    name: "borderStyle",
    label: "边框线型",
    cardDefault: "solid",
    linkDefault: "solid",
  },
  path_width:{
    name: "path_width",
    label: "连接线宽度",
    cardDefault: 5 / 0.382,
    linkDefault: 5 / 0.382,
  },
  borderStyle:{
    name: "borderStyle",
    label: "边框线型",
    cardDefault: "solid",
    linkDefault: "solid",
  },
  path_type:{
    name: "path_type",
    label: "连接线线型",
    cardDefault: "直线",
    linkDefault: "直线",
  },
  path_color:{
    name: "path_color",
    label: "连接线颜色",
    cardDefault: "black",
    linkDefault: "black",
  },

  from_anchor_size:{
    name: "from_anchor_size",
    label: "起点标记大小",
    cardDefault: 30,
    linkDefault: 30,
  },
  to_anchor_size:{
    name: "to_anchor_size",
    label: "终点标记大小",
    cardDefault: 30,
    linkDefault: 30,
  },
  mid_anchor_size:{
    name: "mid_anchor_size",
    label: "中间标记大小",
    cardDefault: 30,
    linkDefault: 30,
  },

  from_anchor_image:{
    name: "from_anchor_image",
    label: "起点标记图片路径",
    cardDefault: "./PrivateSrc/icon/arrow1.png",
    linkDefault: "./PrivateSrc/icon/arrow1.png",
  },
  to_anchor_image:{
    name: "to_anchor_image",
    label: "终点标记图片路径",
    cardDefault: "./PrivateSrc/icon/arrow1.png",
    linkDefault: "./PrivateSrc/icon/arrow1.png",
  },
  mid_anchor_image:{
    name: "mid_anchor_image",
    label: "中间标记图片路径",
    cardDefault: "./PrivateSrc/icon/arrow1.png",
    linkDefault: "./PrivateSrc/icon/arrow1.png",
  },

  from_anchor_rotate:{
    name: "from_anchor_rotate",
    label: "起点标记自动旋转",
    cardDefault: false,
    linkDefault: false,
  },
  to_anchor_rotate:{
    name: "to_anchor_rotate",
    label: "终点标记自动旋转",
    cardDefault: false,
    linkDefault: false,
  },
  mid_anchor_rotate:{
    name: "mid_anchor_rotate",
    label: "中间标记图片路径",
    cardDefault: false,
    linkDefault: false,
  },

  from_anchor_rotate_offset:{
    name: "from_anchor_rotate_offset",
    label: "起点标记角度偏移",
    cardDefault: 0,
    linkDefault: 0,
  },
  to_anchor_rotate_offset:{
    name: "to_anchor_rotate_offset",
    label: "终点标记角度偏移",
    cardDefault: 180,
    linkDefault: 180,
  },
  mid_anchor_rotate_offset:{
    name: "mid_anchor_rotate_offset",
    label: "中间标记角度偏移",
    cardDefault: 0,
    linkDefault: 0,
  },
};
Vue.prototype.$卡片预设属性默认值 = {
  color: undefined,
  borderColor: undefined,
  backgroundColor: undefined,
  def_block: "byref",
  borderWidth: undefined,
  fixed_anchor: undefined,
  borderStyle: undefined,

  path_width: undefined,
  path_type: undefined,
  path_color: undefined,

  from_anchor_size: undefined,
  to_anchor_size: undefined,
  mid_anchor_size: undefined,

  from_anchor_image: undefined,
  to_anchor_image: undefined,
  mid_anchor_image: undefined,

  from_anchor_rotate: undefined,
  to_anchor_rotate: undefined,
  mid_anchor_rotate: undefined,

  from_anchor_rotate_offset: undefined,
  to_anchor_rotate_offset: undefined,
  mid_anchor_rotate_offset: undefined,
};
Vue.prototype.$卡片属性默认值 = {
  color: "black",
  borderColor: "black",
  backgroundColor: "lightblue",
  def_block: "",
  borderWidth: 1,
  fixed_anchor: false,
  borderStyle: "solid",

  path_width: 5 / 0.382,
  path_type: "直线",
  path_color: "black",

  from_anchor_size: 30,
  to_anchor_size: 30,
  mid_anchor_size: 30,

  from_anchor_image: "./PrivateSrc/icon/arrow1.png",
  to_anchor_image: "./PrivateSrc/icon/arrow1.png",
  mid_anchor_image: "./PrivateSrc/icon/arrow1.png",

  from_anchor_rotate: false,
  to_anchor_rotate: false,
  mid_anchor_rotate: false,

  from_anchor_rotate_offset: 0,
  to_anchor_rotate_offset: 180,
  mid_anchor_rotate_offset: 0,
};

Vue.prototype.$填充默认值 = function (数据) {
  if (数据 && 数据.attrs) {
    for (属性名 in this.$卡片属性默认值) {
      if (数据["attrs"][属性名] === undefined) {
        数据["attrs"][属性名] = this.$卡片属性默认值[属性名];
      }
    }
  }
  return 数据;
};
Vue.prototype.$获取预设表 = async function (预设表名) {
  return await this.$数据库[预设表名].toArray();
};

Vue.prototype.$获取预设 = async function (预设表名, 预设名) {
  let 预设数组 = await this.$数据库[预设表名]
    .filter((data) => {
      if (data.name == this.预设名) {
        return true;
      }
    })
    .toArray();
  return 预设数组[0] || null;
};

const 窗口状态对象 = {
  current_linkid: "",
  current_cardid: "",
  current_card: "",
  current_link: "",
  editMode: "",
  lastviewcentter: "",
  等待连接卡片id: "",
  缩放倍数: 1,
  使用svg: false,
  showname: true,
  showsubtype: true,
  current_cardid_array: [],
  current_cardpreset_name: "",
  current_linkpreset_name: "",
  show_tag_by_default: true,
};
Vue.prototype.$当前窗口状态 = 窗口状态对象;

Vue.prototype.$清空画板 = async function () {
  await this.$数据库.cards.clear();
  await this.$数据库.links.clear();
  await this.$数据库.metadata.clear();
  await this.$数据库.cardpresets.clear();
  await this.$数据库.linkpresets.clear();
};
Vue.prototype.$保存历史 = async function () {
  let data = {};
  data.cards = await this.$数据库.cards.toArray();
  data.links = await this.$数据库.links.toArray();
  data.metadata = await this.$数据库.metadata.toArray();
  data.states = await this.$数据库.states.toArray();
  data.linkpresets = await this.$数据库.linkpresets.toArray();
  data.cardpresets = await this.$数据库.cardpresets.toArray();
  data.timestamp = this.$用Lute生成时间戳();
  let 文件历史列表 = await this.$数据库.history.toArray();
  await this.$数据库.history.put(data);
};
Vue.prototype.$增量导入JSON数据 = async function (JSON数据) {
  let cards = JSON数据.cards;
  let links = JSON数据.links;
  let metadata = JSON数据.metadata;
  let cardpresets = JSON数据.cardpresets;
  let linkpresets = JSON数据.linkpresets;

  try {
    for (i in cards) {
      await this.$数据库.cards.add(cards[i]);
    }
    for (i in links) {
      await this.$数据库.links.add(links[i]);
    }
    for (i in metadata) {
      await this.$数据库.metadata.add(metadata[i]);
    }
    for (i in linkpresets) {
      await this.$数据库.linkpresets.add(linkpresets[i]);
    }
    for (i in cardpresets) {
      await this.$数据库.cardpresets.add(cardpresets[i]);
    }
  } catch (e) {
    alert("导入出错", e);
  }
};
Vue.prototype.$根据时间戳更新本地数据 = function (传入数据, 本地数据) {
  if (!传入数据) {
    return 本地数据;
  } else if (传入数据.id != 本地数据.id) {
    return 本地数据;
  } else if (!传入数据.attrs) {
    return 本地数据;
  } else if (parseInt(传入数据.updated) <= parseInt(本地数据.updated)) {
    return 本地数据;
  } else {
    return 传入数据;
  }
};
Vue.prototype.$保存markdown卡片数据 = async function (卡片数据, 工作空间句柄) {
  let markdown数据 = await this.$生成卡片markdown(卡片数据);
  let 文件名 = 卡片数据.id + "-" + 卡片数据.name + ".md";
  let 卡片文件句柄 = await 工作空间句柄.getFileHandle(文件名, { create: true });
  let 写入管线 = await 卡片文件句柄.createWritable();
  try {
    await 写入管线.seek(0);
    await 写入管线.truncate(0);
    await 写入管线.write(markdown数据);
    await 写入管线.close();
  } catch (e) {}
};
Vue.prototype.$生成卡片markdown = function (卡片数据) {
  let markdown = 卡片数据.markdown;
  let yaml = this.$生成卡片yaml(卡片数据);
  return yaml +"\n"+ markdown;
};
Vue.prototype.$生成卡片yaml = function (对象数据) {
  let yaml = `---
id:"${对象数据.id}"
parent_id:"${对象数据.parent_id}"
root_id:"${对象数据.root_id}"
hash:"${对象数据.hash}"
box:"${对象数据.box}"
path:"${对象数据.path}"
name:"${对象数据.name}"
alias:"${对象数据.alias}"
memo:"${对象数据.memo}"
content:"${对象数据.content}"
length:"${对象数据.length}"
type:"${对象数据.type}"
subtype:"${对象数据.subtype}"
ial:"${对象数据.ial}"
sort:"${对象数据.sort}"
created:"${对象数据.created}"
updated:"${对象数据.updated}"
attrs:'${JSON.stringify(对象数据.attrs)}'
---
        `;
  return yaml;
};
