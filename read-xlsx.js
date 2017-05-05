var xlsx = require('node-xlsx');
var fs = require('fs');

var LabelTree = {
    data: [],
    labelTree: [],
    uvHash: {},
    currentMAC: '',
    label: [],
    init(data) {
        this.data = data;
        this.getLabel(data[0]);
        this.handleData(data);
    },
    /**
     * 获取 ‘MAC’  ‘标签/Weight’ 属性名
     * @param {*} data 
     */
    getLabel(data) {
        for (var obj in data) {
            this.label.push(obj);
        }
    },
    handleData(data) {
        data.forEach(value => {
            this.flattenArray(value);
        })
    },
    /**
     * 分割拍扁标签成数组
     * @param {*} data 
     */
    flattenArray(data) {
        // 切割多个标签
        this.currentMAC = data[this.label[0]];
        const result = data[this.label[1]].split(',');
        result.forEach((value, index) => {
            // 第一个 replace 去除 =*及后面的数字
            // 后面的replace用于去除空格
            value = value.replace(/\**=\d+/g, '').replace(/^\s\s*/, '').replace(/\s\s*$/, '').split('/');
            this.addParentToArray(value)
        })
    },
    /**
     * 将数组转换为具有父子关系的数组
     * @param {*} data 
     */
    addParentToArray(data) {
        data.forEach((value, index) => {
            if (value) {
                const parent = index === 0 ? null : data[index - 1]

                // 统计标签 UV
                this.countUv(value);

                // 判断当前标签是否已经存在
                const exists = this.labelTree.some(label => label.name === value && label.parent === parent);
                let node = {
                    parent: parent,
                    name: value,
                }
                !exists && this.labelTree.push(node);
            }
        })
    },
    /**
     * 数组转换为tree
     * @param {*} array 
     * @param {*} parent 
     * @param {*} tree 
     */
    arrayToTree(array, parent, tree) {
        const that = this;
        tree = typeof tree !== 'undefined' ? tree : [];
        parent = typeof parent !== 'undefined' ? parent : { name: null };
        const children = array.filter(child => child.parent == parent.name);
        if (children.length > 0) {
            if (parent.name == null) {
                tree = children;
            } else {
                parent['children'] = children
            }
            children.forEach(function (child) { that.arrayToTree(array, child) });
        }
        return tree;
    },
    handleBigArrayListToTree(array) {
        let tree = [];
        console.log(array);
        const _array = [
            array.slice(0, parseInt(array.length / 2)),
            array.slice(parseInt(array.length / 2))
        ]
        console.log(this.arrayToTree(_array[1]));
        // _array.forEach((value) => {
        //     console.log(this.arrayToTree(value));
        //     tree.concat(tree);
        // })
        return tree
    },
    /**
     * 统计标签UV数
     * @param {*} value 
     */
    countUv(value) {
        // 该标签是否已存在
        if (this.uvHash[value]) {
            // 当前标签MAC地址是否与当前遍历标签的MAC地址一致
            if (this.uvHash[value].MAC != this.currentMAC) {
                this.uvHash[value].count++;
                this.uvHash[value].MAC = this.currentMAC;
            }
        }
        else {
            this.uvHash[value] = {
                MAC: this.currentMAC,
                count: 1
            }
        }
    }
}

//读取文件内容
var obj = xlsx.parse(__dirname + '/data/demo.xlsx');
var excelObj = obj[0].data;
// console.log(excelObj);

var data = [];
for (var i in excelObj) {
    var arr = [];
    var value = excelObj[i];
    for (var j in value) {
        arr.push(value[j]);
    }
    data.push(arr);
}

function writeFileSync(data, fileName) {
    data = JSON.stringify(data);
    fs.writeFileSync(fileName, data);
}
// console.log('data: ' + data);
LabelTree.init(data);
console.log(LabelTree.labelTree);
writeFileSync(LabelTree.labelTree, './data/data.json');
// console.log(labelTree.uvHash);
// console.log(LabelTree.arrayToTree(LabelTree.labelTree));