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
    let 矢量模 = this.矢量模(矢量);
    return { x: x / 矢量模, y: y / 矢量模 };
    },
    圆形内接正方形(圆形){
        let 圆心 = 圆形.center
        let 半径 = 圆形.radius
    },
}