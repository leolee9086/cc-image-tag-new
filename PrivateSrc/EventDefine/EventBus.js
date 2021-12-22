const 事件总线 = new Vue();

localStorage.clear();
console.log(数据库);
console.log(url参数);
let 数据源id = url参数.baseid;
Vue.prototype.$数据源id = 数据源id;

Vue.prototype.$思源伺服ip = window.location.host;
Vue.prototype.$主界面 = window.parent.document || document;

const 事务列表 = {
  数据库: 数据库,
  self:self,
  解析剪贴板内容: async function (str) {
    let 锚文本 = await 获取思源块链接锚文本(this.思源伺服ip, this.apitokn, str);
    if (锚文本 != "解析错误") {
      let 空标签对象 = {
        def_block: str,
        anchor: "",
        top: window.pageYOffset + this.当前鼠标坐标.y,
        left: window.pageXOffset + this.当前鼠标坐标.x,
        width: 100,
        height: 100,
        backgroundColor: "yellow",
        borderColor: "red",
        showhandler: false,
        color: "balck",
        folded: false,
        id: Lute.NewNodeID(),
      };
      this.标记数组.push(空标签对象);
    } else {
      let 空标签对象 = {
        def_block: "",
        anchor: str,
        top: window.pageYOffset + this.当前鼠标坐标.y,
        left: window.pageXOffset + this.当前鼠标坐标.x,
        width: 100,
        height: 50,
        backgroundColor: "yellow",
        borderColor: "red",
        showhandler: false,
        color: "balck",
        folded: false,
        id: Lute.NewNodeID(),
      };
      this.标记数组.push(空标签对象);
    }
  },
  链接转化为卡片:async function(链接数据){
    try{this.$数据库.delete(链接数据.id)}catch(e){}
    let 新数据 = JSON.parse(JSON.stringify(链接数据))
    新数据.type="link"
    await this.$数据库.cards.put(新数据)
    let from_id = 新数据.attrs["from_id"]
    let to_id = 新数据.attrs["to_id"]
    this.$事件总线.$emit("连接卡片",[from_id,新数据])
    this.$事件总线.$emit("连接卡片",[新数据,to_id])

    
  },
  上传数据到思源: async function () {
    let that = this;
    let 文件数据 = {};
    let url参数 = this.$解析url(window.location.href);
    console.log(url参数);
    let 数据源id = url参数.baseid;
    await that.$数据库.cards.toArray((array) => (文件数据.cardarray = array));
    await that.$数据库.links.toArray((array) => (文件数据.links = array));

    console.log(文件数据);
    let 数据blob = new Blob([JSON.stringify(文件数据)], {
      type: "application/json",
    });
    let 文件 = new File([数据blob], `dataof${数据源id}.cccard`, {
      lastModified: Date.now(),
    });
    let data = new FormData();
    data.append("assetsDirPath", "/assets/");
    data.append("file[]", 文件);
    let url = "http://" + that.$思源伺服ip + "/api/asset/upload";
    let filepath = "";
    fetch(url, {
      body: data,
      method: "POST",
      headers: { Authorization: "Token " + that.apitoken },
    })
      .then(function (response) {
        console.log(response);
        return response.json();
      })
      .then(function (resData) {
        console.log(resData);
        let succMap = resData["data"]["succMap"];
        console.log(succMap);
        for (let item in succMap) {
          filepath = filepath + succMap[item];
          console.log(filepath);
          设置思源块属性(
            that.$思源伺服ip,
            that.apitoken,
            that.数据源id,
            "data-assets",
            filepath
          );
          try {
            that.挂件自身元素.setAttribute("data-assets", filepath);
          } catch (e) {}
        }
        //that.挂件自身元素.setAttribute('custom-data-assets',filepath)
      });
  },

  添加卡片: async function (卡片数据) {
    await this.$数据库.cards.put(卡片数据);
    await self.上传数据到思源;
  },

  保存卡片: async function (传入数据) {
    //console.log(传入数据)
    if (传入数据.styles) {
      let 原始数据 = await this.$数据库.cards.get(传入数据.id);
      for (属性名 in 传入数据.styles) {
        原始数据.attrs[属性名] = 传入数据.styles[属性名];
      }
      await this.$数据库.cards.put(原始数据);
      await self.上传数据到思源;
    } else if (传入数据.id) {
      await this.$数据库.cards.put(传入数据);
      await self.上传数据到思源;
    }
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

    if (传入数据.styles) {
      let 原始数据 = await this.$数据库.links.get(传入数据.id);
      for (属性名 in 传入数据.styles) {
        原始数据["attrs"][属性名] = 传入数据["styles"][属性名];
      }
      await this.$数据库.links.put(原始数据);
      await self.上传数据到思源;
    } else if (传入数据.id) {
      await this.$数据库.links.put(传入数据);
      await self.上传数据到思源;
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
  激活卡片: async function (id) {
    this.$当前窗口状态.current_linkid = ""

    this.$当前窗口状态.current_cardid = id;
    if (this.$当前窗口状态.等待连接卡片id) {
      this.$事件总线.$emit("连接卡片",[this.$当前窗口状态.等待连接卡片id,id])
      this.$当前窗口状态.等待连接卡片id = null;
    }
    await this.$数据库.states.put(this.$当前窗口状态);
  },
  激活链接:async function (id){
    this.$当前窗口状态.current_cardid = ""
    this.$当前窗口状态.current_linkid = id;
    await this.$数据库.states.put(this.$当前窗口状态);
  },
  连接卡片:async function(卡片数组){
    let 起始卡片 =  卡片数组[0]
    let 结束卡片 = 卡片数组[1]
    let 属性对象 = {
      from_id: 起始卡片.id||起始卡片,
      to_id: 结束卡片.id||结束卡片,
    };
    let 新链接 = this.$根据属性生成链接(属性对象);
    console.log(新链接)
    await this.$数据库.links.put(新链接);
  },
  开始连接: function (data) {
    console.log("开始链接");
    this.$当前窗口状态.等待连接卡片id = data.id;
  },
  显示提示: function (提示内容) {},
  窗口缩放: function (缩放倍数) {
    console.log(缩放倍数);
    this.$当前窗口状态.缩放倍数 = 缩放倍数;
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
  从思源块id读取数据:async function (id) {
    let that = this;
    let filepath = `assets/datao-${id}.cccard`;
    if (this.$挂件模式()) {
      filepath = this.挂件自身元素.getAttribute("data-assets");
    }
    let url = "http://" + that.思源伺服ip + "/" + filepath;
    console.log(url);
    await axios.get(url).then((res) => {
      文件数据 = res.data;
      if (文件数据["cardarray"]) {
        try {
          this.图片缩放倍数 = parseFloat(文件数据.resize).toFixed(2);
        } catch (e) {
          console.log(e);
        }
      }
    });
    let 卡片数组 = []
    let 链接数组 = []
    卡片数组 = 文件数据["cards"];
    链接数组 = 文件数据["links"];
    for (i in 卡片数组) {
      let card = this.标记数组[i];
      if (!card.id) {
        card.id = Lute.NewNodeID();
        console.log(card.id);
      }
      if (!card.markdown) {
        card.markdown = "## 此处输入内容";
      }
      card.attrs = card.attrs || {};
     
      if (card.attrs.def_block) {
        card.attrs.def_block = card.def_block.replace("((", "").replace("))", "");
      }
      await this.$数据库.cards.put(card);
    }

    for (i in 标记数组) {
      let link = this.links[i];
      if (!link.id || link.id.length < 5) {
        link.id = Lute.NewNodeID();
      }
      if (this.标记数组[link.from]) {
        link.from = this.标记数组[link.from]["id"];
      }
      if (this.标记数组[link.to]) {
        link.to = this.标记数组[link.to]["id"];
      }
      console.log(link);
      await this.$数据库.links.put(link);
    }
    console.log("加载完成");
  },
};

const 窗口状态对象 = {
  currentLinkid: "",
  editMode: "",
  currentCardid: "",
  lastviewcentter: "",
  等待连接卡片id: "",
};

for (let item in 事务列表) {
  if (item != "数据库") {
    事件总线.$on(item, 事务列表[item]);
  }
}
Vue.prototype.$当前窗口状态 = 窗口状态对象;
Vue.prototype.$事件总线 = 事件总线;
