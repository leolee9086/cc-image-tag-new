<template     
>
  <vue-draggable-resizable
    v-if="value && !hide"
    ref="container"
    :draggable="!正在编辑"
    @activated="激活 = true"
    @deactivated="激活 = false"
    @dragging="dragging"
    @dragstop="dragstop"
    @resizing="resizing"
    @resizestop="resizestop"
    :resizable="!carddata.folded"
    :y="carddata.top"
    :w="width || carddata.width"
    :h="height || carddata.height"
    :x="carddata.left"
    :z="200"
    class-name-handle="my-handle-class"
    class-name="my-class"
  >
    <el-popover
      popper-class="tagpoper"
      trigger="hover"
      :open-delay="300"
      placement="right"
      :width="100"
      v-if="carddata.folded"
    >
      <div
        class="lableFolded"
        slot="reference"
        :style="`position: absolute;                
        background-color:${carddata.backgroundColor};
        color:${carddata.color};
        border:solid ${carddata.borderColor} 2px;
        width:15px;
        height:15px;
        min-width:15px;
        min-height:15px;
        max-width:15px;
        max-height:15px;
        border-radius:100%;
        text-align:center;
        padding-bottom:3px
        `"
        @dblclick="carddata.folded = !carddata.folded"
      >{{ index }}</div>
      <div
        :style="`
        overflow:hidden;
        border:solid ${carddata.borderColor} 1px;
        background-color:${carddata.backgroundColor};
        border-radius:5px`"
      >
        <cc-link-siyuan
          :style="`color:${carddata.color};`"
          :锚文本="carddata.anchor"
          :链接id="carddata.def_block"
        ></cc-link-siyuan>

        <div :style="`font-size:xx-small;color:${carddata.color}`">双击标记展开,拖拽移动</div>
      </div>
    </el-popover>
    <div v-if="!carddata.folded" @dblclick="carddata.folded = !carddata.folded">
      <div
        :style="`position:absolute;
                        overflow:hidden;
                        border:solid ${carddata.borderColor} ${边框宽度}px;
                        background-color:${carddata.backgroundColor};
                        width:${carddata.width - 5 + 'px'};
                        height:${carddata.height - 5 + 'px'};
                        border-radius:5px`
        "
      >
        <div class="cc-node-toolbar">
          <span style="float:right">{{ index }}</span>


          <span class="el-icon-delete" v-on:click="删除()"></span>
          <span class="el-icon-share" @click="开始连接()"></span>
          <span class="el-icon-edit" v-if="!正在编辑" @click="正在编辑 = true"></span>
          <span class="el-icon-check" v-if="正在编辑" @click="正在编辑 = false"></span>
          <span class="el-icon-focus" @click="$事件总线.$emit('定位至卡片', carddata.id)"></span>
          <el-tooltip content="新窗口打开编辑">
          <span class="el-icon-browser" @click="$窗口内打开超链接(卡片超链接)"></span>
          </el-tooltip>
          <strong>{{title}}</strong>

        </div>
        <div class="cc-node-content">
          <div :style="`color:${carddata.color};`">
            <span class="el-icon-siyuan" v-if="carddata.def_block"></span>
            <cc-link-siyuan
              v-if="carddata.def_block"
              :style="`color:${carddata.color};`"
              :锚文本="`引用自${carddata.def_block}`"
              :链接id="carddata.def_block"
            ></cc-link-siyuan>
          </div>
          <cc-vditor-vue v-model="markdown" v-if="正在编辑"></cc-vditor-vue>
          <div v-if="!正在编辑" v-html="carddata.htmlcontent"></div>
        </div>
      </div>
    </div>
  </vue-draggable-resizable>
</template>

<script>
module.exports = {
  name: "cc-block-card",
  props: ["value", "index", "移除标签", "数据源id"],
  components: componentsList,
  model: { prop: "value", event: "change" },
  data() {
    return {
      id: this.value.id,
      markdown: "",
      carddata: "",
      htmlcontent: "",
      激活: false,
      正在编辑: false,
      开始监听: false,
      边框宽度: 1,
      卡片超链接: "",
      folded: "",
      width: "",
      height: "",
      hide:"",
      title:"未命名",
    }
  },
  beforeMount() {

    this.folded = null
  },
  async mounted() {
    this.carddata = this.value
    this.开始监听 = true
   // this.title = this.carddata.title
    this.folded = this.carddata.folded
    this.卡片超链接 = `/widgets/cc-image-tag-new/vditor-card-editor.html?id=${this.carddata.id}&baseid=${数据源id}`
    this.hide=false
    this.timer =  setInterval(this.计算可见性,100)
  },
  
  watch: {
    id: {
      handler: async function (val) {
        this.carddata = await this.$数据库.tags.get(val)
        this.markdown = this.carddata.markdown
      }
    },
    value: {
      handler: function (val, oldval) {
        if (val == oldval) { return null }
        this.carddata = val
      },
      deep: true
    },
    markdown: {
      handler: async function (val, oldval) {
        if (val == oldval) { return null }
        this.carddata.markdown = val
        this.carddata.htmlcontent = await Vditor.md2html(val)
        this.保存卡片()
      }
    },
     title: {
      handler:  function (val, oldval) {
        if(!val){this.carddata.title ="未命名"}
        this.carddata.title = val
        this.保存卡片()
      }
    },
    carddata: {
      handler: async function (val) {
        this.markdown = val.markdown
        this.folded = val.folded

        if (val != this.value) {
          this.保存卡片()
        }
      },
      deep: true
    },
    folded: {
      handler: function (val) {
        if (val) {

          this.width = 30
          this.height = 30

          this.$更新数据时间戳(this.carddata)
        }
        else {
          try {
            this.width = null
            this.height = null
            this.$refs.container["min-width"] = 100
            this.$refs.container["min-height"] = 30
            this.$refs.container["width"] = this.carddata.width
            this.$refs.container["height"] = this.carddata.height
            this.$更新数据时间戳(this.carddata)
          } catch (e) { }
        }
      },
      immediate: true
    },
    激活(val) {
      if (val) {
        this.边框宽度 = 3
        this.$更新数据时间戳(this.carddata)
        this.$事件总线.$emit("激活卡片", this.carddata.id)
      }
      else {
        this.边框宽度 = 1
        this.$更新数据时间戳(this.carddata)
        this.$emit("deactivated", "")
      }
    },
    正在编辑(val) {
      if (val) {
        this.$emit("editing", "")
      }
    },



  },
  methods: {
    开始连接() {
      this.$事件总线.$emit("开始连接", this.carddata)
    },
    删除() {
      if (this.开始监听 = true) {
        this.移除标签
        this.$emit("delete", this.index)
        this.$事件总线.$emit("删除卡片", this.carddata)
      }
    },
    dblclick: function () {
      this.$emit("dblclick")
    },
    展开链接: function () {
      this.$emit("callbacklink", this.carddata.def_block)
    },
    dragging: function (x, y) {
      this.carddata.top = y
      this.carddata.left = x
      this.保存卡片()

    },
    dragstop() {
      this.保存卡片()

    },
    resizing: function (x, y, width, height) {
      this.carddata.top = y
      this.carddata.left = x
      this.carddata.width = width
      this.carddata.height = height
      this.保存卡片()
    },
    resizestop: function (x, y, width, height) {
      this.carddata.top = y
      this.carddata.left = x
      this.carddata.width = width
      this.carddata.height = height
      this.保存卡片()
    },
    保存卡片: function () {
      if (!this.开始监听) { return null }
      this.carddata = this.$更新数据时间戳(this.carddata)
      this.$事件总线.$emit("保存卡片", this.carddata)
    },
    计算可见性: async function () {
          let carddata = this.carddata
          if (
            window.pageYOffset > carddata.top+carddata.height ||
            window.pageYOffset + window.innerHeight < carddata.top ||
            window.pageXOffset > carddata.left+carddata.width ||
            window.pageXOffset + window.innerWidth < carddata.left
          ) {
            // 不可见标记数组.push(标记);
            this.hide= true;
          }
          else {this.hide= false}
    }
  },
}
</script>

<style scoped>
.my-handle-class {
  position: absolute;
  background-color: lightskyblue;
  border: 1px solid black;
  border-radius: 50%;
  height: 7px;
  width: 7px;
  box-model: border-box;
  -webkit-transition: all 300ms linear;
  -ms-transition: all 300ms linear;
  transition: all 300ms linear;
  overflow: scroll;
}

.my-handle-class-tl {
  top: -7px;
  left: -7px;
  cursor: nw-resize;
}

.my-handle-class-tm {
  top: -7px;
  left: 50%;
  margin-left: -3.5px;
  cursor: n-resize;
}

.my-handle-class-tr {
  top: -7px;
  right: -7px;
  cursor: ne-resize;
}

.my-handle-class-ml {
  top: 50%;
  margin-top: -3.5px;
  left: -7px;
  cursor: w-resize;
}

.my-handle-class-mr {
  top: 50%;
  margin-top: -3.5px;
  right: -7px;
  cursor: e-resize;
}

.my-handle-class-bl {
  bottom: -7px;
  left: -7px;
  cursor: sw-resize;
}

.my-handle-class-bm {
  bottom: -7px;
  left: 50%;
  margin-left: -3.5px;
  cursor: s-resize;
}

.my-handle-class-br {
  bottom: -7px;
  right: -7px;
  cursor: se-resize;
}

.my-handle-class-tl:hover,
.my-handle-class-tr:hover,
.my-handle-class-bl:hover,
.my-handle-class-br:hover {
  background-color: lightyellow;
  transform: scale(1.4);
}
.el-card {
  width: 100%;
  height: 100%;
}
.my-class {
  position: absolute;
  background-color: none;
  border: none;
}
pre.vditor-reset {
  background-color: transparent !important;
}
</style>