const 几何定义 = {
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
    矢量模(矢量) {
    let x = 矢量.x;
    let y = 矢量.y;
    return Math.sqrt(x * x + y * y);
    },
    单位矢量(矢量) {
    let x = 矢量.x;
    let y = 矢量.y;
    let 矢量模 = 矢量模(矢量);
    return { x: x / 矢量模, y: y / 矢量模 };
    },
    圆形内接正方形(圆形){
        let 圆心 = 圆形.center
        let 半径 = 圆形.radius
    },
}

function 计算路径(起始标记,结束标记,链接){
    let 代理起始标记 = 起始标记["attrs"];
    let 代理结束标记 = 结束标记["attrs"];

    if (代理起始标记.folded) {
      代理起始标记.width = 100;
      代理起始标记.height = 30;
    }
    if (代理结束标记.folded) {
      代理结束标记.width = 100;
      代理结束标记.height = 30;
    }
    let 路径线段 = 计算路径线段(代理起始标记, 代理结束标记);
    起点 = 路径线段.起点.x ? 路径线段.起点 : 起点;
    终点 = 路径线段.终点.x ? 路径线段.终点 : 终点;
    if (路径线段) {
      switch (路径类型) {
        case "折线": {
          路径 = 生成折线路径(路径线段);
          链接.attrs.path = 路径.d;
          链接.attrs.top = 路径.mid.y;
          链接.attrs.left = 路径.mid.x;
          中点 = 路径.mid;
          break;
        }

        case "简单曲线": {
          路径 = 两点生成三次贝塞尔曲线(路径线段);
          链接.attrs.path = 路径.d;
          链接.attrs.top = 路径.mid.y;
          链接.attrs.left = 路径.mid.x;
          中点 = 路径.mid;

          break;
        }
        default: {
          路径 = 生成直线路径(路径线段);
          链接.attrs.path = 路径.d;
          链接.attrs.top = 路径.mid.y;
          链接.attrs.left = 路径.mid.x;
          中点 = 路径.mid;
        }
      }

      计算引线(链接);
      链接 = $更新数据时间戳(链接);
      if (Math.abs(链接.attrs.offsetx) > 50 || 链接.attrs.offsety > 50) {
        // console.log("计算引线");
        显示引线 = true;
      } else {
        显示引线 = false;
      }

      监听 = true;
      !链接.virtual ? 计算中点可见性() : null;
    }
}

function 计算路径线段 (代理起始标记, 代理结束标记) {
    if (代理起始标记 && 代理结束标记 && 链接) {
      let 起始中心 = 计算中心(代理起始标记);
      let 结束中心 = 计算中心(代理结束标记);
      let 方向矢量 = 几何定义.矢量减(结束中心, 起始中心);
      if (方向矢量.x === 0) {
        方向矢量.x = 0.00000000001;
      }
      if (方向矢量.y === 0) {
        方向矢量.y = 0.00000000001;
      }
      let 反转方向矢量 = 几何定义.矢量乘标量(方向矢量, -1);
      方向矢量 = 几何定义.矢量乘标量(方向矢量, 1);
      let 起始节点 = 矩形与矢量交点(代理起始标记, 方向矢量);
      let 结束节点 = 矩形与矢量交点(代理结束标记, 反转方向矢量);
      let 路径线段 = { 起点: 起始节点, 终点: 结束节点 };
      return 路径线段;
    } else {
      return { d: "", mid: { x: 0, y: 0 } };
    }
  }
  
function  计算中心(代理标记) {
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
  }

function 矢量与矩形交点(矩形,矢量){
    let 矩形中心 = this.计算中心(矩形);
      //    console.log(矩形中心);
      let 交点 = { x: 0, y: 0 };

      x偏移 = Math.abs(((矩形.height / 2) * 矢量.x) / 矢量.y);
      y偏移 = Math.abs(((矩形.width / 2) * 矢量.y) / 矢量.x);
      if (Math.abs(y偏移) > Math.abs(矩形.height / 2)) {
        y偏移 = 矩形.height / 2;
        矩形.fixed_anchor ? (x偏移 = 0) : null;
      }

      if (Math.abs(x偏移) > Math.abs(矩形.width / 2)) {
        x偏移 = 矩形.width / 2;
        矩形.fixed_anchor ? (y偏移 = 0) : null;
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
}