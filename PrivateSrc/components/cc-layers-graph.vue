<template>
  <div  class="layer layer-graph" :style="`position: absolute; width: ${窗口大小.width}px; height: ${窗口大小.height}px;z-index:11`"
>
    <div>
      <svg
        ref="background"
        :style="`position: absolute; width: ${窗口大小.width}px; height: ${窗口大小.height}px;z-index:11`"
        :width="窗口大小.width"
        :height="窗口大小.height"
        xmlns="http://www.w3.org/2000/svg"
      >
        <defs>
          <marker
            id="markerArrowTo"
            markerWidth="40"
            markerHeight="40"
            refX="10"
            refY="6"
            orient="auto"
          >
            <path d="M2,2 L2,11 L10,6 L2,2" style="fill:black" />
          </marker>
          <marker
            id="markerArrowFrom"
            markerWidth="40"
            markerHeight="40"
            refX="2"
            refY="6"
            orient="auto"
          >
            <path d="M2,2 L2,11 L10,6 L2,2" style="fill:black" />
          </marker>
        </defs>
        <cc-graph-link-path v-for="(link,i) in links" :link="link" />
        <cc-graph-vertrualpath  v-if="显示虚拟连接" :虚拟起始标记="虚拟起始标记" :虚拟结束标记="虚拟结束标记"/>

      </svg>
              <cc-graph-link-label v-for="(link,i) in links" :link="link" ></cc-graph-link-label>

    </div>

    
  </div>
</template>
<script>
module.exports = {
  name: "cc-layer-graph",
  props: ["窗口大小", "tags"],
  components: {
    "cc-color-pane": "url:/widgets/cc-baselib/components/cc-color-pane.vue",
    "cc-graph-link-path": "url:../components/cc-graph-link-path.vue",
    "cc-graph-link-label": "url:../components/cc-graph-link-label.vue"

  },
  data() {
    return {
      links: "",
      数组获取器: "",
      数组订阅器: "",
      显示虚拟连接:"",
    }
  },
  async mounted() {
    this.数组获取器 = liveQuery(
      () => this.$数据库.links
        .toArray()
    )
    let that = this
    // this.数组获取器 =function(){that.$数据库.tags.toArray(array=>{that.卡片数组=array})}
    this.数组订阅器 = this.数组获取器.subscribe(
      { next: result => this.links = result }
    )
    this.$事件总线.$on("开始连接",this.显示虚拟连接)
  },
  methods: {
    显示虚拟连接(){
      this.虚拟连接={}
      let 虚拟连接 = this.虚拟连接
      虚拟连接.from_id = this.$数据库.get
    }
  }
}
</script>