<template>
  <div id="dock" class="layout">
    <cc-toolbar-edit :卡片数据id="当前卡片数据id" :链接数据id="当前链接数据id"></cc-toolbar-edit>
    <cc-toolbar-infor v-if="当前卡片数据id" :卡片数据id="当前卡片数据id"></cc-toolbar-infor>
    <cc-toolbar-view></cc-toolbar-view>
  </div>
</template>
<script>
module.exports = {
  name: "cc-layers-toolbar",
  props: [],
  components: {
    "cc-toolbar-edit": "url:../components/cc-toolbar-edit.vue",
    "cc-toolbar-infor": "url:../components/cc-toolbar-infor.vue",
    "cc-toolbar-view": "url:../components/cc-toolbar-view.vue"

  },
  data() {
    return {
      窗口状态数组: [],
      操作历史数组: [],
      当前卡片数据id: "",
      当前链接数据id: "",
      窗口状态获取器: {},
      操作历史获取器: {},
    }
  },
  async mounted() {
    this.窗口状态获取器 = liveQuery(
      () => this.$数据库.states.toArray()
    ).subscribe(
      {
        next: result => {
          this.窗口状态数组 = result
        }
      }
    )
  },
  watch: {
    窗口状态数组: {
      handler(val, oldval) {
        let 最近窗口状态 = val[val.length - 1]
        if (最近窗口状态) {
          this.当前卡片数据id = 最近窗口状态["current_cardid"]
          this.当前链接数据id = 最近窗口状态["current_linkid"]
        }
        else {
          this.当前卡片数据id = ""
          this.当前链接数据id = ""
        }
        console.log("当前卡片", this.当前卡片数据id)
        console.log("当前链接", this.当前链接数据id)
      }
    }
  }
}

</script>
<style scoped>
.front {
  z-index: 300;
}
</style>