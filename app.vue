<template>
  <div
    id="app"
    style="width: 100vw; height: 100vw"
    v-on:mousewheel="计算坐标($event)"
    v-on:mousemove="计算坐标($event)"
    v-on:paste="黏贴内容($event)"
  >
    <cc-layers-background
    :填充图像路径="`https://ss3.baidu.com/9fo3dSag_xI4khGko9WTAnF6hhy/zhidao/pic/item/562c11dfa9ec8a1391b655b4f603918fa0ecc032.jpg`"
    ></cc-layers-background>

    <cc-layers-cards
   :style="`position: absolute; width: ${窗口大小.width}px; height:${窗口大小.height}px; `"
      v-on:paste="黏贴内容($event)"
    ></cc-layers-cards>
   
    <cc-layers-graph :窗口大小="窗口大小"></cc-layers-graph>
   <cc-layers-toolbar :窗口大小="窗口大小"></cc-layers-toolbar>
  </div>
</template>
<script >

module.exports = {
  name: "app",
  components: componentsList,
  mounted: async function () {
    this.主界面 = window.parent.document;
    console.log(this.主界面)
    this.思源伺服ip = window.location.host;
    console.log(this.思源伺服ip)
    console.log(this.$数据库)

    this.$事件总线.$on("检测到数据添加",
      function(data){
        console.log(data)
      }
    )
        this.定点添加=true

    await this.初始化();
    
  },
  data() {
    return {
      中止计算: false,
      书签列表: "",
      新属性: { "type": "原始文本", "name": "newattr", "label": "newattr", "value": "default" },
      属性类型: ["图片", "文本", "块链接", "超链接", "原始文本", "附件"],
      等待连接: "",
      数据源id: "",
      协同缩放: false,
      窗口大小: { width: 2000, height: 2000 },
      主界面: {},
      内部图片源: "",
      图片源: "",
      图片格式: "jpg",
      思源伺服ip: "",
      apitoken: "",
      格式列表: ["jpg", "png", "jpeg"],
      挂件自身元素: "",
      空白标记: [
        {
          id: "",
          parent_id: "",
          root_id: "锚文本为空时显示来源块内容",
          hash: "",
          path: "",
          attrs: "",
          markdown: "",
          html: "",
          type: "",
          index: "",
          created: "",
          updated: "",
          children: "",
          x: 0,
          y: 0,
        },
      ],
      
      标记数组:[],
      links: [],
      当前激活标签序号: null,
      当前激活标签类型: "",
      当前鼠标坐标: { x: "", y: "" },
      当前块引: "",
      自定义颜色数组: [],
      当前边框色: "",
      当前背景色: "",
      当前文字色: "",
      图片缩放倍数: 1,
      保存计数器: 1,
      定点添加: false,
      不可见标记数组: [],
      等待连接: false,
    };
  },
  watch: {
   
    图片源: async function (val) {
      if (val) {
        let that = this;
        console.log(this.图片源);
        let url = "http://" + this.思源伺服ip;
        let assetpath = this.图片源
          .replace(url, "")
          .replace("http://127.0.0.1:6806", "");
        let id = this.数据源id;

        if (val) {
          this.内部图片源 = val;
        }
        console.log(this.$refs["image"]);
        let image = this.$refs["image"];
        image.onload = function (event) {
          console.log(event.target);
          console.log(
            event.target.naturalWidth,
            event.target.naturalHeight
          );
          event.target.style.width =
            event.target.naturalWidth * that.图片缩放倍数 + "px";
          event.target.style.height =
            event.target.naturalHeight * that.图片缩放倍数 + "px";
        };
      }
    },
    内部图片源(val) {
      if (this.图片源 != val) {
        this.图片源 = val;
      }
    },
    当前激活标签序号(val, oldval) {
      console.log("序号", val);
      if (null != val) {
        let 标记数组 = this.标记数组
        this.当前块引 = this.标记数组[val]["def_block"];
        this.当前块引 = this.标记数组[this.当前激活标签序号]["def_block"];
        this.当前背景色 = this.标记数组[this.当前激活标签序号]["backgroundColor"];
        this.当前边框色 = this.标记数组[this.当前激活标签序号]["borderColor"];
        this.当前文字色 = this.标记数组[this.当前激活标签序号]["color"];
        this.当前锚文本 = this.标记数组[this.当前激活标签序号]["anchor"];
        if (this.等待连接) {
          let flag = true
          this.links.forEach(link => {
            if ((link.to == 标记数组[val]["id"] && link.from == 标记数组[oldval]["id"]) || (link.to == 标记数组[oldval]["id"] && link.from == 标记数组[val]["id"])) {
              flag = false
            }
          })
          if (flag) {
            this.links.push(
              {
                id: Lute.NewNodeID(),
                from: this.标记数组[oldval]["id"],
                to: this.标记数组[val]["id"],
                fromIndex: oldval,
                toIndex: val,
                color: "black",
                width: "1",
                label: "",
                type: ""

              })
            console.log(this.links)
            this.等待连接 = false
          }
        }
      }
    },
    标记数组: {
      handler(val, oldval) {
        this.检查链接()
      },
      deep: true,
      immediate: true
    },
    links: {
      handler(val, oldval) {
        this.检查链接()

      },
      deep: true,
    },

    数据源id: function (val, oldval) {
      console.log("new", val, "old", oldval)
      if (val != oldval && val && oldval) {
        this.初始化(val);
      }
    },
  },
  methods: {

    检查链接: async function () {
      for (i in this.links) {
        //    console.log(this.links)
        let link = this.links[i]
        let 标记1 = this.以属性查找对象(this.标记数组, "id", link.from)
        let 标记2 = this.以属性查找对象(this.标记数组, "id", link.to)

        if (!标记1 || !标记2) {
          this.links.splice(i, 1);
          i = i - 1
          this.links = JSON.parse(JSON.stringify(this.links));
        }
      }

    },
    以属性查找对象(集合, 属性名, 属性值) {
      let obj = null
      集合.forEach(tag => {
        if (tag) {
          if (tag[属性名] == 属性值) {
            obj = tag
          }
        }
      }
      )
      return obj
    },
    
    黏贴内容: function ($event) {
      let clipboardData = $event.clipboardData;

      if (!(clipboardData && clipboardData.items)) {
        return;
      }
      for (var i = 0, len = clipboardData.items.length; i < len; i++) {
        var item = clipboardData.items[i];
        if (item.kind === "string" && item.type == "text/plain") {
          item.getAsString((str) => {
            console.log(str);
            this.解析剪贴板内容(str + "");
          });
        }
      }
    },
    解析剪贴板内容: async function (str) {
      let 锚文本 = await 获取思源块链接锚文本(
        this.思源伺服ip,
        this.apitokn,
        str
      );
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
          height: 100,
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
    展开链接面板: async function (index) {
      let id = this.标记数组[index]["def_block"];
      let 反向链接列表 = await this.以id获取反向链接(id);
      if (反向链接列表) {
        this.当前反向链接列表 = 反向链接列表["data"];
        this.当前反向链接列表["index"] = index;
        console.log(this.当前反向链接列表);
      }
    },
    初始化: async function (val) {
      if (this.$挂件模式()) {
        this.挂件自身元素 = window.frameElement.parentElement.parentElement;
        this.数据源id = this.挂件自身元素.getAttribute("data-node-id");
      } else {
        let url参数 = this.$解析url(window.location.href);
        console.log(url参数);
        let 数据源id = url参数.baseid;
        if (数据源id) {
          this.数据源id = 数据源id;
        }
      }
      let that = this
      let filepath = `assets/datao-${this.数据源id}.cctag`
      //filepath = 数据源属性["data-assets"]
      
      
      if (this.$挂件模式()) { filepath = this.挂件自身元素.getAttribute("data-assets") }
      let url = 'http://' + that.思源伺服ip + '/' + filepath
      console.log(url)
      await axios.get(url).then((res) => {
        文件数据 = res.data
        if (文件数据["tagarray"]) {

          try {
            this.图片缩放倍数 = parseFloat(
              文件数据.resize
            ).toFixed(2);

          } catch (e) { console.log(e) }

        }
      })
      if (!this.标记数组) { this.标记数组 = [] }
      if (!this.links) { this.links = [] }
      this.标记数组=文件数据["tagarray"]
      this.links=文件数据["links"]
      console.log(this.标记数组)
      for(i in this.标记数组){
        let tag = this.标记数组[i]
        if (!tag.id) {
          tag.id = Lute.NewNodeID();
          console.log(tag.id)
        }
        if (!tag.markdown) {
          tag.markdown = "## 此处输入内容";
        }
        tag.attrs=tag.attrs||{}
        tag.attrs["custom-x"]=tag.left
        tag.attrs["custom-y"]=tag.top
        if(tag.def_block){
          tag.def_block = tag.def_block.replace("((", "").replace("))", "")};
        this.$数据库.tags.put(tag)
      }

      for(i in this.links){
        let link = this.links[i]
        if (!link.id || link.id.length < 5) {
          link.id = Lute.NewNodeID();
        }
        if (this.标记数组[link.from]) { link.from = this.标记数组[link.from]["id"] }
        if (this.标记数组[link.to]) { link.to = this.标记数组[link.to]["id"] }
        console.log(link)
        this.$数据库.links.put(link)
      }
     

    },
    定位至标记(标记对象) {
      this.$事件总线.$emit("定位至标记",标记对象)
      window.scrollTo(
        标记对象.left - window.innerWidth / 2,
        标记对象.top - window.innerHeight / 2
      );
    },
   
    以id获取块内容: async function (id) {
      let 数据源id = this.挂件自身元素.getAttribute("data-node-id");
      let 临时属性数组 = await this.$以id数组通过sql形式获取思源块信息数组([
        数据源id,
      ]);
      let 挂件自身属性 = 临时属性数组[0];
      let 当前文档id = 挂件自身属性["root_id"];
      let 外部id数组 = [数据源id, 当前文档id];
      let 块内容 = await this.$以id获取块内容(外部id数组, id);
      console.log(块内容["blocks"][0]);
    },

    打开右键菜单() {
      this.显示菜单 = true;
    },
    
    


    计算坐标($event) {

      this.当前鼠标坐标.x = $event.clientX;
      this.当前鼠标坐标.y = $event.clientY;

      this.保存计数器 = this.保存计数器 + 1;
      if (this.保存计数器 >= 100) {
   //     this.保存数据();
        this.保存计数器 = 1
      }

      this.窗口大小 = {
        width: window.pageXOffset + $event.clientX + window.innerWidth ,
        height: window.pageYOffset + $event.clientY + window.innerHeight,
      };

      //console.log(this.窗口大小)

    },

    保存数据: async function () {
      this.$事件总线.$emit("上传数据到思源",this.数据源id)
    },
    
    设定当前标记() {
      let that = this;
      this.$set(
        this.标记数组[that.当前激活标签序号],
        "def_block",
        this.当前块引
      );
      this.标记数组[that.当前激活标签序号]["backgroundColor"] =
        this.当前背景色;
      this.标记数组[that.当前激活标签序号]["borderColor"] = this.当前边框色;
      this.标记数组[that.当前激活标签序号]["color"] = this.当前文字色;
      this.标记数组[that.当前激活标签序号]["anchor"] = this.当前锚文本;
      //this.当前激活标签序号 = null;
      this.当前块引 = "";
      this.标记数组 = JSON.parse(JSON.stringify(this.标记数组));
    },
    增加标记: function () {
      if (this.定点添加) {
      
        let 空标签对象= this.$根据属性生成标签( {top: window.pageYOffset + this.当前鼠标坐标.y,
          left: window.pageXOffset + this.当前鼠标坐标.x})
        this.标记数组.push(空标签对象);
        // this.标记数组 = JSON.parse(JSON.stringify(this.标记数组));
        console.log(this.标记数组)
        this.$事件总线.$emit("添加卡片",空标签对象)
        //          this.定点添加 = false;
      }
    },

    获取块属性: async function (id) {
      let that = this;
      当前块信息 = await that.通过id获取文档属性(id);
      当前块内容对象 = await 以id获取思源块信息(
        that.思源伺服ip,
        that.apitoken,
        id
      );
      let 当前块属性 = 当前块信息["ial"];
      当前块信息 = 当前块信息;

      当前块属性["type"] = 当前块内容对象["type"];
      return 当前块属性;

    },

    通过id获取文档属性: async function (id) {
      let that = this;
      let obj = {};
      await axios({
        method: "post",
        url: "http://" + that.思源伺服ip + "/api/block/getDocInfo",
        headers: { Authorization: "Token " + that.apitoken },
        data: { id: `${id}` },
      }).then((result) => {
        //   console.log("aaa",result.data)

        obj = result.data["data"];
      });
      return obj;
    },
    打开新窗口() {
      this.$窗口内打开超链接(
        `http://${this.思源伺服ip}/widgets/cc-image-tag/?id=${this.数据源id}`
      );
    },
  },
}
</script>