//const 数据获取器 = new Worker("./PrivateSrc/EventDefine/DataWorker.js");
const 事件总线 = new Vue();
let 数据共享总线 = new BroadcastChannel("数据共享总线");


数据共享总线.addEventListener("message",function(massage){
  if(massage.data.对象数据){
      事件总线.$emit("接收数据",massage.data.对象数据)
    }
}
)
const 事务列表 = {
  数据库: 数据库,
  上传当前画板文件数据到思源: async function () {
    let that = this;
    let JSON数据 = {};
    if(this.$baseid==="20131111000000-lpanybz"){return null}
    await that.$数据库.cards.toArray((array) => (JSON数据.cards = array));
    await that.$数据库.links.toArray((array) => (JSON数据.links = array));
    await that.$数据库.metadata.toArray((array) => (JSON数据.metadata = array));
    await that.$数据库.cardpresets.toArray(
      (array) => (JSON数据.cardpresets = array)
    );
    await that.$数据库.linkpresets.toArray(
      (array) => (JSON数据.linkpresets = array)
    );

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
        //  //console.log(succMap);
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
          if (Vue.prototype.$挂件模式()) {
            that.$挂件自身元素().setAttribute("data-assets", filepath);
            that.$挂件自身元素().setAttribute("custom-data-assets", filepath);
          }
        }
      });
  },
  设定工作空间: function (工作空间句柄) {
    this.$当前窗口状态.current_workspace_handle = 工作空间句柄;
  },
  链接转化为卡片: async function (链接数据) {
    let 新数据 = JSON.parse(JSON.stringify(链接数据));
    新数据.id = Lute.NewNodeID();
    新数据.type = "card";
    新数据.subtype = "一般概念";

    this.$事件总线.$emit("保存数据", 新数据);
    let 起始卡片 =
      (await this.$数据库.cards.get(链接数据.attrs.from_id)) ||
      (await this.$数据库.links.get(链接数据.attrs.from_id));
    let 结束卡片 =
      (await this.$数据库.cards.get(链接数据.attrs.to_id)) ||
      (await this.$数据库.links.get(链接数据.attrs.to_id));
    await this.$数据库.links
      .delete(链接数据.id)
      .then(() => this.$数据库.cards.put(新数据));

    this.$事件总线.$emit("连接卡片", [起始卡片, 新数据]);
    this.$事件总线.$emit("连接卡片", [新数据, 结束卡片]);
  },

  添加卡片: function (卡片数据, def) {
    this.$事件总线.$emit("保存数据", 卡片数据, true);

    if (this.$当前窗口状态.current_cardpreset_name) {
      //  //console.log(this.$当前窗口状态.current_cardpreset_name)
      this.$事件总线.$emit(
        "改变数据预设",
        卡片数据,
        this.$当前窗口状态.current_cardpreset_name
      );
    }
    if (def) {
      this.$事件总线.$emit("打开发送对话框", 卡片数据);
    }
  },
  保存数据: function (传入数据, flag) {
    if (flag) {
      return null;
    }
    if (!传入数据) {
      return null;
    }
    if (!传入数据.id) {
      return null;
    }
    if (!传入数据.type){
      return null
    }
    if (传入数据.attrsproxy){
      return null
    }
    // 传入数据 = this.$更新数据时间戳(传入数据);
    
    let 数据表名 = 传入数据.type + "s";
    ////console.log(数据表名)
   if (传入数据.id) {
      this.$数据库[数据表名].put(传入数据)
      传入数据.type == "card"
      ? this.$事件总线.$emit("保存卡片", 传入数据)
      : this.$事件总线.$emit("保存链接", 传入数据);
      数据共享总线.postMessage({"动作时间":this.$生成毫秒时间戳(),"对象数据":传入数据})
      if (this.$当前窗口状态.current_workspace_handle) {
        this.$保存markdown卡片数据(
          传入数据,
          this.$当前窗口状态.current_workspace_handle
        );
      }
    }
  },
  
  删除数据: function (传入数据) {
    // //console.log(传入数据)
    try{
      this.$数据库[传入数据.type+'s'].get(传入数据.id).modify(
        data=>{data.attrs.trashed=true}
      )
    }catch(e){}
    let that = this;
    if (传入数据.attrs) {
      传入数据.type == "card"
        ? this.$事件总线.$emit("删除卡片", 传入数据)
        : this.$事件总线.$emit("删除链接", 传入数据);
    }
    let 数据表名 = 传入数据.type+'s'
    数据共享总线.postMessage({删除数据:传入数据})
    this.$数据库[数据表名].filter(
      data=>{
        if(data.id==传入数据.id){
          return true
        }
      }
    ).delete().then(
      this.$数据库.links.filter(
        data=>{
          if(data.attrs.from_id==传入数据.id||data.attrs.to_id==传入数据.id){
            return true
          }
        }
      ).delete()
    )
    
  },
  
  切换链接显示: function (传入数据) {
    //console.log(传入数据);

    if (!传入数据) {
      return null;
    }
    if (!传入数据.attrs) {
      return null;
    }
    传入数据.attrs.hidetag = !传入数据.attrs.hidetag ? true : false;
    this.$事件总线.$emit("保存数据", 传入数据);
  },

  定位至卡片: async function (卡片数据) {
    let id = 卡片数据.id || 卡片数据;
    let 目标卡片数据 =
      (await this.$数据库.cards.get(id)) || (await this.$数据库.links.get(id));
    window.scrollTo(
      (目标卡片数据.attrs.left +
        目标卡片数据.attrs.offsetx +
        目标卡片数据.attrs.width / 2) *
        this.$当前窗口状态.缩放倍数 -
        window.innerWidth / 2,
      (目标卡片数据.attrs.top +
        目标卡片数据.attrs.offsety +
        目标卡片数据.attrs.width / 2) *
        this.$当前窗口状态.缩放倍数 -
        window.innerHeight / 2
    );
  },
  清理选集: function () {
    ////console.log("选集清空")
    this.$当前窗口状态.current_cardid_array = [];
  },
  激活数据: function (数据) {
    let 数据类型 = 数据.type;
    this.$当前窗口状态.current_cardpreset_name = 数据.subtype;

    // //console.log(数据类型)
    数据类型 == "card"
      ? this.$事件总线.$emit("激活卡片", 数据)
      : this.$事件总线.$emit("激活链接", 数据);
  },
  激活卡片: function (数据) {
    //console.log(数据);
    this.$当前窗口状态.current_linkid = "";
    this.$当前窗口状态.current_cardid = 数据.id;
    this.$当前窗口状态.current_link = "";
    this.$当前窗口状态.current_card = 数据;

    if (this.$当前窗口状态.等待连接卡片) {
      let 等待连接卡片 = this.$当前窗口状态.等待连接卡片;

      this.$事件总线.$emit("连接卡片", [等待连接卡片, 数据]);
    }
  },
  激活链接: async function (数据) {
    this.$当前窗口状态.current_cardid = "";
    this.$当前窗口状态.current_linkid = 数据.id;
    this.$当前窗口状态.current_card = "";
    this.$当前窗口状态.current_link = 数据;

    if (this.$当前窗口状态.等待连接卡片) {
      let 等待连接卡片 = this.$当前窗口状态.等待连接卡片;

      this.$事件总线.$emit("连接卡片", [等待连接卡片, 数据]);
    }
  },
  连接卡片: function (卡片数组, 链接类型) {
    this.$当前窗口状态.等待连接卡片 = null;
    let 起始卡片 = 卡片数组[0];
    let 结束卡片 = 卡片数组[1];
    let 属性对象 = {};
    if (起始卡片 && 结束卡片) {
      属性对象 = {
        from_id: 起始卡片.id,
        to_id: 结束卡片.id,
      };
      if (属性对象.from_id == 属性对象.to_id) {
        return null;
      }
      let 新链接 = this.$根据属性生成链接(属性对象);
      if (链接类型) {
        新链接.subtype = 链接类型;
      }
      //console.log("创建链接",新链接);
      this.$数据库.links.put(新链接).then(() => {
        this.$事件总线.$emit("结束连接");
        this.$事件总线.$emit("添加链接", 新链接);
        this.$事件总线.$emit("保存链接", 新链接);
        if (this.$当前窗口状态.current_linkpreset_name) {
          this.$事件总线.$emit(
            "改变数据预设",
            新链接,
            this.$当前窗口状态.current_linkpreset_name
          );
          this.$事件总线.$emit("保存链接", 新链接);
        }
      });
    }
  },
  结束连接: function () {
    this.$当前窗口状态.等待连接卡片 = null;
  },
  开始连接: function (data) {
    this.$当前窗口状态.等待连接卡片 = data;
  },
  显示提示: function (提示内容) {
    this.$当前窗口状态.当前提示内容 = 提示内容;
  },
  窗口缩放: function (缩放倍数) {
    this.$当前窗口状态.缩放倍数 = 缩放倍数;
  },
  点击画板空白处:async function ($event) {
    let that = this
    if (!this.$当前窗口状态.等待连接卡片) {
      //  //console.log($event.target);
      this.$事件总线.$emit("清理选择");
    } else {
      let 卡片数据 = this.$根据属性生成卡片({
        top:
          (window.pageYOffset + $event.clientY) / this.$当前窗口状态.缩放倍数,
        left:
          (window.pageXOffset + $event.clientX) / this.$当前窗口状态.缩放倍数,
      });
      await this.$数据库.cards.put(卡片数据).then(() => {
        that.$事件总线.$emit("添加卡片", 卡片数据);
        that.$事件总线.$emit("保存数据", 卡片数据);
        that.$事件总线.$emit("连接卡片",[this.$当前窗口状态.等待连接卡片,卡片数据]);

      });
    }
  },
  结束绘制:function(){
    this.$当前窗口状态.is_drawing=false
  },
  清理选择: function () {
    //   //console.log("选择清空");
    this.$当前窗口状态.current_cardid = "";
    this.$当前窗口状态.current_linkid = "";
    this.$当前窗口状态.current_linkid_array = [];
    this.$当前窗口状态.current_cardid_array = [];
    this.$事件总线.$emit("选集变化", this.$当前窗口状态.current_cardid_array);
  },
  按下鼠标: function ($event) {
    if ($event.target.className != "cardscontainer layer") {
      return null;
    }
    let 鼠标点击坐标 = {
      x: (window.pageYOffset + $event.clientY) / this.$当前窗口状态.缩放倍数,
      y: (window.pageXOffset + $event.clientX) / this.$当前窗口状态.缩放倍数,
    };
    this.$事件总线.$emit("开始选择", 鼠标点击坐标);
  },
  鼠标点击卡片: function (数据, ctrl键被按下) {
    let id数组 = this.$当前窗口状态.current_cardid_array;
    ////console.log(id数组)
    let flag = true;
    id数组.forEach((id) => (id == 数据.id ? (flag = false) : null));
    if (id数组[0]) {
      if (!ctrl键被按下) {
        //  //console.log(id数组, 数据.id);
        flag ? this.$事件总线.$emit("清理选集") : null;
      } else {
        // //console.log(id数组, 数据.id);

        this.$当前窗口状态.current_cardid_array.push(数据.id);

        this.$事件总线.$emit("选集增加", 数据);
      }
    } else {
      this.$当前窗口状态.current_cardid_array.push(数据.id);
      this.$事件总线.$emit("选集增加", 数据);
    }
  },
  绘制数据改变:function (画板绘制数据){
   数据共享总线.postMessage({id:this.$baseid,"画板绘制数据":画板绘制数据.data,updated:画板绘制数据.updated})
  },
  双击画板: function ($event) {
    //console.log($event.target.className)

    if ($event.target.className != "cardscontainer layer") {
      return null;
    }
    let 卡片数据 = this.$根据属性生成卡片({
      top: (window.pageYOffset + $event.clientY) / this.$当前窗口状态.缩放倍数,
      left: (window.pageXOffset + $event.clientX) / this.$当前窗口状态.缩放倍数,
      
    });
    //console.log(卡片数据)

    this.$事件总线.$emit("添加卡片", 卡片数据);
    this.$数据库.cards
      .put(卡片数据)
      .then(this.$事件总线.$emit("保存数据", 卡片数据));
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
  发送卡片数据到思源: function (对象数据) {
    //  //console.log(对象数据)
  },
  打开发送对话框: function (对象数据) {
    this.$当前窗口状态.待发送数据 = 对象数据;
    this.$当前窗口状态.显示发送对话框 = true;
  },
  改变预设名称: function (预设类型, 预设id, 旧预设名, 新预设名) {
    this.$数据库[预设类型 + "presets"]
      .get(预设id)
      .modify({ name: 新预设名 })
      .then(
        this.$数据库[预设类型 + "s"]
          .filter((data) => {
            return data.subtype === 旧预设名;
          })
          .modify({ subtype: 新预设名, updated: this.$生成毫秒时间戳() })
          .each((data) => this.$事件总线.$emit("保存数据", data))
      );
  },
  改变数据预设: function (对象数据, 预设名) {
    对象数据.subtype = 预设名;
    let 预设值 = {};
    this.$数据库[对象数据.type + "presets"]
      .filter((data) => {
        if (data.name == 预设名) {
          return true;
        }
      })
      .toArray((array) => {
        预设值 = array[0];
      })
      .then(() => {
        let attrsproxy = {};
        //  //console.log(预设值)
        if (预设值) {
          for (属性名 in 预设值.attrs) {
            预设值[属性名];
            if (
              预设值.attrs[属性名] !== undefined &&
              预设值.attrs[属性名] !== "byref"
            ) {
              attrsproxy[属性名] = 预设值.attrs[属性名];
            }
          }
        }
        let 传出数据 = {};
        传出数据.id = 对象数据.id;
        传出数据.type = 对象数据.type;
        传出数据.subtype = 预设名;
        传出数据.attrsproxy = attrsproxy;
        // //console.log(传出数据)
        // //console.log(attrsproxy)
        this.$事件总线.$emit("保存数据", 传出数据);
      });
  },
  删除预设: async function (预设项目, 预设表名) {
    let 数据表名 = 预设表名.replace("presets", "s");
    let 预设名 = 预设项目.name;

    await this.$数据库[数据表名]
      .filter((data) => {
        if (data.subtype == 预设名) {
          return true;
        }
      })
      .modify((value) => {
        if (value) {
          value = this.$更新数据时间戳(value);

          value.subtype = 预设表名 == "cardpresets" ? "一般概念" : "属于";
        }
      });
    await this.$数据库[预设表名].delete(预设项目.id)

    
  },
  变更预设值: function (属性名, 预设项目) {
    console.log(属性名,预设项目)
    if (!预设项目) {
      return null;
    }
    if (!预设项目.type) {
      return null;
    }
    console.log(属性名,预设项目)
    let 预设表名 = 预设项目.type + "presets";
    let 数据表名 = 预设项目.type + "s";
    let 预设名 = 预设项目.name;
      //console.log(预设表名);
    if (属性名 && 预设表名) {
      this.$数据库[预设表名].put(预设项目).then(() =>
        this.$数据库[数据表名]
          .filter((data) => {
            if (data.subtype == 预设名) {
              return true;
            }
          })
          .modify((value) => {
            value = this.$更新数据时间戳(value);
            value.attrs[属性名] =
              预设项目.attrs[属性名] && 预设项目.attrs[属性名] !== "byref"
                ? 预设项目.attrs[属性名]
                : value.attrs[属性名];
            this.$事件总线.$emit("保存数据", value);
          })
      );
    }
  },
  新建预设: async function (预设数据, 预设名, 预设类型) {
    let 预设表名 = 预设类型 + "presets";
    let 预设卡片数据 = await this.$数据库[预设表名]
      .filter((data) => {
        if (data.name == 预设名) {
          return true;
        }
      })
      .toArray();

    if (预设卡片数据[0]) {
      alert("预设已经存在,换个新名字吧");
    } else {
      let id = Lute.NewNodeID();
      let 新预设数据 = {
        id: id,
        attrs: 预设数据,
        name: 预设名,
      };
      await this.$数据库[预设表名].put(新预设数据);
    }
  },
  当前预设改变: function (预设数据, 预设类型) {
    if (预设数据 && 预设类型) {
      预设类型 == "card"
        ? (this.$当前窗口状态.current_cardpreset = 预设数据)
        : (this.$当前窗口状态.current_linkpreset = 预设数据);
    }
  },
  窗口状态初始化: function () {},
  
};

for (let item in 事务列表) {
  if (item != "数据库") {
    事件总线.$on(item, 事务列表[item]);
  }
}
Vue.prototype.$事务列表 = 事务列表;
Vue.prototype.$事件总线 = 事件总线;
Vue.prototype.$思源伺服ip = window.location.host;
Vue.prototype.$主界面 = window.parent.document;
Vue.prototype.$数据共享总线 = 数据共享总线;
