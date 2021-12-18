<template>
    
        <path
            v-bind:d="路径.d ||''"
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
    props: ["link"],
    async mounted() {
        this.链接 = this.link
       
        console.log(this.代理起始标记, this.代理结束标记)
        this.timer = setInterval(this.计算路径, 100);
    },
    data() {
        return {
            链接: "",
            路径: "",
            width: 0,
            代理起始标记: {},
            代理结束标记: {},
            timer: ""
        }
    },
    watch: {
        路径:{
            handler:function(val,oldval){
                this.链接.path=val.d
                this.链接.labelPalcement=val.mid
                if(val!=oldval){
                this.$数据库.links.put(this.链接)}
            },
                            deep:true

        },
        link:{
            handler:function(val,oldval){
                if(val!=oldval){
                    this.链接=val
                    if(val.from_id==val.to_id){
                        this.$数据库.links.delete(val.id)
                    }
                }
            },
            deep:true

        }
    },
    methods: {

        矢量加(矢量1, 矢量2) {
            return { x: 矢量1.x + 矢量2.x, y: 矢量1.y + 矢量2.y }
        },
        矢量减(矢量1, 矢量2) {
            return { x: 矢量1.x - 矢量2.x, y: 矢量1.y - 矢量2.y }
        },
        矢量内积(矢量1, 矢量2) {
            return { x: 矢量1.x + 矢量2.x, y: 矢量2.y + 矢量2.y }
        },
        矢量除标量(矢量, 标量) {
            return { x: 矢量.x / 标量, y: 矢量.y / 标量 }
        },
        矢量(x, y) {
            return { "x": x, "y": y }
        },
        计算路径: async function () {
            let 旧代理起始标记 = this.代理起始标记
            let 旧代理结束标记 = this.代理结束标记
            let 代理起始标记 = await this.$数据库.tags.get(this.链接.from_id)
            let 代理结束标记 = await this.$数据库.tags.get(this.链接.to_id)
            if (!代理起始标记 || !代理结束标记) { return null }

            if (JSON.stringify(旧代理起始标记) == JSON.stringify(代理起始标记) && JSON.stringify(旧代理结束标记) == JSON.stringify(代理结束标记)) {
                if (this.路径.d) { return this.路径 }
                else { return null }
            }
            if (代理起始标记.hide && 代理结束标记.hide) {
                if (this.路径.d) { return this.路径 }
                else { return null }
            }
            if (代理起始标记.folded) {
                代理起始标记.width = 10
                代理起始标记.height = 10
            }
            if (代理结束标记.folded) {
                代理结束标记.width = 10
                代理结束标记.height = 10
            }
            if (代理起始标记 && 代理结束标记 && this.链接) {
                let 起始中心 = { x: 代理起始标记.left + 1 / 2 * 代理起始标记.width, y: 代理起始标记.top + 1 / 2 * 代理起始标记.height }
                let 结束中心 = { x: 代理结束标记.left + 1 / 2 * 代理结束标记.width, y: 代理结束标记.top + 1 / 2 * 代理结束标记.height }
                if (代理起始标记.folded) { 起始中心.x = 代理起始标记.left + 7.5; 起始中心.y = 代理起始标记.top + 7.5 }
                if (代理结束标记.folded) { 结束中心.x = 代理结束标记.left + 7.5; 结束中心.y = 代理结束标记.top + 7.5 }
                let 方向矢量 = { x: 结束中心.x - 起始中心.x, y: 结束中心.y - 起始中心.y }
                if (方向矢量.x == 0) { 方向矢量.x = 0.001 }
                if (方向矢量.y == 0) { 方向矢量.y = 0.0001 }
                let 起始节点 = {
                    x: 起始中心.x + (代理起始标记.width / 2) * Math.sign(方向矢量.x),
                    y: 起始中心.y + (代理起始标记.height / 2) * Math.sign(方向矢量.y)
                }
                let 结束节点 = {
                    x: 结束中心.x - (代理结束标记.width / 2) * Math.sign(方向矢量.x),
                    y: 结束中心.y - (代理结束标记.height / 2) * Math.sign(方向矢量.y)
                }

                let 起始y偏移 = 方向矢量.y * (代理起始标记.width / 2 / 方向矢量.x) * Math.sign(方向矢量.x)
                let 结束y偏移 = 方向矢量.y * (代理结束标记.width / 2 / 方向矢量.x) * Math.sign(方向矢量.x)

                if (Math.abs(起始y偏移) > 1 / 2 * 代理起始标记.height) { 起始y偏移 = 1 / 2 * 代理起始标记.height * Math.sign(起始y偏移) }
                if (Math.abs(结束y偏移) > 1 / 2 * 代理结束标记.height) { 结束y偏移 = 1 / 2 * 代理结束标记.height * Math.sign(起始y偏移) }
                起始节点.y = 起始中心.y + 起始y偏移
                结束节点.y = 结束中心.y - 结束y偏移

                let 起始x偏移 = 方向矢量.x * (代理起始标记.height / 2 / 方向矢量.y) * Math.sign(方向矢量.y)
                let 结束x偏移 = 方向矢量.x * (代理结束标记.height / 2 / 方向矢量.y) * Math.sign(方向矢量.y)

                if (Math.abs(起始x偏移) > 1 / 2 * 代理起始标记.width) { 起始x偏移 = 1 / 2 * 代理起始标记.width * Math.sign(起始x偏移) }
                if (Math.abs(结束x偏移) > 1 / 2 * 代理结束标记.width) { 结束x偏移 = 1 / 2 * 代理结束标记.width * Math.sign(起始x偏移) }
                起始节点.x = 起始中心.x + 起始x偏移
                结束节点.x = 结束中心.x - 结束x偏移

                let 路径矢量 = {
                    x: 结束节点.x - 起始节点.x,
                    y: 结束节点.y - 起始节点.y,

                }

                let define = ""
                let mid = ""
                if (路径矢量["x"] * 路径矢量["x"] - 路径矢量["y"] * 路径矢量["y"] >= 0) {
                    define = `
                M ${起始节点.x} ${起始节点.y}
                l ${路径矢量["x"] / 2}  0
                l 0  ${路径矢量["y"] / 2}
                l 0  ${路径矢量["y"] / 2}
                l ${路径矢量["x"] / 2}  0
                `

                }
                else {
                    define = `
                M ${起始节点.x} ${起始节点.y}
                l 0  ${路径矢量["y"] / 2}
                l ${路径矢量["x"] / 2}  0
                l ${路径矢量["x"] / 2}  0
                l 0  ${路径矢量["y"] / 2}
                `
                }
                if (this.链接.type == "simpleLine") {
                    define = `
                    M ${起始节点.x} ${起始节点.y}
                
                l ${路径矢量["x"]}  ${路径矢量["y"]}
                `
                }
                mid = { x: 起始节点.x + 路径矢量.x / 2, y: 起始节点.y + 路径矢量.y / 2 }
                this.路径 = { "d": define, "mid": mid }
                
            }
            else { this.路径 = { "d": "", "mid": { x: 0, y: 0 } } }
        },
    }
}
</script>
<style>
</style>