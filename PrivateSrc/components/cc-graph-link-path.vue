<template>
  <g>
    <path
      v-if="链接['attrs']"
      @click="测试连接()"
      v-bind:d="路径.d || ''"
      marker-mid="url(#markerArrowFrom)"
      marker-start="url(#markerArrowFrom)"
      marker-end="url(#markerArrowTo)"
      :stroke="链接['attrs']['path_color'] || 链接['attrs']['borderColor'] || 'black'"
      :stroke-width="链接['attrs']['path_width'] || 1"
      fill="transparent"
    ></path>
    <path
      v-if="显示引线 && 引线路径"
      @click="测试连接()"
      v-bind:d="引线路径.d || ''"
      marker-end="url(#markerArrowTo)"
      :stroke="链接['attrs']['borderColor'] || 'black'"
      :storke-width="链接['attrs']['path_width'] || 1"
      fill="transparent"
    ></path>
    <circle :cx="起点.x || 0" :cy="起点.y || 0" :r="2"> </circle>
    <circle :cx="终点.x || 0" :cy="终点.y || 0" :r="2"> </circle>
  </g>
</template>
<script>
module.exports = {
  name: "cc-graph-link-path",
  props: ["link", "虚拟起始标记", "虚拟结束标记"],
  mounted() {
    this.链接 = JSON.parse(JSON.stringify(this.link));
    this.监听 = true;
    this.$事件总线.$on("保存卡片", (event) => this.判断id(event));
    this.$事件总线.$on("保存链接", (event) => this.判断id(event));
    this.$事件总线.$on("接收数据", (event) => this.判断id(event));

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
    };
  },
  watch: {
    link: {
      handler: function (val, oldval) {
        if (JSON.stringify(val) == JSON.stringify(oldval)) {
          return null;
        }
        this.链接 = val;
        this.路径类型 = val.attrs.path_type;
        this.链接.type = "link";

        this.链接.subtype = val.subtype || "属于";

        // //console.log(this.路径类型);
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
    判断id: async function ($event) {
      console.log($event);
      if ($event.attrsproxy) {
        return null;
      }
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
        that.代理起始标记 = $event;
        that.计算路径();
      }
      if ($event.id == attrs.to_id) {
        that.代理结束标记 = $event;
        that.计算路径();
      }
      if ($event.id == that.链接.id) {
        that.代理起始标记 =
          (await that.$数据库.cards.get(that.链接.attrs.from_id)) ||
          (await that.$数据库.links.get(that.链接.attrs.from_id));
        that.代理结束标记 =
          (await that.$数据库.cards.get(that.链接.attrs.to_id)) ||
          (await that.$数据库.links.get(that.链接.attrs.to_id));
        that.计算路径();
      }
    },
    测试连接() {
      //  //console.log(this.link);
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
      let that = this;
      that.代理起始标记 =
        (await that.$数据库.cards.get(that.链接.attrs.from_id)) ||
        (await that.$数据库.links.get(that.链接.attrs.from_id));
      that.代理结束标记 =
        (await that.$数据库.cards.get(that.链接.attrs.to_id)) ||
        (await that.$数据库.links.get(that.链接.attrs.to_id));
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
      this.起点 = 路径线段.起点;
      this.终点 = 路径线段.终点;
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
          // //console.log("计算引线");
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
      //   //console.log(JSON.stringify(引线线段));
      this.引线路径 = this.生成直线路径(引线线段);
      // //console.log("引线", this.引线路径);
    },

    生成直线路径: function (路径线段) {
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
    两点生成三次贝塞尔曲线: function (路径线段) {
      let 起始节点 = 路径线段.起点;
      let 结束节点 = 路径线段.终点;

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
      let 起始节点 = 路径线段.起点;
      let 结束节点 = 路径线段.终点;
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
          方向矢量.x = 0.001;
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
      let 中心 = {};
      if (代理标记.offsetx + "" != "undefined" && 代理标记.offsetx + "" != "NAN") {
        中心 = {
          x: 代理标记.left + (1 / 2) * 代理标记.width + 代理标记.offsetx,
          y: 代理标记.top + (1 / 2) * 代理标记.height + 代理标记.offsety,
        };
      } else {
        中心 = {
          x: 代理标记.left + (1 / 2) * 代理标记.width,
          y: 代理标记.top + (1 / 2) * 代理标记.height,
        };
      }
      return 中心;
    },
    矩形与矢量交点(矩形, 矢量) {
      let 矩形中心 = this.计算中心(矩形);
      //    //console.log(矩形中心);
      x偏移 = Math.abs(((矩形.height / 2) * 矢量.x) / 矢量.y);
      y偏移 = Math.abs(((矩形.width / 2) * 矢量.y) / 矢量.x);
      if (Math.abs(y偏移) > Math.abs(矩形.height / 2)) {
        y偏移 = 矩形.height / 2;
      }

      if (Math.abs(x偏移) > Math.abs(矩形.width / 2)) {
        x偏移 = 矩形.width / 2;
      }
      //别问我为什么不用math.sign  反正不要用
      let 交点 = { x: 0, y: 0 };
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
