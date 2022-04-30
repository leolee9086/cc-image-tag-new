<template>
  <div id="root" ref="root">
    <div
      id="knobcontainer"
      class="knobcontainer"
      ref="knobcontainer"
      v-on:mousedown="开始计算角度()"
    >
      <div id="knobhandler" ref="knobhandler"></div>
      <div id="knobfinger" ref="knobfinger">
        <div></div>
      </div>
    </div>
  </div>
</template>
<script>
module.exports = {
  name: "cc-knob",
  props: ["size", "value"],
  model: { event: "change", prop: "value" },
  mounted() {
    this.$refs.root.style.width = this.size + "px";
    this.$refs.root.style.height = `${this.size}px`;
    this.$refs.knobhandler.style.top = `${this.size * 0.5 - 6}px`;
    this.$refs.knobfinger.style.top = `${this.size * 0.5 - 12 - 0.5}px`;
  },
  data() {
    return {
      角度: "",
      距离: "",
      位移向量: "",
    };
  },
  watch: {
    size(val) {
      this.$refs.root.style.width = val + "px";
      this.$refs.root.style.height = `${val}px`;
      this.$refs.knobhandler.style.top = `${val * 0.5 - 6}px`;
      this.$refs.knobfinger.style.top = `${val * 0.5 - 12 - 0.5}px`;
    },
  },
  methods: {
    开始计算角度() {
      window.document.addEventListener("mousemove", this.计算角度);
      window.document.addEventListener("click", this.移除监听);
    },
    移除监听() {
      window.document.removeEventListener("mousemove", this.计算角度);
      window.document.removeEventListener("click", this.移除监听);
      this.$emit("change", this.角度);
    },
    计算角度: async function (event) {
      event.stopPropagation();
      let 旋钮容器 = this.$refs.knobcontainer;
      let 容器半宽 = 旋钮容器.offsetWidth / 2;
      let 容器半高 = 旋钮容器.offsetHeight / 2;
      let 容器中心点 = {
        x: 旋钮容器.getBoundingClientRect().left + 容器半宽,
        y: 旋钮容器.getBoundingClientRect().top + 容器半高,
      };
      let 鼠标所在点 = { x: event.clientX, y: event.clientY };
      let 角度向量 = { x: 鼠标所在点.x - 容器中心点.x, y: 鼠标所在点.y - 容器中心点.y };
      let 象限 = this.象限判断(角度向量);
      let 角度 = (360 * Math.atan(角度向量.y / 角度向量.x)) / (2 * Math.PI);
      let 弧度 = Math.atan(角度向量.y / 角度向量.x);
      this.角度 = 角度;
      this.距离 = Math.sqrt(Math.pow(角度向量.y, 2) + Math.pow(角度向量.x, 2));
      console.log(弧度);
      let 控制点 = this.$refs.knobhandler;
      let 指针 = this.$refs.knobfinger;
      if (this.距离 > this.size / 2 - 10) {
        let 最大距离 = this.size / 2 - 10;
        角度向量 = { y: 最大距离 * Math.sin(弧度), x: 最大距离 * Math.cos(弧度) };

        switch (象限) {
          case "第一象限":
            角度向量.x = 角度向量.x;
            角度向量.y = 角度向量.y;
            break;
          case "第二象限":
            角度向量.x = -角度向量.x;
            角度向量.y = -角度向量.y;
            break;
          case "第三象限":
            角度向量.x = -角度向量.x;
            角度向量.y = -角度向量.y;
            break;
          case "第四象限":
            角度向量.x = 角度向量.x;
            角度向量.y = 角度向量.y;
            break;
        }
      }
      switch (象限) {
        case "第一象限":
          角度 = 180 + 角度;
          break;
        case "第四象限":
          角度 = 180 + 角度;
          break;
        case "第三象限":
          角度 = 360 + 角度;
          break;
      }
      控制点.style.top = 容器半高 + 角度向量.y - 10 + "px";
      控制点.style.left = 角度向量.x + "px";

      指针.style.transform = `rotate(${角度}deg)`;
      console.log(角度);
      this.角度 = 角度;
      this.位移向量 = 角度向量;
    },
    象限判断(位移向量) {
      let x = 位移向量["x"];
      let y = 位移向量["y"];
      let 象限 = "第一象限";
      if (x > 0 && y > 0) {
        象限 = "第四象限";
      }
      if (x > 0 && y < 0) {
        象限 = "第一象限";
      }
      if (x < 0 && y < 0) {
        象限 = "第二象限";
      }
      if (x < 0 && y > 0) {
        象限 = "第三象限";
      }
      return 象限;
    },
  },
};
</script>
<style scoped>
.knobcontainer {
  padding: 0px;
  margin: 0%;
}
.knobcontainer {
  padding: 0px;
  margin: 0%;
  width: 100%;
  height: 100%;
  border: solid 2px lightblue;
  border-radius: 100%;
  background-color: white;
}
#knobhandler {
  width: 10px;
  height: 10px;
  border: solid 1px;
  border-radius: 100%;
  position: relative;
  margin: auto;
  background-color: white;
  z-index: 255;
}
#knobfinger {
  width: 100%;
  height: 1px;
  position: relative;
  margin: auto;
}
#knobfinger div {
  width: 50%;
  height: 100%;
  background-color: rgb(118, 230, 230);
}
</style>
