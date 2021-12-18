let url参数 = Vue.prototype.$解析url(window.location.href)

if(!Vue.prototype.$挂件模式()){
  Vue.prototype.$baseid= url参数.baseid
}
else{  
  Vue.prototype.$baseid= Vue.prototype.$挂件自身元素().getAttribute("data-node-id")
}
const 数据库 = new Dexie(Vue.prototype.$baseid);
数据库.version(4).stores({
  tags: 'id,parent_id,root_id,hash,path,attrs,markdown,content,type,index,created,updated,children,x,y', 
  links:'id,from_id,to_id,type,subtype,labels',
  states:"++id,editMode,currentCardId,currentLinkId,LastViewpotCenter",
  GraphConfig:"defalutCard,defaultNode,layout",
});

const dataworker = new SharedWorker("./PrivateSrc/store/ceshi.js");        
const 数据总线=dataworker.port

数据总线.onerror = function(e){
  console.log(e.data)
}
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
Vue.prototype.$根据属性生成标签=function(属性对象){
  let 空标签={
    id:Lute.NewNodeID(),
    parent_id:"",
    root_id:"",
    hash:"",
    path:"",
    attrs:"",
    markdown:"## 测试",
    content:"",
    type:"",
    index:"",
    created:"",
    updated:"",
    children:"",
    width:100,
    height:100,
    x:"",
    y:"",
    foled:true
  }
  for (属性名 in 属性对象){
    let 属性值 =  属性对象[属性名]
    空标签[属性名]= 属性值
  }
  return 空标签
}




