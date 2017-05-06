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
    arrayToTree(nodes, parent, tree) {
        const that = this;
        var map = {}, node, roots = [];
        for (var i = 0; i < nodes.length; i += 1) {
            node = nodes[i];
            node.children = [];
            map[node.name] = i; // use map to look-up the parents
            if (node.parent !== null) {
                nodes[map[node.parent]].children.push(node);
            } else {
                roots.push(node);
            }
        }
        this.addUvToTree(this.uvHash, roots);
        return roots;
    },

    /**
     * 添加标签到Tree
     */
    addUvToTree(uvs, items) {
        const that = this;
        items.forEach(function (label, index) {

            if (uvs[label.name]) {
                label.count = uvs[label.name].count;
            }

            if (label.children.length > 0) {
                that.addUvToTree(uvs, label.children);
            }
        });

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