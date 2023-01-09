function data2map(data) {
    var map = new Map();
    data.forEach(element => {
        map.set(element.name, element.value.toFixed(2))
    });
    return map;
}

var gdp_data = averageGDP
var gdp_map = data2map(averageGDP)
var edu_data = edu_heatmapData
var edu_map = data2map(edu_heatmapData)
var hap_data = happiness
var hap_map = data2map(happiness)
var geoCoordMap = geoCoord
var aligned_header = new Array()
var aligned_gdp_data = new Array()
var aligned_hap_data = new Array()
var rate_data = new Array()

var aligned_header_edu = new Array();
var aligned_edu_data = new Array()
var aligned_hap_edu_data = new Array()
var rate_data_edu = new Array()

gdp_data.sort((a, b) => {
    return a.value - b.value
})

gdp_data.forEach(element => {
    element.value = element.value.toFixed(2);
})

edu_data.sort((a, b) => {
    return a.value - b.value
})

edu_data.forEach(element => {
    element.value = element.value.toFixed(2);
    aligned_header_edu.push(element.name)
    aligned_edu_data.push(element.value)
    aligned_hap_edu_data.push(hap_map.get(element.name))
    rate_data_edu.push((hap_map.get(element.name)/element.value).toFixed(2))
})

hap_data.sort((a, b) => {
    return a.value - b.value
})

hap_data.forEach(element => {
    element.value = element.value.toFixed(2);
    aligned_header.push(element.name)
    aligned_gdp_data.push(gdp_map.get(element.name))
    aligned_edu_data.push(edu_map.get(element.name))
    aligned_hap_data.push(element.value)
    rate_data.push((element.value/gdp_map.get(element.name)).toFixed(2))
    rate_data_edu.push((element.value/edu_map.get(element.name)).toFixed(2))
})

var max = 480,
    min = 9; // todo 
var maxSize4Pin = 100,
    minSize4Pin = 20;

var convertData = function (data) {
    var res = [];
    for (var i = 0; i < data.length; i++) {
        var Coord = geoCoordMap[data[i].name];
        if (Coord) {
            res.push({
                name: data[i].name,
                value: Coord.concat(data[i].value),
                visualMap: false,

            });
        }
    }
    return res;
};

var getName = function (data) {
    var res = [];
    for (var i = 0; i < data.length; i++) {
        res.push(data[i].name);
    }
    return res;
};

var getValue = function (data) {
    var res = [];
    for (var i = 0; i < data.length; i++) {
        res.push(data[i].value);
    }
    return res;
};

function opt_gdp() {
    return {
        title: [
            {
                text: '亚洲地图', // 主标题文本，支持使用 \n 换行
                //top: 20, // 定位 值: 'top', 'middle', 'bottom' 也可以是具体的值或者百分比
                left: '20px', // 值: 'left', 'center', 'right' 同上
                top: '20px',
                textStyle: { // 文本样式
                    fontSize: 20,
                    fontWeight: 600,
                    color: 'blue'
                }
            },
            {
                id: 'statistic',
                text: "各国发展指数(GDP)",
                left: '65%',
                top: '20px',
                textStyle: {
                    color: 'blue',
                    fontSize: 20
                }
            }
        ],
        tooltip: {
            formatter: function (params, ticket, callback) {
                if (params.seriesName == "GDP") {
                    return params.name + '<br />发展指数(GDP): ' + params.value + '<br />幸福指数: ' + hap_map.get(params.name)
                }
                else if (params.seriesName == "GDP Scatter") {
                    return params.name + '<br />发展指数(GDP): ' + gdp_map.get(params.name)
                }
                else if (params.seriesName == "HAP Scatter") {
                    return params.name + '<br />幸福指数: ' + hap_map.get(params.name)
                }
                else {
                    return params.seriesName + '<br />' + params.name + ': ' + params.value
                }
            }
        },
        nameMap: nameMap,
        visualMap: {
            left: 'left',
            bottom: '10%',
            type: 'continuous', // continuous 类型为连续型  piecewise 类型为分段型
            show: true, // 是否显示 visualMap-continuous 组件 如果设置为 false，不会显示，但是数据映射的功能还存在
            // 指定 visualMapContinuous 组件的允许的最小/大值。'min'/'max' 必须用户指定。
            // [visualMap.min, visualMax.max] 形成了视觉映射的『定义域』
            text: ['发展指数(GDP)'],
            // 文本样式
            textStyle: {
                fontSize: 14,
                color: '#000'
            },
            seriesIndex: 3,
            // splitNumber: 5, // 分段数量
            align: 'right', // 图形在左，文字在右
            showLabel: true, // 显示标注文字
            // orient: 'horizontal', // 水平摆放
            max: 100,
            min: 0,
            realtime: false, // 拖拽时，是否实时更新
            calculable: true, // 是否显示拖拽用的手柄
            // 定义 在选中范围中 的视觉元素
            inRange: {
                color: ['#34495e', '#2980b9', '#1abc9c', '#e67e22', 'red'] // 图元的颜色
                // color: ['#00467F', '#A5CC82'],
            },
        },
        geo: {
            map: "asia",
            roam: true,//不开启缩放和平移
            //zoom: 1.2,//视角缩放比例
            left: '20px',
            right: '50%',
            /*
            label: {
                normal: {
                    show: true,
                    fontSize: 12,
                    color: '#000000'
                },
                emphasis: {
                    show: true,
                    fontSize: 14,
                    color: '#000000'
                }
            },
            */
            itemStyle: {
                normal: {
                    borderColor: 'rgba(0, 0, 0, 0.2)'
                },
                emphasis: {
                    areaColor: '#FFFAF0',//鼠标选择区域颜色
                    shadowOffsetX: 0,
                    shadowOffsetY: 0,
                    shadowBlur: 20,
                    borderWidth: 0,
                    shadowColor: 'rgba(0, 0, 0, 0.5)'
                }
            }
        },
        grid: {
            id: 0,
            left: '60%',
            top: '15%',
            containLabel: true
        },
        /*
        tooltip: {
            trigger: 'axis', // hover触发器
            axisPointer: { // 坐标轴指示器，坐标轴触发有效
                type: 'shadow', // 默认为直线，可选为：'line' | 'shadow'
                shadowStyle: {
                    color: 'rgba(150,150,150,0.1)' //hover颜色
                }
            }
        },
        */
        xAxis: [
            {
                type: 'value',
                name: '发展指数(GDP)',
                // position: 'top',
                // offset: 20,
                min: 0,
                max: 50,
                axisLabel: {
                    margin: 2,
                    // interval: 0,
                    textStyle: {
                        color: '#ddd'
                    }
                },
            },
        ],
        yAxis: {
            type: 'category',
            data: getName(gdp_data),
            axisLabel: {
                interval: 0,
                textStyle: {
                    color: '#ddd'
                }
            },
            // inverse:true,
        },
        series: [
            //柱状图
            {
                name: '发展指数(GDP)',
                type: 'bar',
                emphasis: {
                    focus: 'self'
                },
                data: getValue(gdp_data),
                yAxisIndex: 0
            },
            {
                name: 'GDP Scatter',
                type: 'effectScatter',
                coordinateSystem: 'geo',
                data: convertData(hap_data),
                symbolSize: function (val) {
                    return val[2] * 2;
                },
                /*
                label: {
                    normal: {
                        formatter: '{@[2]}',
                        position: 'bottom',
                        show: false
                    },
                    emphasis: {
                        formatter: '{@[2]}',
                        position: 'bottom',
                        show: true
                    }
                },
                */
                itemStyle: {
                    normal: {
                        color: '#05C3F9'
                    },
                    emphasis: {
                        color: '#05C3F9'
                    }
                }
            },
            {
                name: 'HAP Scatter',
                type: 'scatter',
                coordinateSystem: 'geo',
                symbol: 'pin', //气泡
                symbolSize: function (val) {
                    var a = (maxSize4Pin - minSize4Pin) / (max - min);
                    var b = minSize4Pin - a * min;
                    b = maxSize4Pin - a * max;
                    return 20 * a * val[2] + b;
                },
                label: {
                    normal: {
                        show: true,
                        textStyle: {
                            color: '#fff',
                            fontSize: 9,
                        },
                        formatter: function (params) {
                            return params.value[2];
                        },
                    }
                },
                itemStyle: {
                    normal: {
                        color: '#f62157', //标志颜色
                    }
                },
                zlevel: 6,
                data: convertData(hap_data),
            },
            {
                name: 'GDP',
                type: "map",
                map: "asia",
                geoIndex: 0,
                showLegendSymbol: false,
                /*
                label: {
                    normal: {
                        show: true
                    },
                    emphasis: {
                        show: true,
                        textStyle: {
                            color: '#fff'
                        }
                    }
                },
                */
                roam: true,
                itemStyle: {
                    normal: {
                        areaColor: '#031525',
                        borderColor: '#3B5077',
                    },
                    emphasis: {
                        areaColor: '#2B91B7'
                    }
                },
                animation: false,
                data: gdp_data,
            },
        ],
    };
}

function opt_edu() {
    return {
        title: [
            {
                text: '亚洲地图', // 主标题文本，支持使用 \n 换行
                //top: 20, // 定位 值: 'top', 'middle', 'bottom' 也可以是具体的值或者百分比
                left: '20px', // 值: 'left', 'center', 'right' 同上
                top: '20px',
                textStyle: { // 文本样式
                    fontSize: 20,
                    fontWeight: 600,
                    color: 'blue'
                }
            },
            {
                id: 'statistic',
                text: "各国发展指数(教育)",
                left: '65%',
                top: '20px',
                textStyle: {
                    color: 'blue',
                    fontSize: 20
                }
            }
        ],
        tooltip: {
            formatter: function (params, ticket, callback) {
                if (params.seriesName == "EDU") {
                    return params.name + '<br />发展指数(教育): ' + params.value + '<br />幸福指数: ' + hap_map.get(params.name)
                }
                else if (params.seriesName == "EDU Scatter") {
                    return params.name + '<br />发展指数(教育): ' + edu_map.get(params.name)
                }
                else if (params.seriesName == "HAP Scatter") {
                    return params.name + '<br />幸福指数: ' + hap_map.get(params.name)
                }
                else {
                    return params.seriesName + '<br />' + params.name + ': ' + params.value
                }
            }
        },
        nameMap: nameMap,
        visualMap: {
            left: 'left',
            bottom: '10%',
            type: 'continuous', // continuous 类型为连续型  piecewise 类型为分段型
            show: true, // 是否显示 visualMap-continuous 组件 如果设置为 false，不会显示，但是数据映射的功能还存在
            // 指定 visualMapContinuous 组件的允许的最小/大值。'min'/'max' 必须用户指定。
            // [visualMap.min, visualMax.max] 形成了视觉映射的『定义域』
            text: ['发展指数(教育)'],
            // 文本样式
            textStyle: {
                fontSize: 14,
                color: '#000'
            },
            seriesIndex: 3,
            // splitNumber: 5, // 分段数量
            align: 'right', // 图形在左，文字在右
            showLabel: true, // 显示标注文字
            // orient: 'horizontal', // 水平摆放
            max: 10,
            min: 0,
            realtime: false, // 拖拽时，是否实时更新
            calculable: true, // 是否显示拖拽用的手柄
            // 定义 在选中范围中 的视觉元素
            inRange: {
                color: ['#34495e', '#2980b9', '#1abc9c', '#e67e22', 'red'] // 图元的颜色
                // color: ['#00467F', '#A5CC82'],
            },
        },
        geo: {
            map: "asia",
            roam: true,//不开启缩放和平移
            //zoom: 1.2,//视角缩放比例
            left: '20px',
            right: '50%',
            /*
            label: {
                normal: {
                    show: true,
                    fontSize: 12,
                    color: '#000000'
                },
                emphasis: {
                    show: true,
                    fontSize: 14,
                    color: '#000000'
                }
            },
            */
            itemStyle: {
                normal: {
                    borderColor: 'rgba(0, 0, 0, 0.2)'
                },
                emphasis: {
                    areaColor: '#FFFAF0',//鼠标选择区域颜色
                    shadowOffsetX: 0,
                    shadowOffsetY: 0,
                    shadowBlur: 20,
                    borderWidth: 0,
                    shadowColor: 'rgba(0, 0, 0, 0.5)'
                }
            }
        },
        grid: {
            id: 0,
            left: '60%',
            top: '15%',
            containLabel: true
        },
        /*
        tooltip: {
            trigger: 'axis', // hover触发器
            axisPointer: { // 坐标轴指示器，坐标轴触发有效
                type: 'shadow', // 默认为直线，可选为：'line' | 'shadow'
                shadowStyle: {
                    color: 'rgba(150,150,150,0.1)' //hover颜色
                }
            }
        },
        */
        xAxis: [
            {
                type: 'value',
                name: '发展指数(教育)',
                // position: 'top',
                // offset: 20,
                min: 0,
                max: 50,
                axisLabel: {
                    margin: 2,
                    // interval: 0,
                    textStyle: {
                        color: '#ddd'
                    }
                },
            },
        ],
        yAxis: {
            type: 'category',
            data: getName(edu_data),
            axisLabel: {
                interval: 0,
                textStyle: {
                    color: '#ddd'
                }
            },
            // inverse:true,
        },
        series: [
            //柱状图
            {
                name: '发展指数(教育)',
                type: 'bar',
                emphasis: {
                    focus: 'self'
                },
                data: getValue(edu_data),
                yAxisIndex: 0
            },
            {
                name: 'EDU Scatter',
                type: 'effectScatter',
                coordinateSystem: 'geo',
                data: convertData(edu_data),
                symbolSize: function (val) {
                    return val[2] * 2;
                },
                /*
                label: {
                    normal: {
                        formatter: '{@[2]}',
                        position: 'bottom',
                        show: false
                    },
                    emphasis: {
                        formatter: '{@[2]}',
                        position: 'bottom',
                        show: true
                    }
                },
                */
                itemStyle: {
                    normal: {
                        color: '#05C3F9'
                    },
                    emphasis: {
                        color: '#05C3F9'
                    }
                }
            },
            {
                name: 'HAP Scatter',
                type: 'scatter',
                coordinateSystem: 'geo',
                symbol: 'pin', //气泡
                symbolSize: function (val) {
                    var a = (maxSize4Pin - minSize4Pin) / (max - min);
                    var b = minSize4Pin - a * min;
                    b = maxSize4Pin - a * max;
                    return 20 * a * val[2] + b;
                },
                label: {
                    normal: {
                        show: true,
                        textStyle: {
                            color: '#fff',
                            fontSize: 9,
                        },
                        formatter: function (params) {
                            return params.value[2];
                        },
                    }
                },
                itemStyle: {
                    normal: {
                        color: '#f62157', //标志颜色
                    }
                },
                zlevel: 6,
                data: convertData(hap_data),
            },
            {
                name: 'EDU',
                type: "map",
                map: "asia",
                geoIndex: 0,
                showLegendSymbol: false,
                /*
                label: {
                    normal: {
                        show: true
                    },
                    emphasis: {
                        show: true,
                        textStyle: {
                            color: '#fff'
                        }
                    }
                },
                */
                roam: true,
                itemStyle: {
                    normal: {
                        areaColor: '#031525',
                        borderColor: '#3B5077',
                    },
                    emphasis: {
                        areaColor: '#2B91B7'
                    }
                },
                animation: false,
                data: edu_data,
            },
        ],
    };
}

function opt_hap() {
    return {
        title: [
            {
                text: '亚洲地图', // 主标题文本，支持使用 \n 换行
                //top: 20, // 定位 值: 'top', 'middle', 'bottom' 也可以是具体的值或者百分比
                left: '20px', // 值: 'left', 'center', 'right' 同上
                top: '20px',
                textStyle: { // 文本样式
                    fontSize: 20,
                    fontWeight: 600,
                    color: 'blue'
                }
            },
            {
                id: 'statistic',
                text: "各国幸福指数",
                left: '65%',
                top: '20px',
                textStyle: {
                    color: 'blue',
                    fontSize: 20
                }
            }
        ],
        tooltip: {
            formatter: function (params, ticket, callback) {
                if (params.seriesName == "HAP") {
                    return params.name + '<br />发展指数(GDP): ' + params.value + '<br />幸福指数: ' + hap_map.get(params.name)
                }
                else if (params.seriesName == "GDP Scatter") {
                    return params.name + '<br />发展指数(GDP): ' + gdp_map.get(params.name)
                }
                else if (params.seriesName == "HAP Scatter") {
                    return params.name + '<br />幸福指数: ' + hap_map.get(params.name)
                }
                else {
                    return params.seriesName + '<br />' + params.name + ': ' + params.value
                }
            }
        },
        nameMap: nameMap,
        visualMap: {
            left: 'left',
            bottom: '10%',
            type: 'continuous', // continuous 类型为连续型  piecewise 类型为分段型
            show: true, // 是否显示 visualMap-continuous 组件 如果设置为 false，不会显示，但是数据映射的功能还存在
            // 指定 visualMapContinuous 组件的允许的最小/大值。'min'/'max' 必须用户指定。
            // [visualMap.min, visualMax.max] 形成了视觉映射的『定义域』
            text: ['幸福指数'],
            // 文本样式
            textStyle: {
                fontSize: 14,
                color: '#000'
            },
            seriesIndex: 3,
            // splitNumber: 5, // 分段数量
            align: 'right', // 图形在左，文字在右
            showLabel: true, // 显示标注文字
            // orient: 'horizontal', // 水平摆放
            max: 10,
            min: 0,
            realtime: false, // 拖拽时，是否实时更新
            calculable: true, // 是否显示拖拽用的手柄
            // 定义 在选中范围中 的视觉元素
            inRange: {
                color: ['#34495e', '#2980b9', '#1abc9c', '#e67e22', 'red'] // 图元的颜色
                // color: ['#00467F', '#A5CC82'],
            },
        },
        geo: {
            map: "asia",
            roam: true,//不开启缩放和平移
            //zoom: 1.2,//视角缩放比例
            left: '20px',
            right: '50%',
            /*
            label: {
                normal: {
                    show: true,
                    fontSize: 12,
                    color: '#000000'
                },
                emphasis: {
                    show: true,
                    fontSize: 14,
                    color: '#000000'
                }
            },
            */
            itemStyle: {
                normal: {
                    borderColor: 'rgba(0, 0, 0, 0.2)'
                },
                emphasis: {
                    areaColor: '#FFFAF0',//鼠标选择区域颜色
                    shadowOffsetX: 0,
                    shadowOffsetY: 0,
                    shadowBlur: 20,
                    borderWidth: 0,
                    shadowColor: 'rgba(0, 0, 0, 0.5)'
                }
            }
        },
        grid: {
            id: 0,
            left: '60%',
            top: '15%',
            containLabel: true
        },
        /*
        tooltip: {
            trigger: 'axis', // hover触发器
            axisPointer: { // 坐标轴指示器，坐标轴触发有效
                type: 'shadow', // 默认为直线，可选为：'line' | 'shadow'
                shadowStyle: {
                    color: 'rgba(150,150,150,0.1)' //hover颜色
                }
            }
        },
        */
        xAxis: [
            {
                type: 'value',
                name: '幸福指数',
                // position: 'top',
                min: 0,
                max: 10,
                axisLabel: {
                    margin: 2,
                    // interval: 0,
                    textStyle: {
                        color: '#ddd'
                    }
                },
            }
        ],
        yAxis: {
            type: 'category',
            data: getName(hap_data),
            axisLabel: {
                interval: 0,
                textStyle: {
                    color: '#ddd'
                }
            },
            // inverse:true,
        },
        series: [
            {
                name: '幸福指数',
                type: 'bar',
                emphasis: {
                    focus: 'self'
                },
                data: getValue(hap_data),
                yAxisIndex: 0
            },
            {
                name: 'GDP Scatter',
                type: 'effectScatter',
                coordinateSystem: 'geo',
                data: convertData(hap_data),
                symbolSize: function (val) {
                    return val[2] * 2;
                },
                /*
                label: {
                    normal: {
                        formatter: '{@[2]}',
                        position: 'bottom',
                        show: false
                    },
                    emphasis: {
                        formatter: '{@[2]}',
                        position: 'bottom',
                        show: true
                    }
                },
                */
                itemStyle: {
                    normal: {
                        color: '#05C3F9'
                    },
                    emphasis: {
                        color: '#05C3F9'
                    }
                }
            },
            {
                name: 'HAP Scatter',
                type: 'scatter',
                coordinateSystem: 'geo',
                symbol: 'pin', //气泡
                symbolSize: function (val) {
                    var a = (maxSize4Pin - minSize4Pin) / (max - min);
                    var b = minSize4Pin - a * min;
                    b = maxSize4Pin - a * max;
                    return 20 * a * val[2] + b;
                },
                label: {
                    normal: {
                        show: true,
                        textStyle: {
                            color: '#fff',
                            fontSize: 9,
                        },
                        formatter: function (params) {
                            return params.value[2];
                        },
                    }
                },
                itemStyle: {
                    normal: {
                        color: '#f62157', //标志颜色
                    }
                },
                zlevel: 6,
                data: convertData(hap_data),
            },
            {
                name: 'HAP',
                type: "map",
                map: "asia",
                geoIndex: 0,
                showLegendSymbol: false,
                /*
                label: {
                    normal: {
                        show: true
                    },
                    emphasis: {
                        show: true,
                        textStyle: {
                            color: '#fff'
                        }
                    }
                },
                */
                roam: true,
                itemStyle: {
                    normal: {
                        areaColor: '#031525',
                        borderColor: '#3B5077',
                    },
                    emphasis: {
                        areaColor: '#2B91B7'
                    }
                },
                animation: false,
                data: hap_data,
            },
        ],
    };
}

function onShowMixBarGDP() {
    var chartDom = document.getElementById('mix_bar');
    var myChart = echarts.init(chartDom);
    var option = {
        tooltip: {
            trigger: 'axis',
            axisPointer: {
                type: 'cross',
                crossStyle: {
                    color: '#999'
                }
            }
        },
        legend: {
            data: ['发展指数(GDP)', '幸福指数', '幸福指数/发展指数(GDP)']
        },
        xAxis: [
            {
                type: 'category',
                data: aligned_header,
                axisPointer: {
                    type: 'shadow'
                }
            }
        ],
        yAxis: [
            {
                type: 'value',
                name: '发展指数(GDP)',
                min: 0,
                max: 80,
                axisLabel: {
                    formatter: '{value}'
                }
            },
            {
                type: 'value',
                name: '幸福指数',
                min: 0,
                max: 10,
                axisLabel: {
                    formatter: '{value}'
                }
            }
        ],
        series: [
            {
                name: '发展指数(GDP)',
                type: 'bar',
                tooltip: {
                    valueFormatter: function (value) {
                        return value;
                    }
                },
                data: aligned_gdp_data
            },
            {
                name: '幸福指数',
                type: 'bar',
                tooltip: {
                    valueFormatter: function (value) {
                        return value;
                    }
                },
                data: aligned_hap_data
            },
            {
                name: '幸福指数/发展指数(GDP)',
                type: 'line',
                yAxisIndex: 1,
                tooltip: {
                    valueFormatter: function (value) {
                        return value;
                    }
                },
                data: rate_data
            }
        ]
    };
    option && myChart.setOption(option, true);
}

function onShowMixBarEDU() {
    var chartDom = document.getElementById('mix_bar');
    var myChart = echarts.init(chartDom);
    var option = {
        tooltip: {
            trigger: 'axis',
            axisPointer: {
                type: 'cross',
                crossStyle: {
                    color: '#999'
                }
            }
        },
        legend: {
            data: ['发展指数(教育)', '幸福指数', '幸福指数/发展指数(教育)']
        },
        xAxis: [
            {
                type: 'category',
                data: aligned_header_edu,
                axisPointer: {
                    type: 'shadow'
                }
            }
        ],
        yAxis: [
            {
                type: 'value',
                name: '发展指数(教育)',
                min: 0,
                max: 10,
                axisLabel: {
                    formatter: '{value}'
                }
            },
            {
                type: 'value',
                name: '幸福指数',
                min: 0,
                max: 10,
                axisLabel: {
                    formatter: '{value}'
                }
            }
        ],
        series: [
            {
                name: '发展指数(教育)',
                type: 'bar',
                tooltip: {
                    valueFormatter: function (value) {
                        return value;
                    }
                },
                data: aligned_edu_data
            },
            {
                name: '幸福指数',
                type: 'bar',
                tooltip: {
                    valueFormatter: function (value) {
                        return value;
                    }
                },
                data: aligned_hap_edu_data
            },
            {
                name: '幸福指数/发展指数(教育)',
                type: 'line',
                yAxisIndex: 1,
                tooltip: {
                    valueFormatter: function (value) {
                        return value;
                    }
                },
                data: rate_data_edu
            }
        ]
    };
    option && myChart.setOption(option, true);
}

function onSelectGDP() {
    echarts.registerMap("asia", asiageo);
    var myChart = echarts.init(document.getElementById('main'));
    myChart.setOption(opt_gdp(), true);
    onShowMixBarGDP();
}

function onSelectEDU() {
    echarts.registerMap("asia", asiageo);
    var myChart = echarts.init(document.getElementById('main'));
    myChart.setOption(opt_edu(), true);
    onShowMixBarEDU();
}

function onSelectHAP() {
    echarts.registerMap("asia", asiageo);
    var myChart = echarts.init(document.getElementById('main'));
    myChart.setOption(opt_hap(), true);
}

let mainNav = document.querySelector('.navbar');

let navbarToggle = document.querySelector('.navbar-toggle');

navbarToggle.addEventListener('click', function () {
    mainNav.classList.toggle('navbar--open');
});

onSelectGDP();