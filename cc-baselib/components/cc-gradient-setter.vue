<template>
    <div id="root" ref="root"
            style="position:relative"
    >
        <div class="preview" ref="preview"
        @mouseup="添加节点值($event)"
        @mousemove="编辑节点值($event)"
        >
            <div 
            v-for="(i,percent) in 颜色值序列 "
            v-on:mousedown="暂时删除节点(percent)"
            :percent="percent"
            :style="`width:6px;
            height:28px;
            left:${位置序列[percent]};`"
            class="node-back-ground"
            ></div>
        </div>
      
        <div :style="`height:28px;
                    width:1px;
                    position:absolute;
                    left:${位置序列[percent]};
                    top:0;
                    border:solid 1px`"
                v-for="(i,percent) in 颜色值序列 "
                :ref="percent"
                :class="percent"
                
                    >
            
            <el-popover
            trigger="click"
            width="500"
            placement="right"
            >
                <div slot="reference"
                    :style="`width:10px;
                    height:10px;
                    position:absolute;
                    background-color:${颜色值序列[percent]};
                    top:28px;
                    left:-5.5px;
                    border:solid 1px;
                    border:
                    `"
                    >  
                </div>
                <cc-color-pane
                    v-model="颜色值序列[percent]"
                    :自定义颜色数组="自定义颜色数组"
                ></cc-color-pane> 
                <el-button @click="删除节点(percent)">删除</el-button>  
            </el-popover>
        </div>
         <div :style="`height:28px;
                    width:1px;
                    position:absolute;
                    left:${临时位置};
                    top:0;
                    border:solid 1px`"
                ref="tempnode"
                class="tempnode"
                v-if="临时位置"
                @mouseup="固定临时位置()"
                    >
                <div 
                    :style="`width:10px;
                    height:10px;
                    position:absolute;
                    background-color:${临时颜色};
                    top:28px;
                    left:-5.5px;
                    border:solid 1px;
                    border:
                    `"
                    >  
                </div>
               
        </div>
        <cc-knob
        :size="50"
        v-model="渐变角度"
        :style="`position:relative;top:-28px;left:${宽度-30}px`"
        ></cc-knob>
    </div>
</template>
<script>

module.exports= {
    name:"cc-gradient-setter",
    components:componentsList,
    props:["value","宽度","自定义颜色数组"],
    model:{event:"change",prop:"value"},
    mounted(){
        this.isMounted=true
        this.$refs.preview.style.backgroundImage="linear-gradient("+this.渐变角度+"deg"+this.渐变定义+  ")"
        this.$refs.preview.style.width=`${this.宽度-50}px`
        this.$refs.root.style.height="56px"
    },
    data(){
        return{
            渐变角度:90,
            颜色值序列:{},
            当前百分比:0,
            显示颜色面板:false,
            isMounted:false,
            改变节点位置:false,
            临时百分比:"",
            临时颜色:"",
            临时位置:""
        }
    },
    computed:{
        
        渐变定义(){
            let that =this
            if(!this.isMounted){
                return ""
            } 
            let 临时字符串 = ""
            let arry = []
            console.log("aaa",this.颜色值序列)
            for(节点 in this.颜色值序列){
                arry.push({"index":parseFloat(节点.replace("%","")),"value":节点})
                  
                            
                }
            if(this.临时百分比){arry.push({"index":parseFloat(this.临时百分比.replace("%","")),"value":this.临时百分比})}
            arry.sort(
                    function (x,y) {
                    return x.index-y.index;
                }
                )  
            console.log(arry)
            arry.forEach(el=>{
                if (this.颜色值序列[el["value"]]){
                临时字符串=临时字符串+`,${this.颜色值序列[el["value"]]} ${el["value"]}`}
                else{临时字符串=临时字符串+`,${this.临时颜色} ${el["value"]}`}
                }
            )
            let 角度字符串= this.渐变角度+"deg"
            console.log(临时字符串)
            临时字符串="linear-gradient("+角度字符串+临时字符串+")"
            return 临时字符串
        },
        位置序列(){
            if(!this.isMounted){
                return {"0%":0,"100%":600}
            } 
            let obj={}
            for (百分比 in this.颜色值序列){
                let el = this.$refs.preview

                obj[百分比]=el.offsetWidth*parseFloat(百分比)/100-1.5+"px"
            }
            console.log(obj)
            return obj
        },
        
    },
    watch:{ 
            临时百分比(val){
                if(this.临时百分比){
                    let el = this.$refs.preview
                    this.临时位置=el.offsetWidth*parseFloat(val)/100-1.5+"px"
                }
            },
            渐变定义:{
               handler(val){
                console.log(val)
                this.$refs.preview.style.backgroundImage=val
                this.应用(val)
                }
            }
        },
    methods:{
        固定临时位置(){
            this.颜色值序列[this.临时百分比]=this.临时颜色
                        this.颜色值序列 = JSON.parse(JSON.stringify(this.颜色值序列))
            this.临时颜色=""
            this.临时百分比=""
            this.临时位置=""
        },
        应用:async function(val){
            this.$emit("change",val)
        },
        暂时删除节点(percent){
            if(percent==this.临时百分比){return}
            this.临时百分比=percent
            this.临时颜色=this.颜色值序列[percent]+""
            console.log("临时颜色",this.临时颜色)
            delete(this.颜色值序列[percent])
            this.颜色值序列 = JSON.parse(JSON.stringify(this.颜色值序列))
        },
        编辑节点值(event){
            if(!this.临时颜色){return}
            this.临时百分比=Math.round(event.offsetX/event.target.offsetWidth*10000)/100+"%"
            console.log("临时百分比",this.临时百分比)
        },
        删除节点(percent){
            delete(this.颜色值序列[percent])
            this.颜色值序列 = JSON.parse(JSON.stringify(this.颜色值序列))
            console.log(this.颜色值序列)
        },
        添加节点值(event){
            if(event.target.getAttribute("class")=="node-back-ground"){return}
           
            this.当前百分比=Math.round(event.offsetX/event.target.offsetWidth*10000)/100
            console.log(this.当前百分比+"%")
            if(!this.颜色值序列[this.当前百分比+"%"]){
            this.$set(this.颜色值序列,this.当前百分比+"%","red")
            if (this.临时颜色){
                this.颜色值序列[this.当前百分比+"%"]=this.临时颜色+""
                this.临时颜色=""
                }
            }
            this.颜色值序列 = JSON.parse(JSON.stringify(this.颜色值序列))
            
            console.log(this.颜色值序列)
        },
       
    }
}
</script>
<style scoped>
    #root{
        background-color:var(--b3-theme-background)
    }
    .node-back-ground{
        position: absolute;
        top:0;
        z-index: 999;
    }
    .node-back-ground:hover{
        background-color: rgba(211, 214, 29);
        
        z-index: 999;
    }
    .preview{
        width:100%;
        height: 28px;
        border:solid 1px
    }
</style>