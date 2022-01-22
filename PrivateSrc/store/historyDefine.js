Vue.prototype.$应用版本数据=async function(版本数据){
    await this.$保存历史();
    await this.$清空画板();
    let historycards = 版本数据.cards;
    for (i in historycards) {
      try {
        await this.$数据库.cards.add(historycards[i]);
      } catch (e) {
        //    console.log(historycards[i], i, e);
      }
    }
    let historylinks = 版本数据.links;
    for (j in historycards) {
      try {
        await this.$数据库.links.add(historylinks[j]);
      } catch (e) {
        //  console.log(historylinks[j], j, e);
      }
    }
    let historymeta = 版本数据.metadata;
    for (j in historymeta) {
      try {
        await this.$数据库.metadata.add(historymeta[j]);
      } catch (e) {
        //  console.log(historylinks[j], j, e);
      }
    }
    let historycardpresets = 版本数据.cardpresets;
    for (j in historycardpresets) {
      try {
        await this.$数据库.cardpresets.add(historycardpresets[j]);
      } catch (e) {
        //  console.log(historylinks[j], j, e);
      }
    }
    let historylinkpresets = 版本数据.linkpresets;
    for (j in historylinkpresets) {
      try {
        await this.$数据库.linkpresets.add(historylinkpresets[j]);
      } catch (e) {
        //  console.log(historylinks[j], j, e);
      }
    }
}
Vue.prototype.$清空画板 =async function(){
    await this.$数据库.cards.clear();
    await this.$数据库.links.clear();
    await this.$数据库.metadata.clear();
    await this.$数据库.cardpresets.clear();
    await this.$数据库.linkpresets.clear();
}
Vue.prototype.$保存历史= async function(){
    let data = {};
    data.cards = await this.$数据库.cards.toArray();
    data.links = await this.$数据库.links.toArray();
    data.metadata = await this.$数据库.metadata.toArray();
    data.states = await this.$数据库.states.toArray();
    data.linkpresets = await this.$数据库.linkpresets.toArray();
    data.cardpresets = await this.$数据库.cardpresets.toArray();
    data.timestamp = this.$用Lute生成时间戳();
    let 历史版本数量 = this.文件历史列表.length;
    // console.log(历史版本数量);
    //console.log(this.历史版本数量上限);
    if (历史版本数量 > this.历史版本数量上限) {
      await this.$数据库.history
        .orderBy("id")
        .reverse()
        .offset(this.历史版本数量上限 - 1)
        .delete();
    }
    await this.$数据库.history.put(data);
    this.文件历史列表 = await this.$数据库.history.toArray();

}