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
          <el-input v-model="当前画板命名">
            <span slot="prepend">画板命名</span>
          </el-input>
          <div slot="reference" class="el-icon-setting"></div>
        </el-popover>
        <el-popover trigger="click">
          <el-select
           v-model="当前画板id"
          >
            <el-option
            v-for="(item,i) in this.画板列表"
            :label="item.name||item.id"
            :value="item.id"
            >
            </el-option>
          </el-select>
          <div slot="reference" class="el-icon-folder"></div>
        </el-popover>
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

        <div class="el-icon-help" @click="聚焦到卡片(对象数据)"></div>
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
                      :width="1000"
          >A</div>
          <h3>文字</h3>

          <cc-color-pane 
          v-model="属性对象.color" 
          @change="设定当前标记()" 
          :自定义颜色数组="自定义颜色数组"></cc-color-pane>
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
      对象数据: {},
      自定义颜色数组: [],
      搜索关键词: "",
      搜索结果id: "",
      搜索结果列表: "",
      当前画板id:"",
      画板列表:[],
      当前画板命名:"",
    }
  },
  async mounted() {
    let 画板命名 =  await this.$数据库.metadata.get("name")||"未命名"
    console.log(画板命名)
    this.当前画板命名 = 画板命名.value||画板命名
    this.卡片超链接 = `/widgets/cc-image-tag-new/vditor-card-editor.html?id=${this.对象数据.id}&baseid=${数据源id}`
    this.画板列表 =  await this.$画板元数据库.boards.toArray()
    console.log(this.画板列表)

  },
  watch: {
    当前画板命名:{ handler:async function(val,oldval){
        this.$事件总线.$emit("修改画板元数据",{key:"name",value:val})
      },
    },
    当前画板id:{
      handler:function(val,oldval){
        this.$窗口内打开超链接(`/widgets/cc-image-tag-new/?baseid=${val}`)
      },
    },
    卡片数据id: {
      handler: async function (val, oldval) {
        if (val && val != oldval) {
          this.对象数据 = await this.$数据库.cards.get(this.卡片数据id)
          this.属性对象 = this.对象数据.attrs
          this.卡片超链接 = `/widgets/cc-image-tag-new/vditor-card-editor.html?id=${this.对象数据.id}&baseid=${数据源id}&table=cards`
        }
      }
    },
    链接数据id:{
      handler: async function (val, oldval) {
        if (val && val != oldval) {
          this.对象数据 = await this.$数据库.links.get(this.链接数据id)
          this.属性对象 = this.对象数据.attrs
          this.卡片超链接 = `/widgets/cc-image-tag-new/vditor-card-editor.html?id=${this.对象数据.id}&baseid=${数据源id}&table=cards`
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
    聚焦到卡片: function (对象数据) {
      this.$事件总线.$emit("定位至卡片", 对象数据)
      setTimeout(() => {
        let el = document.querySelector(`[data-node-id='${对象数据.id}']`)
        let style = el.getAttribute("style")
        el.setAttribute("style", style+"border:solid 5px lightblue")
        setTimeout(() => {
        let el = document.querySelector(`[data-node-id='${对象数据.id}']`)

        el.setAttribute("style",style)
      }, 500);

      }, 500);
      
    },
    添加卡片:function(){
      let 卡片数据 = this.$根据属性生成卡片() 
      卡片数据.attrs.top= (window.pageYOffset + window.innerHeight/2-50)/this.$当前窗口状态.缩放倍数,
      卡片数据.attrs.left= (window.pageXOffset + window.innerWidth/2-50)/this.$当前窗口状态.缩放倍数,
      this.$事件总线.$emit("添加卡片",卡片数据)
    },
    设定当前标记: function () {
      let 上传数据 = { "id": "", "styles": {} }
      上传数据.id = this.对象数据.id
      上传数据["styles"].color = this.属性对象.color
      上传数据["styles"].borderColor = this.属性对象.borderColor
      上传数据["styles"].backgroundColor = this.属性对象.backgroundColor
      if (this.对象数据.type=="card"){
      this.$事件总线.$emit("保存卡片", 上传数据)}
       if (this.对象数据.type=="link"){
      this.$事件总线.$emit("保存链接", 上传数据)}
    },

    搜索: async function () {
      let 关键词 = this.搜索关键词
      if (关键词) {
        this.搜索结果列表 = await
          this.$数据库.cards
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
        this.搜索结果列表 = await this.$数据库.cards.toArray()
      }
              console.log("搜索结果",this.搜索结果列表)

    }

  },
  computed: {}
}
</script>