<template>
  <path
    v-bind:d="路径.d || ''"
    marker-mid="url(#markerArrowFrom)"
    marker-start="url(#markerArrowFrom)"
    marker-end="url(#markerArrowTo)"
    :stroke="link['color'] || 'black'"
    :storke-width="link['width'] || 1"
    fill="transparent"
  ></path>
</template>
<script>
module.exports = {
  name: "cc-graph-link",
  props: ["虚拟起始标记", "当前鼠标坐标"],
  async mounted() {
    //  //console.log(this.虚拟起始标记)
    this.计算路径();
  },
  data() {
    return {
      链接: "",
      路径: "",
      width: 0,
      代理起始标记: {},
      代理结束标记: {},
      timer: "",
    };
  },
  watch: {
    路径: {
      handler: function (val, oldval) {
        this.链接.path = val.d;
        this.链接.labelPalcement = val.mid;
        if (val != oldval) {
          this.$数据库.links.put(this.链接);
        }
      },
      deep: true,
    },
    link: {
      handler: function (val, oldval) {
        if (val != oldval) {
          this.链接 = val;
          if (val.from_id == val.to_id) {
            this.$数据库.links.delete(val.id);
          }
        }
      },
      deep: true,
    },
  },
  methods: {
    判断id($event) {
      if ($event.id == this.链接.from_id) {
        this.代理起始标记 = $event;
        this.计算路径();
      }
      if ($event.id == this.链接.to_id) {
        this.代理结束标记 = $event;
        this.计算路径();
      }
    },
    矢量加(矢量1, 矢量2) {
      return { x: 矢量1.x + 矢量2.x, y: 矢量1.y + 矢量2.y };
    },
    矢量减(矢量1, 矢量2) {
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
      let 代理起始标记 = this.虚拟起始标记;
      let 代理结束标记 = this.虚拟结束标记;
      if (!代理起始标记 || !代理结束标记) {
        return null;
      }

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
      if (路径线段) {
        let 路径类型 = this.链接.type;
        if (路径类型 == "折线") {
          this.路径 = this.生成折线路径(路径线段);
        } else {
          this.路径 = this.生成直线路径(路径线段);
        }
      }
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
      let 中心 = {
        x: 代理标记.left + (1 / 2) * 代理标记.width,
        y: 代理标记.top + (1 / 2) * 代理标记.height,
      };
      return 中心;
    },
    矩形与矢量交点(矩形, 矢量) {
      let 矩形中心 = this.计算中心(矩形);
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
