<template>
  <v-group>
    <v-path v-if="链接['attrs']" :config="链接设定"></v-path>
    <v-path v-if="链接['attrs'] && 显示引线" :config="引线设定"></v-path>
    <v-image v-if="链接['attrs'] && 结束节点图片元素" :config="结束节点设定"> </v-image>

    <v-image v-if="链接['attrs'] && 起始节点图片元素" :config="起始节点设定"> </v-image>
  </v-group>
</template>
<script>
module.exports = {
  name: "cc-graph-link-path-konva",
  props: ["link", "画布原点", "虚拟起始标记", "虚拟结束标记"],
  async mounted() {
    this.链接 = JSON.parse(JSON.stringify(this.link));
    this.监听 = true;
    this.$事件总线.$on("保存卡片", (event) => this.判断id(event));
    this.$事件总线.$on("保存链接", (event) => this.判断id(event));
    this.$事件总线.$on("窗口缩放", (event) => (this.缩放倍数 = event));
    this.代理起始标记 = await this.$数据库.cards.get(this.链接.attrs.from_id);
    this.代理结束标记 = await this.$数据库.cards.get(this.链接.attrs.to_id);

    this.加载节点图片(this.起始节点图片, "起始节点图片元素");
    this.加载节点图片(this.结束节点图片, "结束节点图片元素");

    this.计算路径();
  },
  beforeDestroy() {
    this.监听 = false;
  },
  data() {
    return {
      链接: {},
      路径: "",
      width: 0,
      代理起始标记: {},
      代理结束标记: {},
      timer: "",
      监听: false,
      显示引线: "",
      引线路径: {},
      路径线段: {},
      起点: {},
      终点: {},
      中点: {},
      路径类型: "",
      缩放倍数: this.$当前窗口状态.缩放倍数 || 1,
      真实画布原点: "",

      起始节点图片: "./PrivateSrc/icon/arrow1.png",
      起始节点图片元素: null,
      起点标记大小: 30,
      起点标记自动旋转: true,

      结束节点图片元素: null,
      结束节点图片: "./PrivateSrc/icon/arrow1.png",
      终点标记大小: 30,
      终点标记自动旋转: true,
    };
  },
  computed: {
    结束节点偏移: function () {
      let obj = {};
      if (this.代理结束标记.attrs) {
        obj = this.计算节点标志偏移(
          this.终点,
          this.起点,
          this.代理结束标记.attrs,
          this.终点标记大小,
          this.终点标记自动旋转
        );
      }
      return obj;
    },
    起始节点偏移: function () {
      let obj = {};

      obj.x = 0 - (this.结束节点偏移.x * this.起点标记大小) / this.终点标记大小;
      obj.y = 0 - (this.结束节点偏移.y * this.起点标记大小) / this.终点标记大小;
      obj.rotation = this.结束节点偏移.rotation + 180;
      return obj;
    },
    起始节点设定: function () {
      let realX =
        this.起点.x * this.缩放倍数 -
        this.真实画布原点.x -
        this.起始节点偏移.x * this.缩放倍数;

      let offsetY = this.真实画布原点.y || 0;
      return {
        x: realX,
        y: this.起点.y * this.缩放倍数 - offsetY - this.起始节点偏移.y * this.缩放倍数,
        offsetX: (this.起点标记大小 / 2) * this.缩放倍数,
        offsetY: (this.起点标记大小 / 2) * this.缩放倍数,
        width: this.起点标记大小 * this.缩放倍数,
        height: this.起点标记大小 * this.缩放倍数,

        image: this.起始节点图片元素,
        rotation: this.起始节点偏移.rotation,
      };
    },
    结束节点设定: function () {
      let realX =
        this.终点.x * this.缩放倍数 -
        this.真实画布原点.x -
        this.结束节点偏移.x * this.缩放倍数;
      if (!realX) {
        console.log(this.终点.x, this.缩放倍数, this.真实画布原点.x, this.结束节点偏移.x);
      }
      let offsetY = this.真实画布原点.y;
      // console.log(this.终点标记大小, this.起点标记大小);
      return {
        x: realX,
        y: this.终点.y * this.缩放倍数 - offsetY - this.结束节点偏移.y * this.缩放倍数,
        offsetX: (this.终点标记大小 / 2) * this.缩放倍数,
        offsetY: (this.终点标记大小 / 2) * this.缩放倍数,
        width: this.终点标记大小 * this.缩放倍数,
        height: this.终点标记大小 * this.缩放倍数,
        image: this.结束节点图片元素,
        rotation: this.结束节点偏移.rotation,
      };
    },
    链接设定: function () {
      return {
        offsetX: this.真实画布原点.x / this.缩放倍数,
        offsetY: this.真实画布原点.y / this.缩放倍数,
        data: this.路径.d,
        stroke:
          this.链接["attrs"]["path_color"] ||
          this.链接["attrs"]["borderColor"] ||
          "black",
        strokeWidth: this.链接["attrs"]["path_width"],
        fill: "transparent",
        scaleX: this.缩放倍数,
        scaleY: this.缩放倍数,
      };
    },
    引线设定: function () {
      let 引线 = {
        offsetX: this.真实画布原点.x / this.缩放倍数,
        offsetY: this.真实画布原点.y / this.缩放倍数,
        data: this.引线路径.d,
        stroke:
          this.链接["attrs"]["path_color"] ||
          this.链接["attrs"]["borderColor"] ||
          "black",
        strokeWidth: this.链接["attrs"]["path_width"],
        fill: "transparent",
        scaleX: this.缩放倍数,
        scaleY: this.缩放倍数,
      };
      return 引线;
    },
  },
  watch: {
    起始节点图片: {
      handler: function (val) {
        console.log(val);
        this.加载节点图片(val, "起始节点图片元素");
      },
    },
    结束节点图片: {
      handler: function (val) {
        this.加载节点图片(val, "结束节点图片元素");
      },
    },
    画布原点: {
      handler: function (val) {
        this.真实画布原点 = val;
      },
      deep: true,
    },
    link: {
      handler: async function (val, oldval) {
        if (JSON.stringify(val) == JSON.stringify(oldval)) {
          return null;
        }
        console.log(val.attrs);
        this.链接 = val;
        this.路径类型 = val.attrs.path_type;
        this.起点标记大小 =
          val.attrs.from_anchor_size || val.attrs.path_width / 0.382 || this.起点标记大小;
        this.终点标记大小 =
          val.attrs.to_anchor_size || val.attrs.path_width / 0.382 || this.终点标记大小;
        this.起始节点图片 = val.attrs.from_anchor_image || this.起始节点图片;
        this.结束节点图片 = val.attrs.to_anchor_image || this.结束节点图片;
        this.起点标记自动旋转 = val.attrs.from_anchor_rotate;
        this.终点标记自动旋转 = val.attrs.to_anchor_rotate;

        this.计算路径();

        // console.log(this.路径类型);
      },
      deep: true,
      immediate: true,
    },

    链接: {
      handler: function (val, oldval) {
        if (!val.attrs) {
          return null;
        }

        this.$事件总线.$emit("保存链接", val);
      },
      deep: true,
    },
  },
  methods: {
    计算节点标志偏移: function (起点坐标, 终点坐标, 矩形, 标记大小, 是否自动旋转) {
      let obj = {};
      let 角度 = 0;
      // console.log(矩形);
      if (Math.abs(起点坐标.y - 矩形.top) < 1) {
        角度 = 0;
        obj = { x: 0, y: 标记大小 / 2 };
      }

      if (Math.abs(起点坐标.x - 矩形.left - 矩形.width) < 1) {
        角度 = 90;
        obj = { x: 0 - 标记大小 / 2, y: 0 };
      }
      if (Math.abs(起点坐标.x - 矩形.left) < 1) {
        角度 = 270;
        obj = { x: 标记大小 / 2, y: 0 };
      }
      if (Math.abs(起点坐标.y - 矩形.top - 矩形.height) < 1) {
        obj = { x: 0, y: 0 - 标记大小 / 2 };
        角度 = 180;
      }
      obj.rotation = 角度;
      // console.log(obj);

      if (是否自动旋转) {
        let 方向矢量 = { x: 终点坐标.x - 起点坐标.x, y: 终点坐标.y - 起点坐标.y };
        let 单位方向矢量 = this.单位矢量(方向矢量);
        角度 = this.计算角度(单位方向矢量);
        obj.rotation = 角度 - 90;
      }
      return obj;
    },
    计算角度: function (角度向量) {
      let 象限 = this.象限判断(角度向量);
      let 角度 = (360 * Math.atan(角度向量.y / 角度向量.x)) / (2 * Math.PI);
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

      return 角度;
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
    加载节点图片: async function (图片源, 参数名) {
      let image = new window.Image();
      image.src = 图片源;
      image.onload = () => {
        // set image only when it is loaded
        this[参数名] = image;
      };
    },
    判断id: async function ($event) {
      let that = this;
      if (!this.监听) {
        return null;
      }
      let attrs = that.链接["attrs"];
      if (!attrs) {
        return null;
      }
      if (!that.监听) {
        return null;
      }
      if ($event.id == attrs.from_id) {
        that.计算路径();
      }
      if ($event.id == attrs.to_id) {
        that.计算路径();
      }
      if ($event.id == this.链接.attrs.id) {
        that.计算路径();
      }
    },
    测试连接() {
      //  console.log(this.link);
    },
    矢量模(矢量) {
      let x = 矢量.x;
      let y = 矢量.y;
      return Math.sqrt(x * x + y * y);
    },
    单位矢量(矢量) {
      let x = 矢量.x;
      let y = 矢量.y;
      let 矢量模 = this.矢量模(矢量);
      return { x: x / 矢量模, y: y / 矢量模 };
    },
    矢量加(矢量1, 矢量2) {
      return { x: 矢量1.x + 矢量2.x, y: 矢量1.y + 矢量2.y };
    },
    矢量减: function (矢量1, 矢量2) {
      return { x: 矢量1.x - 矢量2.x, y: 矢量1.y - 矢量2.y };
    },
    矢量内积(矢量1, 矢量2) {
      return { x: 矢量1.x + 矢量2.x, y: 矢量2.y + 矢量2.y };
    },
    矢量除标量(矢量, 标量) {
      return { x: 矢量.x / 标量, y: 矢量.y / 标量 };
    },
    矢量(x, y) {
      return { x: x, y: y };
    },
    矢量乘标量(矢量, 标量) {
      return { x: 标量 * 矢量["x"], y: 标量 * 矢量["y"] };
    },
    计算路径: async function () {
      this.代理起始标记 =
        (await this.$数据库.cards.get(this.链接.attrs.from_id)) || this.代理起始标记;
      this.代理结束标记 =
        (await this.$数据库.cards.get(this.链接.attrs.to_id)) || this.代理结束标记;

      if (!this.代理起始标记 || !this.代理结束标记) {
        return null;
      }

      if (!this.代理起始标记["attrs"] || !this.代理结束标记["attrs"]) {
        return null;
      }
      let 代理起始标记 = this.代理起始标记["attrs"];
      let 代理结束标记 = this.代理结束标记["attrs"];
      /*   if (JSON.stringify(旧代理起始标记) == JSON.stringify(代理起始标记) && JSON.stringify(旧代理结束标记) == JSON.stringify(代理结束标记)) {
                   if (this.路径.d) { this.路径 = this.路径 }
                   else { return null }
               }*/
      if (代理起始标记.hide && 代理结束标记.hide) {
        if (this.路径.d) {
          this.路径 = this.路径;
        } else {
          return null;
        }
      }
      if (代理起始标记.folded) {
        代理起始标记.width = 10;
        代理起始标记.height = 10;
      }
      if (代理结束标记.folded) {
        代理结束标记.width = 10;
        代理结束标记.height = 10;
      }
      let 路径线段 = this.计算路径线段(代理起始标记, 代理结束标记);
      this.起点 = 路径线段.起点.x ? 路径线段.起点 : this.起点;
      this.终点 = 路径线段.终点.x ? 路径线段.终点 : this.终点;

      if (路径线段) {
        switch (this.路径类型) {
          case "折线": {
            this.路径 = this.生成折线路径(路径线段);
            this.链接.attrs.path = this.路径.d;
            this.链接.attrs.top = this.路径.mid.y;
            this.链接.attrs.left = this.路径.mid.x;
            break;
          }

          case "简单曲线": {
            this.路径 = this.两点生成三次贝塞尔曲线(路径线段);
            this.链接.attrs.path = this.路径.d;
            this.链接.attrs.top = this.路径.mid.y;
            this.链接.attrs.left = this.路径.mid.x;
            break;
          }
          default: {
            this.路径 = this.生成直线路径(路径线段);
            this.链接.attrs.path = this.路径.d;
            this.链接.attrs.top = this.路径.mid.y;
            this.链接.attrs.left = this.路径.mid.x;
          }
        }
        this.链接 = this.$更新数据时间戳(this.链接);

        if (Math.abs(this.链接.attrs.offsetx) > 50 || this.链接.attrs.offsety > 50) {
          // console.log("计算引线");
          this.显示引线 = true;
          this.计算引线(this.链接);
        } else {
          this.显示引线 = false;
        }
      }
    },
    计算引线: function (链接) {
      let 引线链接 = JSON.parse(JSON.stringify(链接));
      let 引线终点 = { x: 引线链接.attrs.left, y: 引线链接.attrs.top };
      let 引线矢量 = {
        x: (引线链接.attrs.offsetx + 引线链接.attrs.width / 2) * -1,
        y: (引线链接.attrs.offsety + 引线链接.attrs.height / 2) * -1,
      };
      let 真实矩形 = {
        left: 引线链接.attrs.left + 引线链接.attrs.offsetx,
        top: 引线链接.attrs.top + 引线链接.attrs.offsety,
        width: 引线链接.attrs.width,
        height: 引线链接.attrs.height,
      };
      let 引线起点 = this.矩形与矢量交点(真实矩形, 引线矢量);

      let 引线线段 = { 起点: 引线起点, 终点: 引线终点 };
      //   console.log(JSON.stringify(引线线段));
      this.引线路径 = this.生成引线路径(引线线段);
      // console.log("引线", this.引线路径);
    },
    生成引线路径: function (路径线段) {
      let 起始节点 = 路径线段.起点;
      let 结束节点 = 路径线段.终点;
      let 路径矢量 = this.矢量减(结束节点, 起始节点);
      let define = "";
      let midpoint = {};
      define = `
            M ${起始节点.x} ${起始节点.y}
            l ${路径矢量.x} ${路径矢量.y}
            `;
      midpoint = this.矢量加(起始节点, this.矢量除标量(路径矢量, 2));
      return { d: define, mid: midpoint };
    },
    生成直线路径: function (路径线段) {
      let 起始节点 = this.矢量减(路径线段.起点, this.起始节点偏移);
      let 结束节点 = this.矢量减(路径线段.终点, this.结束节点偏移);
      let 路径矢量 = this.矢量减(结束节点, 起始节点);
      let define = "";
      let midpoint = {};
      define = `
            M ${起始节点.x} ${起始节点.y}
            l ${路径矢量.x} ${路径矢量.y}
            `;
      midpoint = this.矢量加(起始节点, this.矢量除标量(路径矢量, 2));
      return { d: define, mid: midpoint };
    },
    两点生成三次贝塞尔曲线: function (路径线段) {
      let 起始节点 = this.矢量减(路径线段.起点, this.起始节点偏移);
      let 结束节点 = this.矢量减(路径线段.终点, this.结束节点偏移);

      let 路径矢量 = this.矢量减(结束节点, 起始节点);
      let define = "";
      let midpoint = {};
      midpoint = this.矢量加(起始节点, this.矢量除标量(路径矢量, 2));
      define = `
            M ${起始节点.x} ${起始节点.y}
            C ${起始节点.x + Math.sign(路径矢量.x) * 100} ${
        起始节点.y + Math.sign(路径矢量.y) * 100
      } ${结束节点.x - Math.sign(路径矢量.x) * 100} ${
        结束节点.y - Math.sign(路径矢量.y) * 100
      } ${结束节点.x} ${结束节点.y}
            `;
      return { d: define, mid: midpoint };
    },
    生成折线路径: function (路径线段) {
      let 起始节点 = this.矢量减(路径线段.起点, this.起始节点偏移);
      let 结束节点 = this.矢量减(路径线段.终点, this.结束节点偏移);
      let 路径矢量 = this.矢量减(结束节点, 起始节点);
      let define = "";
      let mid = "";
      if (路径矢量["x"] * 路径矢量["x"] - 路径矢量["y"] * 路径矢量["y"] >= 0) {
        define = `
                        M ${起始节点.x} ${起始节点.y}
                        l ${路径矢量["x"] / 2}  0
                        l 0  ${路径矢量["y"] / 2}
                        l 0  ${路径矢量["y"] / 2}
                        l ${路径矢量["x"] / 2}  0
                        `;
      } else {
        define = `
                        M ${起始节点.x} ${起始节点.y}
                        l 0  ${路径矢量["y"] / 2}
                        l ${路径矢量["x"] / 2}  0
                        l ${路径矢量["x"] / 2}  0
                        l 0  ${路径矢量["y"] / 2}
                        `;
      }
      mid = { x: 起始节点.x + 路径矢量.x / 2, y: 起始节点.y + 路径矢量.y / 2 };
      return { d: define, mid: mid };
    },
    计算路径线段: function (代理起始标记, 代理结束标记) {
      if (代理起始标记 && 代理结束标记 && this.链接) {
        let 起始中心 = this.计算中心(代理起始标记);
        let 结束中心 = this.计算中心(代理结束标记);
        let 方向矢量 = this.矢量减(结束中心, 起始中心);
        if (方向矢量.x === 0) {
          方向矢量.x = 0.0001;
        }
        if (方向矢量.y === 0) {
          方向矢量.y = 0.0001;
        }
        let 反转方向矢量 = this.矢量乘标量(方向矢量, -1);
        let 起始节点 = this.矩形与矢量交点(代理起始标记, 方向矢量);
        let 结束节点 = this.矩形与矢量交点(代理结束标记, 反转方向矢量);
        let 路径线段 = { 起点: 起始节点, 终点: 结束节点 };
        return 路径线段;
      } else {
        return { d: "", mid: { x: 0, y: 0 } };
      }
    },
    计算中心(代理标记) {
      let 中心 = {
        x: 代理标记.left + (1 / 2) * 代理标记.width,
        y: 代理标记.top + (1 / 2) * 代理标记.height,
      };
      return 中心;
    },
    矩形与矢量交点(矩形, 矢量) {
      let 矩形中心 = this.计算中心(矩形);
      //    console.log(矩形中心);
      let 交点 = { x: 0, y: 0 };

      x偏移 = Math.abs(((矩形.height / 2) * 矢量.x) / 矢量.y);
      y偏移 = Math.abs(((矩形.width / 2) * 矢量.y) / 矢量.x);
      if (Math.abs(y偏移) > Math.abs(矩形.height / 2)) {
        y偏移 = 矩形.height / 2;
      }

      if (Math.abs(x偏移) > Math.abs(矩形.width / 2)) {
        x偏移 = 矩形.width / 2;
      }
      //别问我为什么不用math.sign  反正不要用
      if (矢量.x > 0) {
        交点.x = 矩形中心.x + x偏移;
      } else {
        交点.x = 矩形中心.x - x偏移;
      }
      if (矢量.y > 0) {
        交点.y = 矩形中心.y + y偏移;
      } else {
        交点.y = 矩形中心.y - y偏移;
      }
      return 交点;
    },
  },
};
</script>
<style></style>
