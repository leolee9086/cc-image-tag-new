<template>
  <div
    id="app"
    :style="`width: ${窗口大小.width}px; 
        height:${窗口大小.height}px;`"
    v-on:paste="黏贴内容($event)"
  >
  <div >
    <cc-layers-background class="layer"
    :填充图像路径="`https://gimg2.baidu.com/image_search/src=http%3A%2F%2Fhbimg.b0.upaiyun.com%2F1ed8cac5593ca73947eaca5e7476a406db12c639ef9b-YfnB5O_fw658&refer=http%3A%2F%2Fhbimg.b0.upaiyun.com&app=2002&size=f9999,10000&q=a80&n=0&g=0n&fmt=jpeg?sec=1642524710&t=ed8c446f0d57983e6adb43d55683702c`"
    ></cc-layers-background>
    <cc-layers-toolbar class="layer"
     :窗口大小="窗口大小"></cc-layers-toolbar>
    <cc-layers-tooltip class="layer"
     :窗口大小="窗口大小" :当前鼠标坐标="当前鼠标坐标"></cc-layers-tooltip>
  </div>
    <cc-layers-cards class="layer"
    
      v-on:paste="黏贴内容($event)" 
      :窗口大小="窗口大小"
    ></cc-layers-cards>
   
   <cc-layers-graph class="layer"
  
     :窗口大小="窗口大小"></cc-layers-graph>

  </div>
</template>
<script >

module.exports = {
  name: "app",
  components: componentsList,
  mounted: async function () {
    this.初始窗口大小 =  {H:window.innerHeight,W:window.innerWidth}
    window.addEventListener("mousewheel",this.计算比例)
    window.addEventListener("mousemove",this.计算坐标)
    this.主界面 = window.parent.document;
    console.log(this.主界面)
    this.思源伺服ip = window.location.host;
    console.log(this.思源伺服ip)
    console.log(this.$数据库)
    let url参数 = this.$解析url(window.location.href);
    console.log(url参数);
    let 数据源id = url参数.baseid;
  //  if (数据源id) 
   // {await this.打开思源数据()};
   
        
  },
  data() {
    return {
      画板列表:[],
      书签列表: "",
      新属性: { "type": "原始文本", "name": "newattr", "label": "newattr", "value": "default" },
      属性类型: ["图片", "文本", "块链接", "超链接", "原始文本", "附件"],
      数据源id: "",
      窗口大小: { width: 2000, height: 2000 },
      主界面: {},
      挂件自身元素: "",
     
      当前鼠标坐标: { x: "", y: "" },
    };
  },
  watch: {
  
 

    数据源id: function (val, oldval) {
      console.log("new", val, "old", oldval)
      if (val != oldval && val && oldval) {
        this.初始化(val);
      }
    },
  },
  methods: {
    
    以属性查找对象(集合, 属性名, 属性值) {
      let obj = null
      集合.forEach(card => {
        if (card) {
          if (card[属性名] == 属性值) {
            obj = card
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
    打开思源数据: async function (val) {
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
      let filepath = `assets/datao-${this.数据源id}.cccard`      
      if (this.$挂件模式()) { filepath = this.挂件自身元素.getAttribute("data-assets") }
      let url = 'http://' + that.思源伺服ip + '/' + filepath
      console.log(url)
      await axios.get(url).then((res) => {
        文件数据 = res.data
        if (文件数据["cardarray"]) {

          try {
            this.图片缩放倍数 = parseFloat(
              文件数据.resize
            ).toFixed(2);

          } catch (e) { console.log(e) }
        }
      })
      if (!this.标记数组) { this.标记数组 = [] }
      if (!this.links) { this.links = [] }
      this.标记数组=文件数据["cardarray"]
      this.links=文件数据["links"]
      console.log(this.标记数组)
      for(i in this.标记数组){
        let card = this.标记数组[i]
        if (!card.id) {
          card.id = Lute.NewNodeID();
          console.log(card.id)
        }
        if (!card.markdown) {
          card.markdown = "## 此处输入内容";
        }
        card.attrs=card.attrs||{}
        card.attrs["custom-x"]=card.left
        card.attrs["custom-y"]=card.top
        if(card.def_block){
          card.def_block = card.def_block.replace("((", "").replace("))", "")};
        await this.$数据库.cards.put(card)
      }

      for(i in this.links){
        let link = this.links[i]
        if (!link.id || link.id.length < 5) {
          link.id = Lute.NewNodeID();
        }
        if (this.标记数组[link.from]) { link.from = this.标记数组[link.from]["id"] }
        if (this.标记数组[link.to]) { link.to = this.标记数组[link.to]["id"] }
        console.log(link)
        await this.$数据库.links.put(link)
      }
      console.log("加载完成")

    },
    计算坐标($event) {
      this.当前鼠标坐标.x = $event.clientX;
      this.当前鼠标坐标.y = $event.clientY;
      this.保存计数器 = this.保存计数器 + 1;
      if (this.保存计数器 >= 100) {
        this.保存计数器 = 1
      }
      this.窗口大小 = {
        width: window.pageXOffset + $event.clientX + window.innerWidth ,
        height: window.pageYOffset + $event.clientY + window.innerHeight,
      };
    },
    保存数据: async function () {
      this.$事件总线.$emit("上传数据到思源",this.数据源id)
    },
    
    打开新窗口() {
      this.$窗口内打开超链接(
        `http://${this.思源伺服ip}/widgets/cc-image-tag/?id=${this.数据源id}`
      );
    },
  },
}
</script>