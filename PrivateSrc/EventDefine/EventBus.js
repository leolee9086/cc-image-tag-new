const 事件总线 = new Vue();
const 窗口状态对象 = {
  current_linkid: "",
  editMode: "",
  current_cardid: "",
  lastviewcentter: "",
  等待连接卡片id: "",
  缩放倍数:1,
  使用svg:false,
  showname:true,
  showsubtype:true
};

const 事务列表 = {
  数据库: 数据库,
  上传当前画板文件数据到思源:async function (){
    let that =this
    let JSON数据 = {};
    await that.$数据库.cards.toArray((array) => (JSON数据.cards = array));
    await that.$数据库.links.toArray((array) => (JSON数据.links = array));
    await that.$数据库.metadata.toArray((array) => (JSON数据.metadata = array));
    await that.$数据库.cardpresets.toArray((array) => (JSON数据.cardpresets = array));
    await that.$数据库.linkpresets.toArray((array) => (JSON数据.linkpresets = array));

    let 文件名 = `data-${this.$baseid}.cccards`;
    let 文件数据 = this.$从数据生成文件(JSON数据, "application/json", 文件名);
    let data = new FormData();
    data.append("assetsDirPath", "/assets/");
    data.append("file[]", 文件数据);
    let url = "http://" + window.location.host + "/api/asset/upload";
    let filepath = "";
    fetch(url, {
      body: data,
      method: "POST",
      headers: { Authorization: "Token " + this.apitoken },
    })
      .then(function (response) {
        return response.json();
      })
      .then(function (resData) {
        let succMap = resData["data"]["succMap"];
      //  console.log(succMap);
        for (let item in succMap) {
          filepath = filepath + succMap[item];
          设置思源块属性(
            window.location.host,
            this.apitoken,
            this.$baseid,
            "data-assets",
            filepath
          );
          设置思源块属性(
            window.location.host,
            that.apitoken,
            this.$baseid,
            "custom-data-assets",
            filepath
          );
          if(Vue.prototype.$挂件模式()){
            that.$挂件自身元素().setAttribute("data-assets", filepath);
            that.$挂件自身元素().setAttribute("custom-data-assets", filepath);
         }
        }
      });

  },
  
  链接转化为卡片:async function(链接数据){
   await this.$数据库.links.delete(链接数据.id)
    let 新数据 = JSON.parse(JSON.stringify(链接数据))
    新数据.type="card"
    新数据.subtype="一般概念"

    await this.$数据库.cards.put(新数据)
    let from_id = 新数据.attrs["from_id"]
    let to_id = 新数据.attrs["to_id"]
    this.$事件总线.$emit("连接卡片",[from_id,新数据.id])
    this.$事件总线.$emit("连接卡片",[新数据.id,to_id])
    
  },
 

  添加卡片: async function (卡片数据) {
    await this.$数据库.cards.put(卡片数据);
  },
  保存数据:async function (传入数据){
   传入数据.type=="card"? this.$事件总线.$emit("保存卡片"):this.$事件总线.$emit("保存链接")
  },
  保存卡片: async function (传入数据) {
    let 数据表名  = 传入数据.type+"s"
    //console.log(数据表名)
    if (传入数据.attrsproxy) {
      let 原始数据 = await this.$数据库[数据表名].get(传入数据.id);
      原始数据.subtype = 传入数据.subtype||"属于";

      for (属性名 in 传入数据.attrsproxy) {
        原始数据.attrs[属性名] = 传入数据.attrsproxy[属性名]
      }

      await this.$数据库[数据表名].put(原始数据);

    } else if (传入数据.id) {
      await this.$数据库[数据表名].put(传入数据);

    }

  },
  删除数据:async function (传入数据){
    传入数据.type=="card"?this.$事件总线.$emit("删除卡片",传入数据):
    this.$事件总线.$emit("删除链接",传入数据)
  },
  删除卡片: async function (卡片数据) {
    let id = 卡片数据.id || 卡片数据;
    await this.$数据库.cards.delete(id);
    await  this.$数据库.links.filter(
      data=>{if (data.attrs.from_id==id||data.attrs.to_id==id){return true}}
    ).delete()

  },
  删除链接: async function (链接数据) {
    let id = 链接数据.id || 链接数据;
    await this.$数据库.links.delete(id);

  },
  保存链接: async function (传入数据) {

    if (传入数据.attrsproxy) {
      let 原始数据 = await this.$数据库.links.get(传入数据.id);
      原始数据.subtype = 传入数据.subtype||"属于";

      for (属性名 in 传入数据.attrsproxy) {
        原始数据["attrs"][属性名] = 传入数据["attrsproxy"][属性名];
      }
      await this.$数据库.links.put(原始数据);
    } else if (传入数据.id) {
      await this.$数据库.links.put(传入数据);
    }  
  },
  定位至卡片: async function (卡片数据) {
    let id = 卡片数据.id || 卡片数据;
    let 目标卡片数据 = await this.$数据库.cards.get(id)||await this.$数据库.links.get(id);
    window.scrollTo(
          (目标卡片数据.attrs.left+ 目标卡片数据.attrs.width/2)*this.$当前窗口状态.缩放倍数- window.innerWidth / 2,
          (目标卡片数据.attrs.top+目标卡片数据.attrs.width/2)*this.$当前窗口状态.缩放倍数 - window.innerHeight / 2
        );
  },
  激活数据:  function(数据){
    let 数据类型 = 数据.type
   // console.log(数据类型)
    数据类型 == "card" ?this.$事件总线.$emit("激活卡片",数据):this.$事件总线.$emit("激活链接",数据)
  },
  激活卡片: async function (数据) {
    this.$当前窗口状态.current_linkid = ""
    this.$当前窗口状态.current_cardid = 数据.id;
    if (this.$当前窗口状态.等待连接卡片id) {
      this.$事件总线.$emit("连接卡片",[this.$当前窗口状态.等待连接卡片id,数据.id])
      this.$当前窗口状态.等待连接卡片id = null;
    }
    await this.$数据库.states.put(this.$当前窗口状态);
  },
  激活链接:async function (数据){
    this.$当前窗口状态.current_cardid = ""
    this.$当前窗口状态.current_linkid = 数据.id;
    if (this.$当前窗口状态.等待连接卡片id) {
      this.$事件总线.$emit("连接卡片",[this.$当前窗口状态.等待连接卡片id,数据.id])
      this.$当前窗口状态.等待连接卡片id = null;
    }
    await this.$数据库.states.put(this.$当前窗口状态);
  },
  连接卡片:async function(卡片数组){
    let 起始卡片id =  卡片数组[0]
    let 结束卡片id = 卡片数组[1]
    let 起始卡片 =await this.$数据库.cards.get(起始卡片id)||await this.$数据库.links.get(起始卡片id)
    let 结束卡片 =await this.$数据库.cards.get(结束卡片id)||await this.$数据库.links.get(结束卡片id)

    if (起始卡片id!=结束卡片id&&起始卡片&&结束卡片){
    let 属性对象 = {
      from_id: 起始卡片id||起始卡片,
      to_id: 结束卡片id||结束卡片,
    };
    let 新链接 = this.$根据属性生成链接(属性对象);
   // console.log(新链接)
    await this.$数据库.links.put(新链接);
    this.$事件总线.$emit("结束连接")}
  },
  开始连接: function (data) {
   // console.log("开始链接");
    this.$当前窗口状态.等待连接卡片id = data.id;
  },
  显示提示: function (提示内容) {},
  窗口缩放: function (缩放倍数) {
   // console.log(缩放倍数);
    this.$当前窗口状态.缩放倍数 = 缩放倍数;
  },
  点击画板空白处: function($event){
    console.log($event)
    if (!this.$当前窗口状态.等待连接卡片id){
    this.$当前窗口状态.current_cardid=""
    this.$当前窗口状态.current_linkid=""}
    else {
      let 卡片数据 = this.$根据属性生成卡片({
        top: (window.pageYOffset + $event.clientY) / this.$当前窗口状态.缩放倍数,
        left: (window.pageXOffset + $event.clientX) / this.$当前窗口状态.缩放倍数,
      });
      this.$事件总线.$emit("添加卡片", 卡片数据);
      this.$事件总线.$emit("结束连接");

    }

  },
  双击画板:function($event){
    if ($event.target.className != "cardscontainer layer") {
      return null;
    }
    let 卡片数据 = this.$根据属性生成卡片({
      top: (window.pageYOffset + $event.clientY) / this.$当前窗口状态.缩放倍数,
      left: (window.pageXOffset + $event.clientX) / this.$当前窗口状态.缩放倍数,
    });
    this.$事件总线.$emit("添加卡片",卡片数据)
  },
  修改画板元数据: function (属性对象, 画板id) {
    this.$数据库.metadata.put(属性对象);
    let key = 属性对象["key"];
    let value = 属性对象["value"];
    let 画板元数据 = {};
    画板元数据.id = this.$baseid;
    画板元数据[key] = value;

    this.$画板元数据库.boards.put(画板元数据);
  },

};



for (let item in 事务列表) {
  if (item != "数据库") {
    事件总线.$on(item, 事务列表[item]);
  }
}

Vue.prototype.$当前窗口状态 = 窗口状态对象;
Vue.prototype.$事件总线 = 事件总线;
Vue.prototype.$思源伺服ip = window.location.host;
Vue.prototype.$主界面 = window.parent.document
