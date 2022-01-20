<template>
  <vue-draggable-resizable
    v-if="显示 && 数据数组[1]"
    ref="container"
    :resizable="false"
    :y="y - 10"
    :w="width + 20 || 100"
    :h="height + 20 || 100"
    :x="x - 10"
    :z="600"
    @dragging="dragging"
    class-name-handle="resizer"
    class-name="cc-card-combo-container"
  >
    <div class="cc-card-combo-drawer" aria-label="拖动同步移动卡片"></div>
    <div
      v-if="数据数组[1] && 卡片.attrs"
      v-for="卡片 in 数据数组"
      :style="`
      position:absolute;
      top:${(卡片.attrs.top + 卡片.attrs.offsety) * 窗口缩放倍数 - y + 5}px;
      left:${(卡片.attrs.left + 卡片.attrs.offsetx) * 窗口缩放倍数 - x + 5}px;
      width:${卡片.attrs.width * 窗口缩放倍数 + 5}px;
      height:${卡片.attrs.height * 窗口缩放倍数 + 5}px;
      
      `"
    >
      <div class="cc-card-combo-drawer"></div>
    </div>
    <div
      v-if="数据数组[1]"
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
      <span
        @click="统一属性('width')"
        size="mini"
        circle
        class="el-icon-width"
        aria-label="统一宽度"
      ></span>
      <span
        @click="统一属性('height')"
        size="mini"
        circle
        class="el-icon-height"
        aria-label="统一高度"
      ></span>
      <span
        @click="统一属性('xspace')"
        size="mini"
        circle
        class="el-icon-xspace"
        aria-label="横向分布"
      ></span>
      <span
        @click="统一属性('yspace')"
        size="mini"
        circle
        class="el-icon-yspace"
        aria-label="竖向分布"
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
      移动距离x: 0,
      移动距离y: 0,
    };
  },
  mounted() {
    this.$事件总线.$on("选集增加", ($event) => this.增加数据($event));
    this.$事件总线.$on("清理选择", this.清理选择);
    this.$事件总线.$on("清理选集", this.清理选择);

    this.$事件总线.$on("保存卡片", ($event) => this.判断id($event));
    this.$事件总线.$on("保存链接", ($event) => this.判断id($event));
    this.$事件总线.$on("保存数据", ($event) => this.判断id($event));
    this.$事件总线.$on("窗口缩放", ($event) => this.计算边界框($event));
    this.$事件总线.$on("定位至卡片", ($event) => this.计算边界框($event));
  },
  watch: {
    窗口缩放倍数: {
      handler(val) {
        //console.log("当前选集", val.length);
        this.计算边界框();
      },
    },
    x(val, oldval) {
      if (val && oldval) {
        this.移动距离x = val - oldval;
      }
    },
    y(val, oldval) {
      if (val && oldval) {
        this.移动距离y = val - oldval;
      }
    },
  },
  methods: {
    统一属性: async function (参数) {
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
              this.x + this.width - 现状数据.attrs.left - 现状数据.attrs.width;
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
            现状数据.attrs.offsety = this.y - 现状数据.attrs.top;
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
            现状数据.attrs.offsety =
              this.y + this.height - 现状数据.attrs.top - 现状数据.attrs.height;
            现状数据 = this.$更新数据时间戳(现状数据);
            this.数据数组[i] = 现状数据;
          }
        }
      }
      if (参数 == "width" || 参数 == "height") {
        let 当前数据id =
          this.$当前窗口状态.current_cardid || this.$当前窗口状态.current_linkid;
        当前数据 =
          (await this.$数据库.cards.get(当前数据id)) ||
          (await this.$数据库.links.get(当前数据id));
        for (i in this.数据数组) {
          let 现状数据 = this.数据数组[i];
          现状数据.attrs[参数] = 当前数据.attrs[参数];
        }
      }
      if (参数 == "xspace" || 参数 == "yspace") {
        let 长度属性 = 参数 == "xspace" ? "width" : "height";
        let 坐标属性 = 参数 == "xspace" ? "left" : "top";
        let 偏移属性 = 参数 == "xspace" ? "offsetx" : "offsety";
        let 总宽度 = this[长度属性];
        this.数据数组 = this.数据数组.sort(function (a, b) {
          return a.attrs[坐标属性] - b.attrs[坐标属性];
        });
        let 总卡片宽度 = 0;

        for (i = 0; i < this.数据数组.length; i++) {
          总卡片宽度 = 总卡片宽度 + this.数据数组[i].attrs[长度属性];
        }
        let 总空隙宽度 = 总宽度 - 总卡片宽度;
        let 间隔宽度 = 总空隙宽度 / (this.数据数组.length - 1);
        for (i = 0; i < this.数据数组.length; i++) {
          if (!i == 0) {
            this.数据数组[i].attrs[坐标属性] =
              this.数据数组[i - 1].attrs[坐标属性] +
              this.数据数组[i - 1].attrs[长度属性] +
              间隔宽度;
          }
        }
      }

      for (i in this.数据数组) {
        let 数据 = this.数据数组[i];
        try {
          let 数据类型 = 数据.type + "s";
          //console.log(数据类型);
          if (!数据.attrs.trashed && !数据.attrsproxy) {
            await this.$数据库[数据类型].put(数据).then(() => {
              this.$事件总线.$emit("保存数据", 数据);
            });
          }
        } catch (e) {
          console.log(e);
        }
      }
    },

    判断id: function ($event) {
      let 数据数组 = JSON.parse(JSON.stringify(this.数据数组));

      if ($event && 数据数组[0]) {
        for (i = 0; i < 数据数组.length; i++) {
          let element = 数据数组[i];
          if (
            element &&
            element.id == $event.id &&
            element.updated <= $event.updated &&
            $event.attrs &&
            !数据.attrs.trashed
          ) {
            数据数组[i] = $event;
          }
        }
      }
      this.数据去重(数据数组);
    },
    清理选择: function () {
      this.显示 = false;
      this.数据数组 = [];
    },
    增加数据: function ($event) {
      let 数据数组 = JSON.parse(JSON.stringify(this.数据数组));
      数据数组.push($event);
      this.数据去重(数据数组);
    },
    数据去重: function (待去重数组) {
      this.数据数组 = [];
      for (i = 0; i < 待去重数组.length; i++) {
        let flag = true;
        if (!待去重数组[i]) {
          flag = false;
        } else {
          for (j = 0; j < this.数据数组.length; j++) {
            if (this.数据数组[j].id == 待去重数组[i].id) {
              flag = false;
            }
          }
        }
        if (flag) {
          this.数据数组.push(待去重数组[i]);
        }
      }
      if (!this.数据数组[0]) {
        return null;
      }
      this.计算边界框();
      this.显示 = true;
    },
    计算边界框: function () {
      //console.log(this.数据数组);
      if (!this.数据数组) {
        return null;
      }
      let 左上角点 = { x: 10000000000, y: 100000000000 };
      let 右下角点 = { x: 0, y: 0 };

      //console.log(this.数据数组);

      数据 = {};
      for (i = 0; i < this.数据数组.length; i++) {
        数据 = this.数据数组[i];
        if (数据 && 数据.attrs) {
          let 属性数据 = 数据.attrs;
          let bottom = 属性数据.top + 属性数据.height + 属性数据.offsety;
          let right = 属性数据.left + 属性数据.width + 属性数据.offsetx;
          bottom > 右下角点.y ? (右下角点.y = bottom) : null;
          right > 右下角点.x ? (右下角点.x = right) : null;
          属性数据.top + 属性数据.offsety < 左上角点.y
            ? (左上角点.y = 属性数据.top + 属性数据.offsety)
            : null;
          属性数据.left + 属性数据.offsetx < 左上角点.x
            ? (左上角点.x = 属性数据.left + 属性数据.offsetx)
            : null;
        }
      }
      if (左上角点.x * this.窗口缩放倍数 - 10 > 100000) {
        this.显示 = false;

        return null;
      }
      this.x = 左上角点.x * this.窗口缩放倍数 || this.x;
      this.y = 左上角点.y * this.窗口缩放倍数 || this.y;
      this.width = (右下角点.x - 左上角点.x) * this.窗口缩放倍数 || this.width;
      this.height = (右下角点.y - 左上角点.y) * this.窗口缩放倍数 || this.width;
    },
    dragging: function (x, y) {
      let 窗口缩放倍数 = this.窗口缩放倍数;

      if (!this.数据数组) {
        return null;
      }
      // console.log(1, x, y);
      // console.log(2, this.x, this.y);
      let 移动距离y = (y - this.y) / 窗口缩放倍数;
      let 移动距离x = (x - this.x) / 窗口缩放倍数;
      // console.log(3, 移动距离x, 移动距离y);

      this.数据数组.forEach((数据) => {
        if (数据 && 数据.attrs) {
          let attrs = 数据.attrs;
          let { top, left, offsetx, offsety } = attrs;
          let 数据类型 = 数据.type;
          if (数据类型 == "card") {
            // console.log(4, 移动距离x, 移动距离y);
            // console.log(5, 数据.attrs.left, 数据.attrs.top);

            数据.attrs.top = 数据.attrs.top + 移动距离y + 10;
            数据.attrs.left = 数据.attrs.left + 移动距离x + 10;
            // console.log(6, 数据.attrs.left, 数据.attrs.top);
          } else {
            数据.attrs.offsetx = 数据.attrs.offsetx + 移动距离y + 10;
            数据.attrs.offsety = 数据.attrs.offsety + 移动距离x + 10;
          }
          // console.log(7, 数据.attrs.top, 数据.attrs.left);
        }
      });
      移动距离x = 0;
      移动距离y = 0;
      this.x = x;
      this.y = y;
      this.数据数组.forEach((数据) => this.$事件总线.$emit("保存数据", 数据));
    },
  },
};
</script>
