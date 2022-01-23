<template>
  <div class="drawer-button-container right">
    <div class="drawer-button">
      <span
        @click="当前面板名 != '详情' ? (当前面板名 = '详情') : (当前面板名 = '')"
        circle
        class="el-icon-edit"
        aria-label="展开|关闭面板"
      >
      </span>
    </div>
  </div>
</template>
<script>
module.exports = {
  name: "cc-toolbar-trigger",
  props: ["tooltip", "value", "prop", "position"],
  data() {
    return {
      flag: false,
    };
  },
  mounted() {
    this.flag = this.value;
  },
  methods: {
    点击回调() {
      this.flag = !this.flag;
      this.$emit("change", this.flag);
    },
  },
};
</script>
<style></style>
