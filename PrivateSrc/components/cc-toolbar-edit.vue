<template>
  <div
    style="border:solid 0.01vw;
        border-radius:0.2vw;
        position: fixed;
        top:90vh ;
        left:calc(50vw - 300px);
        background-color:white ;
        z-index:251;
        padding:0.2vw;
        width:600px
        "
  >
    <el-row>
      <el-col :span="6">
        <el-popover trigger="click">
          <el-input v-model="搜索关键词" @input="搜索()" size="mini"></el-input>
          <div v-for="(item,i) in 搜索结果列表">
            <el-link :value="item.id" @click="聚焦到卡片(item)">
              <span>{{ `id:${item.id}` }}</span>
              <span>{{ `${item.markdown.slice(0, 22)||无内容}` }}</span>
            </el-link>
          </div>
          <div slot="reference" class="el-icon-zoom-in"></div>
        </el-popover>
        <span class="el-icon-plus" @click="添加卡片()"></span>

        <div class="el-icon-help" @click="聚焦到卡片(卡片数据)"></div>
        <span class="el-icon-browser" @click="$窗口内打开超链接(卡片超链接)"></span>
      </el-col>
      <el-col :span="6"></el-col>
      <el-col :span="2">
        <el-popover trigger="click" width="350">
          <div
            slot="reference"
            :style="`
            color:${属性对象.color};
            font-weight:bolder;
            text-decoration:underline 4px;
            text-align:center;
            `"
          >A</div>
          <h3>文字</h3>

          <cc-color-pane v-model="属性对象.color" @change="设定当前标记()" :自定义颜色数组="自定义颜色数组"></cc-color-pane>
        </el-popover>
      </el-col>
      <el-col :span="2">
        <el-popover trigger="click" width="350">
          <div
            slot="reference"
            :style="`background-color:${属性对象.backgroundColor};
            width:24px;
            height:24px;
            border:solid 1px;
            margin:2px`"
          ></div>
          <h3>背景</h3>
          <cc-color-pane v-model="属性对象.backgroundColor" @change="设定当前标记()" :自定义颜色数组="自定义颜色数组"></cc-color-pane>
        </el-popover>
      </el-col>
      <el-col :span="2">
        <el-popover trigger="click" width="350">
          <div
            slot="reference"
            :style="`background-color:'';width:24px;height:24px;outline:solid 3px ${属性对象.borderColor};margin:2px`"
          ></div>
          <h3>边框</h3>
          <cc-color-pane v-model="属性对象.borderColor" @change="设定当前标记()" :自定义颜色数组="自定义颜色数组"></cc-color-pane>
        </el-popover>
      </el-col>
      <span
        style="font-size:xx-small"
        v-if="属性对象"
      >x:{{ 属性对象.left }}y{{ 属性对象.top }}|名称{{ 属性对象.title }}</span>
    </el-row>
  </div>
</template>
<script>
module.exports = {
  name: "cc-toolbar-edit",
  props: [
    "卡片数据id",
    "链接数据id",
  ],
  components: componentsList,
  data() {
    return {
      属性对象:{},
      卡片数据: {},
      链接数据: {},
      自定义颜色数组: [],
      搜索关键词: "",
      搜索结果id: "",
      搜索结果列表: ""
    }
  },
  async mounted() {
    this.卡片超链接 = `/widgets/cc-image-tag-new/vditor-card-editor.html?id=${this.卡片数据.id}&baseid=${数据源id}`
  },
  watch: {
    卡片数据id: {
      handler: async function (val, oldval) {
        if (val && val != oldval) {
          this.卡片数据 = await this.$数据库.tags.get(this.卡片数据id)
          this.属性对象 = this.卡片数据.attrs
          this.卡片超链接 = `/widgets/cc-image-tag-new/vditor-card-editor.html?id=${this.卡片数据.id}&baseid=${数据源id}`
        }
      }
    },
    搜索结果id: {
      handler: async function (val, oldval) {
        if (val) { console.log(val) }
      }

    }
  },
  methods: {
    聚焦到卡片: function (卡片数据) {
      this.$事件总线.$emit("定位至卡片", 卡片数据)
      setTimeout(() => {
        let el = document.querySelector(`[data-node-id='${卡片数据.id}']`)

        el.setAttribute("style", "border:solid 5px lightblue")
      }, 500);
      setTimeout(() => {
        let el = document.querySelector(`[data-node-id='${卡片数据.id}']`)

        el.setAttribute("style", "")
      }, 1000);
    },
    添加卡片:function(){
      let 卡片数据 = this.$根据属性生成卡片() 
      卡片数据.attrs.top= (window.pageYOffset + window.innerHeight/2-50)/this.$当前窗口状态.缩放倍数,
      卡片数据.attrs.left= (window.pageYOffset + window.innerHeight/2-50)/this.$当前窗口状态.缩放倍数,
/*
      {
          def_block: "",
          anchor: "",
          top: (window.pageYOffset + window.innerHeight/2-50)/this.$当前窗口状态.缩放倍数,
          left: (window.pageXOffset + window.innerWidth/2-50)/this.$当前窗口状态.缩放倍数,
          width: 100,
          height: 100,
          backgroundColor: "yellow",
          borderColor: "red",
          showhandler: false,
          color: "balck",
          folded: false,
          id: Lute.NewNodeID(),
        };*/
      
      this.$事件总线.$emit("添加卡片",卡片数据)
    },
    设定当前标记: function () {
      let 上传数据 = { "id": "", "styles": {} }
      上传数据.id = this.卡片数据id
      上传数据["styles"].color = this.属性对象.color
      上传数据["styles"].borderColor = this.属性对象.borderColor
      上传数据["styles"].backgroundColor = this.属性对象.backgroundColor
      this.$事件总线.$emit("保存卡片", 上传数据)
    },

    搜索: async function () {
      let 关键词 = this.搜索关键词
      if (关键词) {
        this.搜索结果列表 = await
          this.$数据库.tags
            .filter(value=>
              {
                if(value.markdown){
                let markdown = value.markdown
                if (markdown.indexOf(关键词) > 0) {
                  return true
                }}
                else { return false }
              }
            )
            .toArray()
      }
      else {
        this.搜索结果列表 = await this.$数据库.tags.toArray()
      }
              console.log("搜索结果",this.搜索结果列表)

    }

  },
  computed: {}
}
</script>