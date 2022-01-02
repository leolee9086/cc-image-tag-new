




let url参数 = Vue.prototype.$解析url(window.location.href)
/*挂件模式的判定在baselib的commonfunctionforsiyuan里*/
/*挂件自身元素的获取也在baselib的commonfunctionforsiyuan里*/

if(!Vue.prototype.$挂件模式()){
  Vue.prototype.$baseid= url参数.baseid||Lute.NewNodeID()
}
else{  
  Vue.prototype.$baseid= Vue.prototype.$挂件自身元素().getAttribute("data-node-id")
}
const 数据库 = new Dexie(Vue.prototype.$baseid);
数据库.version(2).stores({
  cards: 'id,parent_id,root_id,hash,box,path,name,alias,memo,content,markdown,length,type,subtype,ial,sort,created,updated,attrs', 
  links:'id,parent_id,root_id,hash,box,path,name,alias,memo,content,markdown,length,type,subtype,ial,sort,created,updated,attrs',
  states:"++id,current_cardid,current_linkid,viewcenter",
  metadata:"key,value",
  history:"++id,data",
  cardpresets:"id,&name,attrs",
  linkpresets:"id,&name,attrs",
});

const 画板元数据库 = new Dexie("cc_whiteboardfiles");
画板元数据库.version(4).stores({
  boards: 'id,parent_id,root_id,hash,box,path,name,alias,memo,content,markdown,length,type,subtype,ial,sort,created,updated,attrs', 
  
});
画板元数据库.open()
const 默认链接预设={
  attrs:{
  backgroundColor: "byref",
  borderColor: "byref",
  color: "byref",
  def_block: "byref",
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
id:"20211230113017-0vgkowg",
name:"属于"
}

const 默认卡片预设={
  attrs:{
  backgroundColor: "byref",
  borderColor: "byref",
  color: "byref",
  def_block: "byref",
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
id:"20211230111132-wbdnm23"	,
name:"一般概念"
} 

数据库.linkpresets.put(默认链接预设)
数据库.cardpresets.put(默认卡片预设)

Vue.prototype.$数据库 =  数据库
Vue.prototype.$画板元数据库 =  画板元数据库

Vue.prototype.$从数据库获取更新数据 =async function(表名,本地数据){
  let 数据库数据 =  await this.$数据库[表名].get(本地数据.id)
  let 数据库数据更新时间 =  数据库数据.updated
  let  本地数据更新时间 = 本地数据.updated
  let flag = 数据库数据更新时间&&本地数据更新时间&&parseInt(数据库数据更新时间)>parseInt(本地数据更新时间)
  if (flag) {
    return 数据库数据
  }
  else {return null}
}
Vue.prototype.$用Lute生成时间戳=function(){
  return Lute.NewNodeID().slice(0,14)
}
Vue.prototype.$更新数据时间戳=function(数据){
  数据.updated = this.$用Lute生成时间戳()
  return 数据
}
Vue.prototype.$生成ial=function(属性数组,卡片数据){
  if (卡片数据){ }
  else {
    let string =""
    for (i in 属性数组){
      string = string+`${属性名}="${属性值}"`
    }
    string =`{: }`
  }
}
Vue.prototype.$根据属性生成卡片=function(属性对象){
  let 空标签={
    id:Lute.NewNodeID(),
    parent_id:"",
    root_id:"",
    hash:"",
    box:Vue.prototype.$baseid,
    path:"",
    name:"未命名",
    alias:[],
    memo:"",
    content:"",
    markdown:"此处输入内容",
    length:"",
    type:"card",
    subtype:"一般概念",
    ial:{ },
    sort:"",
    created:Vue.prototype.$用Lute生成时间戳(),
    updated:Vue.prototype.$用Lute生成时间戳(),
    attrs:{
      top:100,
      left:100,
      width:100,
      height:100,
      folded:false,
      backgroundColor:"lightblue",
      color:"black",
      borderColor:"black",
    }
  }
  for (属性名 in 空标签){
    属性对象[属性名]?空标签[属性名]=属性对象[属性名]:null
  }
  for (属性名 in  属性对象){
    空标签[属性名]?null:空标签.attrs[属性名]=属性对象[属性名]
  }
  return 空标签
}
Vue.prototype.$根据属性生成链接=function(属性对象){
  let 空标签={
    id:Lute.NewNodeID(),
    parent_id:"",
    root_id:"",
    hash:"",
    box:Vue.prototype.$baseid,
    path:"",
    name:"未命名",
    alias:[],
    memo:"",
    content:"",
    markdown:"此处输入内容",
    length:"",
    type:"link",
    subtype:"属于",
    ial:{ },
    sort:"",
    created:Vue.prototype.$用Lute生成时间戳(),
    updated:Vue.prototype.$用Lute生成时间戳(),
    attrs:{
      offsetx:0,
      offsety:0,
      from_id:"",
      to_id:"",
      path_width:5,
      path_color:"",
      width:100,
      height:100,
      path_type:"simpleLine",
      folded:false,
      backgroundColor:"lightblue",
      color:"black",
      borderColor:"black",
      mid_anchor_rotate:true
    }
  }
  for (属性名 in 空标签){
    属性对象[属性名]?空标签[属性名]=属性对象[属性名]:null
  }
  for (属性名 in  属性对象){
    空标签[属性名]?null:空标签.attrs[属性名]=属性对象[属性名]
  }
  console.log(空标签)
  return 空标签
},
Vue.prototype.$从数据生成文件= function (数据, 文件类型, 文件名) {
  let 数据blob = new Blob([JSON.stringify(数据)], {
    type: 文件类型,
  });
  let 文件 = new File([数据blob], 文件名, { lastModified: Date.now() });
  return 文件;
}

Vue.prototype.$卡片预设属性默认值 = {
  "color":undefined,
  "borderColor":undefined,
  "backgroundColor":undefined,
  "def_block":"byref",

  "path_width":undefined,
  "path_type":undefined,
  "path_color":undefined,

  "from_anchor_size":undefined,
  "to_anchor_size":undefined,
  "mid_anchor_size":undefined,

  "from_anchor_image":undefined,
  "to_anchor_image":undefined,
  "mid_anchor_image":undefined,

  "from_anchor_rotate":undefined,
  "to_anchor_rotate":undefined,
  "mid_anchor_rotate":undefined,

  "from_anchor_rotate_offset":undefined,
  "to_anchor_rotate_offset":undefined,
  "mid_anchor_rotate_offset":undefined,
}


