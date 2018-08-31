# bigDataTable-for-element
一个简单的版本之后会完善



初始化方法

在data中定义绘制表格所需的data:
```
data(){
	return {
		sourceDataByTree:[],
		fillData:[],
		topSpan:0,
		bottomSpan:0,
	}
}
```


把定义的数据的key值对应到options中,并且初始化:
```
let options = {
			scrollerRef: this.$refs.tableref.$refs.bodyWrapper,
			data: "sourceDataByTree", //源数据在data中的key值
			fill_data: "fillData",//用于绘制表格的数据在data中的key值
			top_span: "topSpan",//头部
			bottom_span: "bottomSpan",
			filldata_length: 22,
			table_item_height: 32
		}
this.tableControl = new BigDataTable(this, options)
```
添加fillrow方法在methods中
```
			fillrow({
				row,
				rowIndex
			}) {
				if (rowIndex == 0) {
					return {
						height: this.topSpan + 'px'
					}
				}
				if (rowIndex == this.fillData.length - 1) {
					return {
						height: this.bottomSpan + 'px'
					}
				}
			},
```

并且把该方法对应到elementUI中的table控件的row-style属性中,把fillData作为渲染数据:

``
<el-table :row-style="fillrow" :data="fillData">...
``
