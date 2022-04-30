<template>
  <span
    data-ref="链接id"
    v-on:mouseover="打开浮窗($event)"
    v-on:mouseout="鼠标在链接内 = false"
  >
    <span class="link" @click="窗口内打开(链接id)">{{
      最大文字长度 && 锚文本
        ? 锚文本.slice(0, 最大文字长度)
        : 锚文本 || 最大文字长度
        ? 链接锚文本.slice(0, 最大文字长度)
        : 链接锚文本
    }}</span>
  </span>
</template>
<script>
module.exports = {
  mounted: function () {
    let that = this;
    that.解析思源块链接(that.链接id);
    setInterval(that.移动浮窗, 100);
  },
  props: ["链接id", "锚文本", "最大文字长度"],
  data() {
    return {
      链接锚文本: "等待获取",
      思源伺服ip: this.$思源伺服ip,
      apitoken: this.$apitoken,
      思源主界面: this.$主界面,
      开始移动浮窗: false,
      X: "",
      Y: "",
      鼠标在链接内: false,
    };
  },
  watch: {
    链接id(val) {
      this.解析思源块链接(val);
    },
  },
  methods: {
    移动浮窗: function () {
      let that = this;
      if (that.开始移动浮窗) {
        let id = that.链接id;
        if (id) {
          id = id.replace("((", "").replace("))", "");
          let panel = that.思源主界面.querySelector(`.block__popover[data-oid="${id}"]`);
          if (panel) {
            panel.style.top = that.Y + 16 + "px";
            panel.style.left = that.X - (panel.offsetWidth / 2 || 0) + "px";
            panel.style.display = "block";
            that.开始移动浮窗 = false;
          }
        }
      }
    },
    获取元素绝对坐标(element) {
      element = element
        ? element
        : window.frameElement.parentElement || window.frameElement;
      var result = { left: element.offsetLeft, top: element.offsetTop };
      element.offsetParent ? (element = element.offsetParent) : null;
      while (element) {
        result["left"] += element.offsetLeft;
        result["top"] += element.offsetTop;
        element = element.offsetParent;
      }
      return result;
    },
    获取元素视图坐标(element) {
      let that = this;
      var scrollTop = that.获取文档元素(this.$挂件自身元素()).scrollTop;
      var scrollLeft = that.获取文档元素(this.$挂件自身元素()).scrollLeft;
      var absolutePosi = this.获取元素绝对坐标(element);
      var Viewport = {
        X: absolutePosi.left - scrollLeft,
        Y: absolutePosi.top - scrollTop,
      };
      return Viewport;
    },
    获取文档元素(element) {
      let docElement = {};
      while (element.className != "protyle-content" && element) {
        element = element.parentElement;
      }
      docElement = element;
      return docElement;
    },
    打开浮窗: function ($event) {
      let that = this;
      this.开始移动浮窗 = true;
      this.鼠标在链接内 = true;
      if (!this.$挂件模式()) {
        return null;
      }
      let 挂件自身元素 =
        that.$root.挂件自身元素 || window.frameElement || window.document.body;
      let 挂件坐标 = 挂件自身元素
        ? that.获取元素视图坐标(挂件自身元素)
        : that.获取元素视图坐标(window.frameElement);
      that["X"] = $event.clientX + 挂件坐标.X;
      that["Y"] = $event.clientY + 挂件坐标.Y;
      if (that.鼠标在链接内) {
        let id = that.链接id;
        id = id.replace("((", "").replace("))", "");
        let 虚拟链接 = that.思源主界面.createElement("span");
        虚拟链接.setAttribute("data-type", "block-ref");
        虚拟链接.setAttribute("data-id", id);
        let 临时目标 = that.思源主界面.querySelector(
          ".protyle-wysiwyg div[data-node-id] div[contenteditable]"
        );
        // console.log(临时目标)
        临时目标.appendChild(虚拟链接);
        虚拟链接.style.position = "fixed";
        let 挂件坐标 = that.获取元素绝对坐标(that.$root.挂件自身元素);
        虚拟链接.style.top = $event.clientY + 挂件坐标.Y;
        虚拟链接.style.left = $event.clientX + 挂件坐标.X;
        let 点击事件 = that.思源主界面.createEvent("MouseEvents");
        点击事件.initMouseEvent(
          "mouseover",
          true,
          false,
          window.parent,
          1,
          100,
          100,
          100,
          100,
          false,
          false,
          false,
          false,
          0,
          null
        );
        setTimeout(() => {
          虚拟链接.dispatchEvent(点击事件);
          虚拟链接.remove();
        }, 300);
      }
    },
    窗口内打开: function (id) {
      let that = this;
      if (id) {
        id = id.replace("((", "").replace("))", "");
        that.$窗口内打开思源块(id);
      }
      /*let 虚拟链接 =  that.思源主界面.createElement("span")
                虚拟链接.setAttribute("data-type","block-ref")
                虚拟链接.setAttribute("data-id",id)
                let 临时目标 = that.思源主界面.querySelector(".protyle-wysiwyg div[data-node-id] div[contenteditable]")
               // console.log(临时目标)
                临时目标.appendChild(虚拟链接)
                let 点击事件 =  that.思源主界面.createEvent('MouseEvents')
                点击事件.initMouseEvent('click', true, false, window, 0, 0, 0, 0, 0, false, false, false, false, 0, null);
                虚拟链接.dispatchEvent(点击事件);
                虚拟链接.remove()*/
    },
    解析思源块链接: async function (链接id) {
      let that = this;
      if (链接id) {
        that.链接锚文本 = await 获取思源块链接锚文本(
          that.思源伺服ip || window.location.host,
          that.apitoken,
          链接id
        );
        return that.链接锚文本;
      }
    },
  },
};
</script>
<style scoped>
.link:hover {
  color: lightskyblue;
}
</style>
