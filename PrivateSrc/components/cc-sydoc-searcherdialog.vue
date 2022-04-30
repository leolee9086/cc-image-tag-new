<template>
  <el-dialog title="发送到思源" :visible.sync="显示发送对话框">
    <cc-sydoc-searcher
      :思源伺服ip="思源伺服ip"
      :apitoken="''"
      :待发送数据="待发送数据"
      @change="显示发送对话框 = false"
    ></cc-sydoc-searcher>
  </el-dialog>
</template>
<script>
module.exports = {
  name: "cc-sydoc-searcherdialog",
  props: ["思源伺服ip", "apitoken", "mode"],
  data() {
    return {
      搜索关键词: "思源",
      搜索结果列表: [],
      待发送数据: {},
      显示发送对话框: false,
    };
  },
  mounted() {
    this.$事件总线.$on("打开发送对话框", this.发送对话框显示);
  },
  methods: {
    发送对话框显示($event) {
      this.显示发送对话框 = true;
      this.待发送数据 = $event;
    },
  },
};
</script>
