<template>
  <div
    role="tooltip"
    v-if="当前提示内容"
    class="tooltip"
    :style="`position:fixed;left:${当前鼠标坐标.x + 10}px;top: ${
      当前鼠标坐标.y + 10
    }px;z-index:20000`"
  >
    {{ 当前提示内容 }}
  </div>
</template>
<script>
module.exports = {
  name: "cc-tooltip",
  props: ["当前鼠标坐标"],
  data() {
    return {
      当前提示内容: "",
      显示提示: false,
    };
  },
  mounted() {
    this.$事件总线.$on("显示提示", ($event) => this.开始显示提示($event));
    this.$事件总线.$on("提示内容改变", this.提示内容改变);
    this.$事件总线.$on("隐藏提示", this.隐藏提示);
    window.document.addEventListener("mouseover", ($event) => this.读取提示($event));
    window.document.addEventListener("mouseout", this.隐藏提示);
  },
  methods: {
    读取提示($event) {
      if ($event.target.getAttribute("aria-label")) {
        this.当前提示内容 = $event.target.getAttribute("aria-label");
      } else if ($event.target.parentElement) {
        if ($event.target.parentElement.getAttribute("aria-label")) {
          try {
            this.当前提示内容 = $event.target.parentElement.getAttribute("aria-label");
          } catch (error) {}
        } else if ($event.target.parentElement.parentElement) {
          this.当前提示内容 = $event.target.parentElement.parentElement.getAttribute(
            "aria-label"
          );
        }
      }
    },
    开始显示提示($event) {
      //  console.log("显示提示")
      this.当前提示内容 = $event;
      this.显示提示 = true;
    },
    提示内容改变($event) {
      this.当前提示内容 = $event;
    },
    隐藏提示($event) {
      this.当前提示内容 = "";
      this.显示提示 = false;
    },
  },
};
</script>
