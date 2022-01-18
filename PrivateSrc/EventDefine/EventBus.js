const 事件总线 = new Vue();

const 事务列表 = {
  数据库: 数据库,
  上传当前画板文件数据到思源: async function () {
    let that = this;
    let JSON数据 = {};
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
          if (Vue.prototype.$挂件模式()) {
            that.$挂件自身元素().setAttribute("data-assets", filepath);
            that.$挂件自身元素().setAttribute("custom-data-assets", filepath);
          }
        }
      });
  },

  链接转化为卡片: async function (链接数据) {
    let 新数据 = JSON.parse(JSON.stringify(链接数据));
    新数据.id = Lute.NewNodeID();
    新数据.type = "card";
    新数据.subtype = "一般概念";

    this.$事件总线.$emit("保存卡片", 新数据);
    let 起始卡片 =
      (await this.$数据库.cards.get(链接数据.attrs.from_id)) ||
      (await this.$数据库.links.get(链接数据.attrs.from_id));
    let 结束卡片 =
      (await this.$数据库.cards.get(链接数据.attrs.to_id)) ||
      (await this.$数据库.links.get(链接数据.attrs.to_id));
    this.$事件总线.$emit("连接卡片", [起始卡片, 新数据]);
    this.$事件总线.$emit("连接卡片", [新数据, 结束卡片]);
    await this.$数据库.links
      .delete(链接数据.id)
      .then(() => this.$数据库.cards.put(新数据));
  },
  ctrl加鼠标点击卡片: function (卡片数据) {
    this.$当前窗口状态.current_cardid_array.push(卡片数据);
    this.$当前窗口状态.current_cardid_array = Array.from(
      new Set(this.$当前窗口状态.current_cardid_array)
    );
    this.$事件总线.$emit("选集变化", this.$当前窗口状态.current_cardid_array);
  },

  添加卡片: async function (卡片数据, def) {
    await this.$数据库.cards.put(卡片数据);
    this.$事件总线.$emit("保存数据", 卡片数据, true);
    //console.log(this.$当前窗口状态.current_cardpreset_name)

    if (this.$当前窗口状态.current_cardpreset_name) {
      //  console.log(this.$当前窗口状态.current_cardpreset_name)
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
    传入数据.type == "card"
      ? this.$事件总线.$emit("保存卡片", 传入数据)
      : this.$事件总线.$emit("保存链接", 传入数据);
  },
  保存卡片: async function (传入数据) {
    if (!传入数据) {
      return null;
    }
    let 数据表名 = 传入数据.type + "s";
    //console.log(数据表名)
    if (传入数据.attrsproxy) {
      let 原始数据 = await this.$数据库[数据表名].get(传入数据.id);
      if (原始数据) {
        原始数据.subtype = 传入数据.subtype || "属于";
        for (属性名 in 传入数据.attrsproxy) {
          原始数据.attrs[属性名] = 传入数据.attrsproxy[属性名];
        }
        原始数据 = this.$更新数据时间戳(原始数据);
        传入数据 = 原始数据;
      }
      this.$事件总线.$emit("保存卡片", 传入数据);
    } else if (传入数据.id) {
      传入数据 = this.$更新数据时间戳(传入数据);
      let 原始数据 = await this.$数据库[数据表名].get(传入数据.id);
      if (原始数据) {
        await this.$数据库[数据表名].put(传入数据);
      }
    }
  },
  删除数据: function (传入数据) {
    if (传入数据.attrs) {
      传入数据.type == "card"
        ? this.$事件总线.$emit("删除卡片", 传入数据)
        : this.$事件总线.$emit("删除链接", 传入数据);
    }
    let id = 传入数据.id;
    let 数据表名=传入数据.type+"s"
    传入数据.attrs.trashed = true;
    this.$数据库[数据表名].put(传入数据).then(() => {
      this.$数据库[数据表名].delete(id).then(() => {
        this.$数据库.links
          .filter((data) => {
            if (data.attrs.from_id == id || data.attrs.to_id == id) {
              return true;
            }
          })
          .toArray((array) =>
            array.forEach((data) => this.$事件总线.$emit("删除数据", data))
          );
      });
    });
  },
  
  保存链接: async function (传入数据) {
    if (!传入数据) {
      return null;
    }

    let 数据表名 = 传入数据.type + "s";

    if (传入数据.attrsproxy) {
      let 原始数据 = await this.$数据库.links.get(传入数据.id);
      if (原始数据) {
        原始数据.subtype = 传入数据.subtype || "属于";

        for (属性名 in 传入数据.attrsproxy) {
          原始数据["attrs"][属性名] = 传入数据["attrsproxy"][属性名];
        }

        原始数据 = this.$更新数据时间戳(原始数据);
        传入数据 = 原始数据;
      }

      await this.$数据库.links.put(传入数据);
    } else if (传入数据.id) {
      let 原始数据 = await this.$数据库[数据表名].get(传入数据.id);
      传入数据 = this.$更新数据时间戳(传入数据);

      if (原始数据) {
        await this.$数据库[数据表名].put(传入数据);
      }
    }
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
  激活数据: function (数据) {
    let 数据类型 = 数据.type;
    // console.log(数据类型)
    数据类型 == "card"
      ? this.$事件总线.$emit("激活卡片", 数据)
      : this.$事件总线.$emit("激活链接", 数据);
  },
  激活卡片: async function (数据) {
    this.$当前窗口状态.current_linkid = "";
    this.$当前窗口状态.current_cardid = 数据.id;
    if (this.$当前窗口状态.current_cardid_array[0]) {
    } else {
      this.$当前窗口状态.current_cardid_array.push(数据);
      this.$事件总线.$emit("选集变化", this.$当前窗口状态.current_cardid_array);
    }
    if (this.$当前窗口状态.等待连接卡片id) {
      let 等待连接卡片id = this.$当前窗口状态.等待连接卡片id;
      let 等待连接卡片 =
        (await this.$数据库.cards.get(等待连接卡片id)) ||
        (await this.$数据库.links.get(等待连接卡片id));
      this.$事件总线.$emit("连接卡片", [等待连接卡片, 数据]);
      this.$当前窗口状态.等待连接卡片id = null;
    }
    await this.$数据库.states.put(this.$当前窗口状态);
  },
  激活链接: async function (数据) {
    this.$当前窗口状态.current_cardid = "";
    this.$当前窗口状态.current_linkid = 数据.id;
    if (this.$当前窗口状态.等待连接卡片id) {
      let 等待连接卡片id = this.$当前窗口状态.等待连接卡片id;

      let 等待连接卡片 =
        (await this.$数据库.cards.get(等待连接卡片id)) ||
        (await this.$数据库.links.get(等待连接卡片id));
      this.$事件总线.$emit("连接卡片", [等待连接卡片, 数据]);
      this.$当前窗口状态.等待连接卡片id = null;
    }
    await this.$数据库.states.put(this.$当前窗口状态);
  },
  连接卡片: function (卡片数组, 链接类型) {
    let 起始卡片 = 卡片数组[0];
    let 结束卡片 = 卡片数组[1];

    if (起始卡片 && 结束卡片) {
      let 属性对象 = {
        from_id: 起始卡片.id,
        to_id: 结束卡片.id,
      };
      let 新链接 = this.$根据属性生成链接(属性对象);
      if (链接类型) {
        新链接.subtype = 链接类型;
      }
    //  console.log(新链接);
      this.$数据库.links
        .put(新链接)
        .then(() => this.$事件总线.$emit("保存链接", 新链接))
        .then(() => {
          if (this.$当前窗口状态.current_linkpreset_name) {
            //   console.log(this.$当前窗口状态.current_linkpreset_name)
            this.$事件总线.$emit(
              "改变数据预设",
              新链接,
              this.$当前窗口状态.current_linkpreset_name
            );
          }
          this.$事件总线.$emit("保存链接", 新链接);
          this.$事件总线.$emit("结束连接");
        });
    }
  },
  开始连接: function (data) {
    this.$当前窗口状态.等待连接卡片id = data.id;
  },
  显示提示: function (提示内容) {
    this.$当前窗口状态.当前提示内容 = 提示内容;
  },
  窗口缩放: function (缩放倍数) {
    this.$当前窗口状态.缩放倍数 = 缩放倍数;
  },
  点击画板空白处: function ($event) {
    if (!this.$当前窗口状态.等待连接卡片id) {
      this.$事件总线.$emit("清理选择");
    } else {
      let 卡片数据 = this.$根据属性生成卡片({
        top:
          (window.pageYOffset + $event.clientY) / this.$当前窗口状态.缩放倍数,
        left:
          (window.pageXOffset + $event.clientX) / this.$当前窗口状态.缩放倍数,
      });
      this.$数据库.cards.put(卡片数据).then(() => {
        this.$事件总线.$emit("保存卡片", 卡片数据);
        this.$事件总线.$emit("结束连接");
      });
    }
  },
  清理选择: function () {
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
  双击画板: function ($event) {
    if ($event.target.className != "cardscontainer layer") {
      return null;
    }
    let 卡片数据 = this.$根据属性生成卡片({
      top: (window.pageYOffset + $event.clientY) / this.$当前窗口状态.缩放倍数,
      left: (window.pageXOffset + $event.clientX) / this.$当前窗口状态.缩放倍数,
    });
    this.$数据库.cards
      .put(卡片数据)
      .then(this.$事件总线.$emit("保存卡片", 卡片数据));
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
    //  console.log(对象数据)
  },
  打开发送对话框: function (对象数据) {
    this.$当前窗口状态.待发送数据 = 对象数据;
    this.$当前窗口状态.显示发送对话框 = true;
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
        //  console.log(预设值)
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
        // console.log(传出数据)
        // console.log(attrsproxy)
        this.$事件总线.$emit("保存卡片", 传出数据);
      });
  },
  删除预设: async function (预设项目, 预设表名, callback) {
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
    await this.$数据库[预设表名].delete(预设项目.id);

    if (callback) {
      callback.apply();
    }
  },
  变更预设值: function (属性名, 预设项目) {
    if (!预设项目) {
      return null;
    }
    if (!预设项目.type) {
      return null;
    }
    let 预设表名 = 预设项目.type + "presets";
    let 数据表名 = 预设项目.type + "s";
    let 预设名 = 预设项目.name;
  //  console.log(预设表名);
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
            this.$事件总线.$emit("保存数据", true);
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
