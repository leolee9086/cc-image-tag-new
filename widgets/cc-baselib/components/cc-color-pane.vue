<template>
        <div >
            <div>主题字体颜色</div>
            <el-row :gutter="20" >
                <el-col :span="1" v-for="num in 颜色编号数组" :key="num">
                    <div class="colortemp" @click="最终颜色值=`var(--b3-font-color${num})`" :style="'height:15px;width:15px;border:solid 1px black;background-color:var(--b3-font-color'+num+')'"></div>
                </el-col>
            </el-row>
            <el-divider></el-divider>
            <div>主题背景颜色</div>
            <el-row :gutter="20" >
                <el-col :span="1" v-for="num in 颜色编号数组" :key="num">
                    <div class="colortemp" @click="最终颜色值=`var(--b3-font-background${num})`" :style="'height:15px;width:15px;border:solid 1px black;background-color:var(--b3-font-background'+num+')'"></div>
                </el-col>
            </el-row>
            <el-divider></el-divider>
            <div v-if="显示web命名颜色">web命名颜色</div>
            <el-row v-if="显示web命名颜色" :gutter="20" >
                <el-col :span="1" v-for="item in web命名颜色" :key="item.颜色名">
                    <div class="colortemp" @click="最终颜色值=item['十六进制颜色值']" :style="`height:15px;width:15px;border:solid 1px black;background-color:${item['十六进制颜色值']};`"></div>
                </el-col>
            </el-row>
            <el-divider v-if="显示web命名颜色"></el-divider>
            
            <div>自定义颜色</div> 
            
            <el-row :gutter="20" >
                <el-col :span="1" v-for="item in 自定义颜色" >
                        <div  class="colortemp" @click="最终颜色值=item" :style="`height:15px;width:15px;border:solid 1px black;background-color:${item};`"></div>

                </el-col>
                 <el-col :span="1"  >
                    
                     <el-color-picker 
                        show-alpha 
                        @change="自定义颜色.push($event);最终颜色值=$event" 
                        v-model="最终颜色值" 
                        size=mini 
                        ></el-color-picker>
                </el-col>
            </el-row>
        </div>
</template>
<script>
    module.exports ={
        name:"cc-color-pane",
        props:["思源伺服ip","apitoken","自定义颜色数组","value","显示web命名颜色"],
        model:{event:"change",prop:"value"},
        mounted(){
            this.自定义颜色=this.自定义颜色数组
        },
        data(){
            return{
                label:"A",
                最终颜色值:this.value,
                颜色编号数组:[1,2,3,4,5,6,7,8,9,10,11,12,13],
                web命名颜色:[{"颜色名":"AliceBlue ","十六进制颜色值":"#F0F8FF"},{"颜色名":"AntiqueWhite ","十六进制颜色值":"#FAEBD7"},{"颜色名":"Aqua ","十六进制颜色值":"#00FFFF"},{"颜色名":"Aquamarine ","十六进制颜色值":"#7FFFD4"},{"颜色名":"Azure ","十六进制颜色值":"#F0FFFF"},{"颜色名":"Beige ","十六进制颜色值":"#F5F5DC"},{"颜色名":"Bisque ","十六进制颜色值":"#FFE4C4"},{"颜色名":"Black ","十六进制颜色值":"#000000"},{"颜色名":"BlanchedAlmond ","十六进制颜色值":"#FFEBCD"},{"颜色名":"Blue ","十六进制颜色值":"#0000FF"},{"颜色名":"BlueViolet ","十六进制颜色值":"#8A2BE2"},{"颜色名":"Brown ","十六进制颜色值":"#A52A2A"},{"颜色名":"BurlyWood ","十六进制颜色值":"#DEB887"},{"颜色名":"CadetBlue ","十六进制颜色值":"#5F9EA0"},{"颜色名":"Chartreuse ","十六进制颜色值":"#7FFF00"},{"颜色名":"Chocolate ","十六进制颜色值":"#D2691E"},{"颜色名":"Coral ","十六进制颜色值":"#FF7F50"},{"颜色名":"CornflowerBlue ","十六进制颜色值":"#6495ED"},{"颜色名":"Cornsilk ","十六进制颜色值":"#FFF8DC"},{"颜色名":"Crimson ","十六进制颜色值":"#DC143C"},{"颜色名":"Cyan ","十六进制颜色值":"#00FFFF"},{"颜色名":"DarkBlue ","十六进制颜色值":"#00008B"},{"颜色名":"DarkCyan ","十六进制颜色值":"#008B8B"},{"颜色名":"DarkGoldenRod ","十六进制颜色值":"#B8860B"},{"颜色名":"DarkGray ","十六进制颜色值":"#A9A9A9"},{"颜色名":"DarkGreen ","十六进制颜色值":"#006400"},{"颜色名":"DarkKhaki ","十六进制颜色值":"#BDB76B"},{"颜色名":"DarkMagenta ","十六进制颜色值":"#8B008B"},{"颜色名":"DarkOliveGreen ","十六进制颜色值":"#556B2F"},{"颜色名":"Darkorange ","十六进制颜色值":"#FF8C00"},{"颜色名":"DarkOrchid ","十六进制颜色值":"#9932CC"},{"颜色名":"DarkRed ","十六进制颜色值":"#8B0000"},{"颜色名":"DarkSalmon ","十六进制颜色值":"#E9967A"},{"颜色名":"DarkSeaGreen ","十六进制颜色值":"#8FBC8F"},{"颜色名":"DarkSlateBlue ","十六进制颜色值":"#483D8B"},{"颜色名":"DarkSlateGray ","十六进制颜色值":"#2F4F4F"},{"颜色名":"DarkTurquoise ","十六进制颜色值":"#00CED1"},{"颜色名":"DarkViolet ","十六进制颜色值":"#9400D3"},{"颜色名":"DeepPink ","十六进制颜色值":"#FF1493"},{"颜色名":"DeepSkyBlue ","十六进制颜色值":"#00BFFF"},{"颜色名":"DimGray ","十六进制颜色值":"#696969"},{"颜色名":"DodgerBlue ","十六进制颜色值":"#1E90FF"},{"颜色名":"Feldspar ","十六进制颜色值":"#D19275"},{"颜色名":"FireBrick ","十六进制颜色值":"#B22222"},{"颜色名":"FloralWhite ","十六进制颜色值":"#FFFAF0"},{"颜色名":"ForestGreen ","十六进制颜色值":"#228B22"},{"颜色名":"Fuchsia ","十六进制颜色值":"#FF00FF"},{"颜色名":"Gainsboro ","十六进制颜色值":"#DCDCDC"},{"颜色名":"GhostWhite ","十六进制颜色值":"#F8F8FF"},{"颜色名":"Gold ","十六进制颜色值":"#FFD700"},{"颜色名":"GoldenRod ","十六进制颜色值":"#DAA520"},{"颜色名":"Gray ","十六进制颜色值":"#808080"},{"颜色名":"Green ","十六进制颜色值":"#008000"},{"颜色名":"GreenYellow ","十六进制颜色值":"#ADFF2F"},{"颜色名":"HoneyDew ","十六进制颜色值":"#F0FFF0"},{"颜色名":"HotPink ","十六进制颜色值":"#FF69B4"},{"颜色名":"IndianRed  ","十六进制颜色值":"#CD5C5C"},{"颜色名":"Indigo  ","十六进制颜色值":"#4B0082"},{"颜色名":"Ivory ","十六进制颜色值":"#FFFFF0"},{"颜色名":"Khaki ","十六进制颜色值":"#F0E68C"},{"颜色名":"Lavender ","十六进制颜色值":"#E6E6FA"},{"颜色名":"LavenderBlush ","十六进制颜色值":"#FFF0F5"},{"颜色名":"LawnGreen ","十六进制颜色值":"#7CFC00"},{"颜色名":"LemonChiffon ","十六进制颜色值":"#FFFACD"},{"颜色名":"LightBlue ","十六进制颜色值":"#ADD8E6"},{"颜色名":"LightCoral ","十六进制颜色值":"#F08080"},{"颜色名":"LightCyan ","十六进制颜色值":"#E0FFFF"},{"颜色名":"LightGoldenRodYellow ","十六进制颜色值":"#FAFAD2"},{"颜色名":"LightGrey ","十六进制颜色值":"#D3D3D3"},{"颜色名":"LightGreen ","十六进制颜色值":"#90EE90"},{"颜色名":"LightPink ","十六进制颜色值":"#FFB6C1"},{"颜色名":"LightSalmon ","十六进制颜色值":"#FFA07A"},{"颜色名":"LightSeaGreen ","十六进制颜色值":"#20B2AA"},{"颜色名":"LightSkyBlue ","十六进制颜色值":"#87CEFA"},{"颜色名":"LightSlateBlue ","十六进制颜色值":"#8470FF"},{"颜色名":"LightSlateGray ","十六进制颜色值":"#778899"},{"颜色名":"LightSteelBlue ","十六进制颜色值":"#B0C4DE"},{"颜色名":"LightYellow ","十六进制颜色值":"#FFFFE0"},{"颜色名":"Lime ","十六进制颜色值":"#00FF00"},{"颜色名":"LimeGreen ","十六进制颜色值":"#32CD32"},{"颜色名":"Linen ","十六进制颜色值":"#FAF0E6"},{"颜色名":"Magenta ","十六进制颜色值":"#FF00FF"},{"颜色名":"Maroon ","十六进制颜色值":"#800000"},{"颜色名":"MediumAquaMarine ","十六进制颜色值":"#66CDAA"},{"颜色名":"MediumBlue ","十六进制颜色值":"#0000CD"},{"颜色名":"MediumOrchid ","十六进制颜色值":"#BA55D3"},{"颜色名":"MediumPurple ","十六进制颜色值":"#9370D8"},{"颜色名":"MediumSeaGreen ","十六进制颜色值":"#3CB371"},{"颜色名":"MediumSlateBlue ","十六进制颜色值":"#7B68EE"},{"颜色名":"MediumSpringGreen ","十六进制颜色值":"#00FA9A"},{"颜色名":"MediumTurquoise ","十六进制颜色值":"#48D1CC"},{"颜色名":"MediumVioletRed ","十六进制颜色值":"#C71585"},{"颜色名":"MidnightBlue ","十六进制颜色值":"#191970"},{"颜色名":"MintCream ","十六进制颜色值":"#F5FFFA"},{"颜色名":"MistyRose ","十六进制颜色值":"#FFE4E1"},{"颜色名":"Moccasin ","十六进制颜色值":"#FFE4B5"},{"颜色名":"NavajoWhite ","十六进制颜色值":"#FFDEAD"},{"颜色名":"Navy ","十六进制颜色值":"#000080"},{"颜色名":"OldLace ","十六进制颜色值":"#FDF5E6"},{"颜色名":"Olive ","十六进制颜色值":"#808000"},{"颜色名":"OliveDrab ","十六进制颜色值":"#6B8E23"},{"颜色名":"Orange ","十六进制颜色值":"#FFA500"},{"颜色名":"OrangeRed ","十六进制颜色值":"#FF4500"},{"颜色名":"Orchid ","十六进制颜色值":"#DA70D6"},{"颜色名":"PaleGoldenRod ","十六进制颜色值":"#EEE8AA"},{"颜色名":"PaleGreen ","十六进制颜色值":"#98FB98"},{"颜色名":"PaleTurquoise ","十六进制颜色值":"#AFEEEE"},{"颜色名":"PaleVioletRed ","十六进制颜色值":"#D87093"},{"颜色名":"PapayaWhip ","十六进制颜色值":"#FFEFD5"},{"颜色名":"PeachPuff ","十六进制颜色值":"#FFDAB9"},{"颜色名":"Peru ","十六进制颜色值":"#CD853F"},{"颜色名":"Pink ","十六进制颜色值":"#FFC0CB"},{"颜色名":"Plum ","十六进制颜色值":"#DDA0DD"},{"颜色名":"PowderBlue ","十六进制颜色值":"#B0E0E6"},{"颜色名":"Purple ","十六进制颜色值":"#800080"},{"颜色名":"Red ","十六进制颜色值":"#FF0000"},{"颜色名":"RosyBrown ","十六进制颜色值":"#BC8F8F"},{"颜色名":"RoyalBlue ","十六进制颜色值":"#4169E1"},{"颜色名":"SaddleBrown ","十六进制颜色值":"#8B4513"},{"颜色名":"Salmon ","十六进制颜色值":"#FA8072"},{"颜色名":"SandyBrown ","十六进制颜色值":"#F4A460"},{"颜色名":"SeaGreen ","十六进制颜色值":"#2E8B57"},{"颜色名":"SeaShell ","十六进制颜色值":"#FFF5EE"},{"颜色名":"Sienna ","十六进制颜色值":"#A0522D"},{"颜色名":"Silver ","十六进制颜色值":"#C0C0C0"},{"颜色名":"SkyBlue ","十六进制颜色值":"#87CEEB"},{"颜色名":"SlateBlue ","十六进制颜色值":"#6A5ACD"},{"颜色名":"SlateGray ","十六进制颜色值":"#708090"},{"颜色名":"Snow ","十六进制颜色值":"#FFFAFA"},{"颜色名":"SpringGreen ","十六进制颜色值":"#00FF7F"},{"颜色名":"SteelBlue ","十六进制颜色值":"#4682B4"},{"颜色名":"Tan ","十六进制颜色值":"#D2B48C"},{"颜色名":"Teal ","十六进制颜色值":"#008080"},{"颜色名":"Thistle ","十六进制颜色值":"#D8BFD8"},{"颜色名":"Tomato ","十六进制颜色值":"#FF6347"},{"颜色名":"Turquoise ","十六进制颜色值":"#40E0D0"},{"颜色名":"Violet ","十六进制颜色值":"#EE82EE"},{"颜色名":"VioletRed ","十六进制颜色值":"#D02090"},{"颜色名":"Wheat ","十六进制颜色值":"#F5DEB3"},{"颜色名":"White ","十六进制颜色值":"#FFFFFF"},{"颜色名":"WhiteSmoke ","十六进制颜色值":"#F5F5F5"},{"颜色名":"Yellow ","十六进制颜色值":"#FFFF00"},{"颜色名":"YellowGreen ","十六进制颜色值":"#9ACD32"}],
                自定义颜色:this.自定义颜色数组,
                下一个自定义色:"red",
            }
        },
        watch:{
            自定义颜色数组:{handler(val){
                this.自定义颜色=val
            },
            deep:true
            },
            自定义颜色(){
              //  console.log(this.自定义颜色)
                this.$emit('append',this.自定义颜色)
            },
            最终颜色值(){
            //    console.log(this.最终颜色值)
                this.$emit('change',this.最终颜色值)
            },
        },
        methods: {
             
        },

    }
</script>
<style scoped>
    div.colortemp:hover{
        border:solid lightsalmon 1px !important;
    }
    .el-color-picker *{
        padding:0 !important;
        margin:0 !important;
        border:none !important;
        width:16px;
        height:16px
    }
    .el-divider--horizontal{
        margin:5px 0!important;
    }
</style>


