<template>
  <vue-draggable-resizable
    v-if="显示 && 数据id数组[1]"
    ref="container"
    :resizable="false"
    :draggable="false"
    :y="y"
    :w="width || 100"
    :h="height || 100"
    :x="x"
    :z="600"
    class-name-handle="resizer"
    class-name="cc-card-combo-container"
  >
    <div class="cc-card-combo-drawer"></div>
    <div
      class="cc-card-toolbar combo"
      :style="`
      
      transform:scale(${窗口缩放倍数}) 
      `"
    >
      <span :aria-label="`选中了${数据数组.length}个元素`">{{ 数据数组.length }}</span>
      <span
        @click="统一属性('left')"
        size="mini"
        circle
        class="el-icon-leftalign"
        aria-label="向左对齐元素"
      ></span>
      <span
        @click="统一属性('right')"
        size="mini"
        circle
        class="el-icon-rightalign"
        aria-label="向右对齐元素"
      ></span>
      <span
        @click="统一属性('up')"
        size="mini"
        circle
        class="el-icon-upalign"
        aria-label="向上对齐元素"
      ></span>
      <span
        @click="统一属性('down')"
        size="mini"
        circle
        class="el-icon-downalign"
        aria-label="向下对齐元素"
      ></span>
    </div>
  </vue-draggable-resizable>
</template>
<script>
module.exports = {
  name: "cc-dragable-block-combo",
  props: ["卡片集合", "窗口缩放倍数"],
  data() {
    return {
      卡片集合获取器: "",
      卡片集合订阅器: "",
      数据id数组: [],
      数据数组: [],
      width: 100,
      height: 100,
      x: -200,
      y: -200,
      显示: false,
    };
  },
  mounted() {
    this.$事件总线.$on("选集变化", ($event) => (this.数据id数组 = $event));
    this.$事件总线.$on("保存卡片", ($event) => this.判断id($event));
    this.$事件总线.$on("保存链接", ($event) => this.判断id($event));
    this.$事件总线.$on("移动卡片", ($event) => this.判断id($event));
    this.$事件总线.$on("窗口缩放", ($event) => this.计算边界框($event));
    this.$事件总线.$on("定位至卡片", ($event) => this.计算边界框($event));
  },
  watch: {
    数据id数组: {
      handler(val) {
        //console.log("当前选集", val.length);
        val[0] ? (this.显示 = true) : (this.显示 = false);

        if (val.length > 1) {
          this.获取数据();
        }
      },
      deep: true,
    },
    窗口缩放倍数: {
      handler(val) {
        //console.log("当前选集", val.length);
        this.计算边界框();
      },
    },
  },
  methods: {
    统一属性: function (参数) {
      if (参数 == "left") {
        for (i in this.数据数组) {
          let 现状数据 = this.数据数组[i];
          if (现状数据.type == "card") {
            现状数据.attrs.left = this.x;
            现状数据 = this.$更新数据时间戳(现状数据);
            this.数据数组[i] = 现状数据;
          } else {
            现状数据.attrs.offsetx = this.x - 现状数据.attrs.left;
            现状数据 = this.$更新数据时间戳(现状数据);
            this.数据数组[i] = 现状数据;
          }
        }
      }

      if (参数 == "right") {
        for (i in this.数据数组) {
          let 现状数据 = this.数据数组[i];
          if (现状数据.type == "card") {
            现状数据.attrs.left = this.x + this.width - 现状数据.attrs.width;
            现状数据 = this.$更新数据时间戳(现状数据);
            this.数据数组[i] = 现状数据;
          } else {
            现状数据.attrs.offsetx =
              this.x + this.width - 现状数据.left - 现状数据.attrs.width;
            现状数据 = this.$更新数据时间戳(现状数据);
            this.数据数组[i] = 现状数据;
          }
        }
      }
      if (参数 == "up") {
        for (i in this.数据数组) {
          let 现状数据 = this.数据数组[i];
          if (现状数据.type == "card") {
            现状数据.attrs.top = this.y;
            现状数据 = this.$更新数据时间戳(现状数据);
            this.数据数组[i] = 现状数据;
          } else {
            现状数据.attrs.offsetx = this.y - 现状数据.attrs.top;
            现状数据 = this.$更新数据时间戳(现状数据);
            this.数据数组[i] = 现状数据;
          }
        }
      }
      if (参数 == "down") {
        for (i in this.数据数组) {
          let 现状数据 = this.数据数组[i];
          if (现状数据.type == "card") {
            现状数据.attrs.top = this.y + this.height - 现状数据.attrs.height;
            现状数据 = this.$更新数据时间戳(现状数据);
            this.数据数组[i] = 现状数据;
          } else {
            现状数据.attrs.offsetx =
              this.y + this.height - 现状数据.top - 现状数据.attrs.height;
            现状数据 = this.$更新数据时间戳(现状数据);
            this.数据数组[i] = 现状数据;
          }
        }
      }
      for (i in this.数据数组) {
        let 数据 = this.数据数组[i];
        try {
          let 数据类型 = 数据.type + "s";
          this.$数据库[数据类型].put(数据).then(() => {
            if (数据类型 == "cards") {
              this.$事件总线.$emit("保存卡片", 数据);
            }
            if (数据类型 == "links") {
              this.$事件总线.$emit("保存链接", 数据);
            }
          });
        } catch (e) {
          console.log(e);
        }
      }
    },

    判断id: function ($event) {
      if ($event && this.数据id数组.length > 1) {
        this.数据数组.forEach((element) => {
          if (element && element.id == $event.id) {
            element = $event;
            this.计算边界框();
          }
        });
      }
    },

    获取数据: async function () {
      let 数据数组 = [];
      for (i in this.数据id数组) {
        if (this.数据id数组[i]) {
          let 原始数据 = this.数据id数组[i];
          let 现状数据 = (await this.$数据库.cards.get(原始数据.id)) || 原始数据;
          现状数据 = (await this.$数据库.links.get(原始数据.id)) || 现状数据;
          数据数组.push(现状数据);
        }
      }
      this.数据数组 = Array.from(new Set(数据数组));
      this.计算边界框();
    },
    计算边界框: function () {
      let 左上角点 = { x: 10000000000, y: 100000000000 };
      let 右下角点 = { x: 0, y: 0 };
      if (this.数据数组.length == this.数据id数组.length) {
        //console.log(this.数据数组);

        数据 = {};
        for (i = 0; i < this.数据数组.length; i++) {
          数据 = this.数据数组[i];
          if (数据) {
            let 属性数据 = 数据.attrs;
            let bottom = 属性数据.top + 属性数据.height;
            let right = 属性数据.left + 属性数据.width;
            bottom > 右下角点.y ? (右下角点.y = bottom) : null;
            right > 右下角点.x ? (右下角点.x = right) : null;
            属性数据.top < 左上角点.y ? (左上角点.y = 属性数据.top) : null;
            属性数据.left < 左上角点.x ? (左上角点.x = 属性数据.left) : null;
          }
        }
        this.x = 左上角点.x * this.窗口缩放倍数 - 10;
        this.y = 左上角点.y * this.窗口缩放倍数 - 10;
        this.width = (右下角点.x - 左上角点.x) * this.窗口缩放倍数 + 20;
        this.height = (右下角点.y - 左上角点.y) * this.窗口缩放倍数 + 20;
        // console.log(this.x, this.y, this.width, this.height);
      }
    },
  },
};
</script>
