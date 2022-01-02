<template>
  <vue-draggable-resizable
    v-if="false"
    ref="container"
    :resizable="false"
    :draggable="true"
    :y="0"
    :w="100"
    :h="100"
    :x="0"
    :z="600"
    class-name-handle="resizer"
    class-name="cc-card-combo-container"
  >
    <div class="cc-card-combo-drawer"></div>
  </vue-draggable-resizable>
</template>
<script>
module.exports = {
  name: "cc-dragable-block-combo",
  props: ["卡片集合"],
  data() {
    return {
      卡片集合获取器: "",
      卡片集合订阅器: "",
      数据数组: [],
    };
  },
  mounted() {
    this.$事件总线.$on("选集变化", ($event) => (this.数据数组 = $event));
    this.$事件总线.$on("保存卡片", ($event) => (this.计算数据坐标 = $event));
  },
  watch: {
    数据数组: {
      handler(val) {
        console.log("当前选集", val);
      },
      deep: true,
    },
  },
  methods: {},
};
</script>
