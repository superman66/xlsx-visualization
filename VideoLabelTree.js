'use strict'
const fs = require('fs');
const tree = [
    { name: '爱奇艺', children: [] },
    { name: 'xxx', children: [] }
]
const mockData = [['一级标签', '二级标签', 'UV'],
['爱奇艺', '电视剧', 844],
['爱奇艺', '电影', 349],
['爱奇艺', '动漫', 327],
['爱奇艺', '搞笑', 33],
['爱奇艺', '纪录片', 20],
['爱奇艺', '教育', 10],
['爱奇艺', '军事', 10],
['爱奇艺', '旅游', 4],
['爱奇艺', '片花', 11],
['爱奇艺', '汽车', 3],
['爱奇艺', '少儿', 15],
['爱奇艺', '生活', 18],
['爱奇艺', '体育', 24],
['爱奇艺', '音乐', 5],
['爱奇艺', '游戏', 98],
['爱奇艺', '娱乐', 8],
['爱奇艺', '原创', 22],
['爱奇艺', '资讯', 70],
['爱奇艺', '综艺', 122],
['腾讯视频', '电视剧', 296],
['腾讯视频', '电影', 334],
['腾讯视频', '纪录片', 13],
['优酷土豆', '创意视频', 2],
['优酷土豆', '电视剧', 133],
['优酷土豆', '电影', 43],
['优酷土豆', '动漫', 38],
['优酷土豆', '纪录片', 2],
['优酷土豆', '纪实', 4],
['优酷土豆', '教育', 2],
['优酷土豆', '汽车', 2],
['优酷土豆', '亲子', 2],
['优酷土豆', '娱乐', 13],
['优酷土豆', '资讯', 3],
['优酷土豆', '综艺', 47]]
class VideoLabelTree {
    constructor(data) {
        this.TOP_NUMBER = 5;
        this.data = data; // 传入的原始数据
        this.tree = []; // 生成传统树结构的数组
        this.labelTree = [];  // 生成的扁平树数组
        this.uvHash = {};   // 标签UV统计对象
        this.currentMAC = '';   // 当前标签 MAC，用于标记，无实际意义
        this.label = [] // 记录 excel 数据的每个 object 所对应的key
        this.init();
    }
    init() {
        // this.handleData(this.data);
        this.tree = this.arrayToTree(this.data);
        this.tree = this.sortUv(this.tree);
    }
    handleData(data) {
        this.addParentToArray(data)
    }
    /**
     * 将数组转换为具有父子关系的数组
     * @param {*} data 
     */
    addParentToArray(data) {
        data.forEach((value, index) => {
            if (index >= 1) {
                const parent = value[0];
                const label = value[1];
                const uv = value[2];
                // 判断当前标签是否已经存在
                const exists = this.labelTree.some(label => label.name === value && label.parent === parent);
                let node = {
                    parent: parent,
                    name: label,
                    count: uv
                }
                !exists && this.labelTree.push(node);
            }
        })
    }
    /**
     * 数组转换为tree
     * @param {*} array 
     * @param {*} parent 
     * @param {*} tree 
     */
    arrayToTree(arr) {
        let tree = [], map = {};
        arr.forEach((value, index) => {
            if (index > 0) {
                let childNode = {
                    name: value[1],
                    count: value[2]
                }
                // 存在不存在该一级标签
                if (!tree.some(label => label.name === value[0])) {
                    let node = {
                        name: value[0],
                        count: 0,
                        children: [
                            childNode
                        ]
                    };
                    var i = tree.push(node);
                    map[value[0]] = i - 1;

                }
                // 存在该一级标签
                else {
                    tree[map[value[0]]].children.push(childNode)
                }
            }
        })
        return tree;
    }
    /**
     * 根据 UV 数对标签进行快速排序
     */
    sortUv(tree) {
        return this.quickSort(tree)
    }
    /**
     * 快速排序
     */
    quickSort(arr) {
        var that = this;
        if (arr.length <= 1) { return arr; }
        const pivotIndex = Math.floor(arr.length / 2);
        const pivot = arr.splice(pivotIndex, 1)[0];
        const left = [];
        const right = [];
        arr.forEach((value, index) => {
            if (value.children && value.children.length > 0) {
                value.children = this.quickSort(value.children);
            }
            if (value.count > pivot.count) {
                left.push(value);
            } else {
                right.push(value);
            }

        })
        return that.quickSort(left).concat([pivot], that.quickSort(right));
    }

    /**
     * arr 数组
     * num  top num
     */
    top(arr, num) {
        arr.map((value, index) => {
            let children = value.children;
            if (children.length > 0) {
                this.top(children);
            }
            if (children.length <= num) {
                return value;
            }
            else {
                return value.children = children.splice(0, num)
            }
        })
    }
}

function writeFileSync(data, fileName) {
    data = JSON.stringify(data);
    fs.writeFileSync(fileName, data);
}
// const labelTree = new LabelTree(mockData);
// console.log(labelTree.tree);
// writeFileSync(labelTree.tree, './test.json')

export default VideoLabelTree;
