<template>
    <div class="topology-container">
        <svg ref="svgRef" width="100%" height="600"></svg>
    </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import * as d3 from 'd3'

const svgRef = ref(null)
let simulation = null
let link = null
let node = null

// 获取数据（模拟数据）
const data = ref({
    nodes: [
        {
            id: "N123",
            type: "Database",
            address: "192.168.1.10:3306",
            status: "up",
            reason: "running",
            updatedAt: "2025-04-05T14:48:00Z"
        },
        {
            id: "N456",
            type: "API",
            address: "192.168.1.20:8080",
            status: "down",
            reason: "unreachable",
            updatedAt: "2025-04-05T14:47:00Z"
        }
    ],
    edges: [
        {
            id: "E1",
            source: "N123",
            target: "N456",
            status: "down",
            reason: "dependent node is down",
            lastChecked: "2025-04-05T14:48:00Z"
        }
    ]
})

// 格式化数据（为 D3 做准备）
function formatData(data) {
    const nodesMap = {}
    data.nodes.forEach(n => {
        nodesMap[n.id] = n
    })

    return {
        nodes: data.nodes,
        links: data.edges.map(e => ({
            source: e.source,
            target: e.target,
            status: e.status,
            reason: e.reason
        }))
    }
}

// 渲染拓扑图
function renderTopology(data) {
    const width = svgRef.value.clientWidth
    const height = 600

    // 设置缩放行为
    const zoom = d3.zoom().on("zoom", (event) => {
        g.attr("transform", event.transform)
    })

    // 创建 SVG
    const svg = d3.select(svgRef.value)
        .attr("width", width)
        .attr("height", height)
        .call(zoom)

    const g = svg.append("g")

    // 设置力模拟
    simulation = d3.forceSimulation(data.nodes)
        .force("link", d3.forceLink(data.links).id(d => d.id).distance(200))
        .force("charge", d3.forceManyBody().strength(-400))
        .force("center", d3.forceCenter(width / 2, height / 2))

    // 创建边（带状态）
    link = g.append("g")
        .attr("stroke-width", 2)
        .selectAll("line")
        .data(data.links)
        .join("line")
        .attr("stroke", d => d.status === "up" ? "#4CAF50" : "#F44336") // 状态决定颜色
        .attr("stroke-dasharray", d => {
            if (d.status === "down") return "5,5" // 虚线
            if (d.status === "warning") return "3,3" // 虚线
            return "none" // 实线
        })

    // 创建边标签
    const linkLabels = g.append("g")
        .selectAll("text")
        .data(data.links)
        .join("text")
        .text(d => d.status === "up" ? "✅ Normal" :
            d.status === "down" ? "❌ Down" : "⚠️ Warning")
        .attr("fill", "#333")
        .attr("font-size", "12px")
        .attr("text-anchor", "middle")
        .attr("dy", 10)

    // 创建节点（优化显示）
    node = g.append("g")
        .attr("stroke", "#fff")
        .attr("stroke-width", 2)
        .selectAll("g")
        .data(data.nodes)
        .join("g")
        .call(drag(simulation))

    // 节点形状区分
    node.append("rect")
        .attr("width", 100)
        .attr("height", 40)
        .attr("fill", d => d.type === "API" ? "#F44336" : "#4CAF50")

    // 节点标签仅显示类型
    node.append("text")
        .text(d => d.type)
        .attr("fill", "#fff")
        .attr("text-anchor", "middle")
        .attr("dy", "1em")

    // 更新位置
    simulation.on("tick", () => {
        link
            .attr("x1", d => d.source.x)
            .attr("y1", d => d.source.y)
            .attr("x2", d => d.target.x)
            .attr("y2", d => d.target.y)

        linkLabels
            .attr("x", d => (d.source.x + d.target.x) / 2)
            .attr("y", d => (d.source.y + d.target.y) / 2)

        node
            .attr("transform", d => `translate(${d.x},${d.y})`)
    })

    // 交互：点击节点显示详情
    node.on("click", function (event, d) {
        alert(`Node: ${d.id}\nType: ${d.type}\nStatus: ${d.status}\nAddress: ${d.address}`)
    })
}

// 拖拽行为
function drag(simulation) {
    return d3.drag()
        .on("start", (event, d) => {
            if (!event.active) simulation.alphaTarget(0.3).restart()
            d.fx = d.x
            d.fy = d.y
        })
        .on("drag", (event, d) => {
            d.fx = event.x
            d.fy = event.y
        })
        .on("end", (event, d) => {
            if (!event.active) simulation.alphaTarget(0)
            d.fx = null
            d.fy = null
        })
}

// 初始化
onMounted(() => {
    const formatted = formatData(data.value)
    renderTopology(formatted)
})
</script>

<style scoped>
.topology-container {
    width: 100%;
    height: 100%;
    overflow: hidden;
}
</style>