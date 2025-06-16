<template>
  <el-button @click="test">修改拓扑</el-button>
  <div class="topology-container">
    <svg ref="svgRef" width="100%" height=95%></svg>
  </div>
</template>

<script setup>
import { ref, onMounted, watch } from 'vue'
import * as d3 from 'd3'
import { da } from 'element-plus/es/locales.mjs'

const svgRef = ref(null)
let simulation = null
let link = null
let node = null

// 格式化数据（为 D3 做准备）
function formatData(data) {
  const nodesMap = {}
  data.nodes.forEach(n => {
    nodesMap[n.id] = n
  })

  return {
    nodes: data.nodes.map(n => ({ ...n })), // 创建 nodes 的副本
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
  if (!svgRef.value) return // 新增空值校验
  // 清除现有 SVG 内容
  d3.select(svgRef.value).selectAll("*").remove()
  const width = svgRef.value.clientWidth
  const height = svgRef.value.clientHeight

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
    .force("link", d3.forceLink(data.links).id(d => d.id).distance(500))
    .force("charge", d3.forceManyBody().strength(-800))
    .force("center", d3.forceCenter(width / 2, height / 2))

  // 创建边
  link = g.append("g")
    .attr("stroke", "#999")
    .attr("stroke-opacity", 10)
    .selectAll("line")
    .data(data.links)
    .join("line")
    .attr("stroke-width", 5)
    .attr("stroke", d => d.status === "up" ? "#4CAF50" : "#F44336")

  // 创建节点
  node = g.append("g")
    .attr("stroke", "#fff")
    .attr("stroke-width", 5)
    .selectAll("circle")
    .data(data.nodes)
    .join("circle")
    .attr("r", 50)
    .attr("fill", d => d.status === "up" ? "#4CAF50" : "#F44336")
    .call(drag(simulation))

  // 创建标签
  const labels = g.append("g")
    .selectAll("text")
    .data(data.nodes)
    .join("text")
    .text(d => d.type)
    .attr("fill", "#fff")
    .attr("text-anchor", "middle")
    .attr("dy", 1)
    .style("pointer-events", "none")

  // 更新位置
  simulation.on("tick", () => {
    link
      .attr("x1", d => d.source.x)
      .attr("y1", d => d.source.y)
      .attr("x2", d => d.target.x)
      .attr("y2", d => d.target.y)

    node
      .attr("cx", d => d.x)
      .attr("cy", d => d.y)

    labels
      .attr("x", d => d.x)
      .attr("y", d => d.y)
  })

  // 交互：点击节点显示详情
  node.on("click", function (event, d) {
    alert(`Node: ${d.id}\nType: ${d.type}\nStatus: ${d.status}\nAddress: ${d.address}`)
  })

  link.on("click", function (event, d) {
    alert(`xxxxxxxxxx`)
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
const data = ref({
  "nodes": [
    {
      "id": "N123",
      "type": "database",
      "address": "mysql.primary:3306",
      "status": "up",
      "reason": "running",
      "updatedAt": "2025-04-05T14:48:00Z"
    },
    {
      "id": "N124",
      "type": "database",
      "address": "redis.cache:6379",
      "status": "up",
      "reason": "running",
      "updatedAt": "2025-04-05T14:47:30Z"
    },
    {
      "id": "N456",
      "type": "api",
      "address": "account-service:8080",
      "status": "down",
      "reason": "unreachable",
      "updatedAt": "2025-04-05T14:47:00Z"
    },
    {
      "id": "N457",
      "type": "api",
      "address": "payment-service:8080",
      "status": "down",
      "reason": "unreachable",
      "updatedAt": "2025-04-05T14:47:00Z"
    },
    {
      "id": "N500",
      "type": "gateway",
      "address": "api-gateway:80",
      "status": "up",
      "reason": "running",
      "updatedAt": "2025-04-05T14:46:00Z"
    },
    {
      "id": "N501",
      "type": "auth",
      "address": "auth-service:5000",
      "status": "up",
      "reason": "running",
      "updatedAt": "2025-04-05T14:45:00Z"
    },
    {
      "id": "N600",
      "type": "cache",
      "address": "varnish-cache:80",
      "status": "down",
      "reason": "connection timeout",
      "updatedAt": "2025-04-05T14:49:00Z"
    },
    {
      "id": "N700",
      "type": "monitoring",
      "address": "prometheus:9090",
      "status": "up",
      "reason": "running",
      "updatedAt": "2025-04-05T14:42:00Z"
    },
    {
      "id": "N800",
      "type": "job-queue",
      "address": "rabbitmq:5672",
      "status": "up",
      "reason": "running",
      "updatedAt": "2025-04-05T14:40:00Z"
    }
  ],
  "edges": [
    {
      "id": "E1",
      "source": "N123",
      "target": "N456",
      "status": "down",
      "reason": "dependent node is down",
      "lastChecked": "2025-04-05T14:48:00Z"
    },
    {
      "id": "E2",
      "source": "N123",
      "target": "N457",
      "status": "down",
      "reason": "dependent node is down",
      "lastChecked": "2025-04-05T14:48:00Z"
    },
    {
      "id": "E3",
      "source": "N124",
      "target": "N456",
      "status": "down",
      "reason": "dependent node is down",
      "lastChecked": "2025-04-05T14:47:30Z"
    },
    {
      "id": "E4",
      "source": "N124",
      "target": "N457",
      "status": "down",
      "reason": "dependent node is down",
      "lastChecked": "2025-04-05T14:47:30Z"
    },
    {
      "id": "E5",
      "source": "N456",
      "target": "N500",
      "status": "down",
      "reason": "source node is down",
      "lastChecked": "2025-04-05T14:48:30Z"
    },
    {
      "id": "E6",
      "source": "N457",
      "target": "N500",
      "status": "down",
      "reason": "source node is down",
      "lastChecked": "2025-04-05T14:48:30Z"
    },
    {
      "id": "E7",
      "source": "N501",
      "target": "N500",
      "status": "up",
      "reason": "active",
      "lastChecked": "2025-04-05T14:49:00Z"
    },
    {
      "id": "E8",
      "source": "N600",
      "target": "N500",
      "status": "down",
      "reason": "source node is down",
      "lastChecked": "2025-04-05T14:49:15Z"
    },
    {
      "id": "E9",
      "source": "N800",
      "target": "N456",
      "status": "down",
      "reason": "target node is down",
      "lastChecked": "2025-04-05T14:49:30Z"
    },
    {
      "id": "E10",
      "source": "N700",
      "target": "N123",
      "status": "up",
      "reason": "active",
      "lastChecked": "2025-04-05T14:50:00Z"
    },
    {
      "id": "E11",
      "source": "N700",
      "target": "N456",
      "status": "down",
      "reason": "target node is down",
      "lastChecked": "2025-04-05T14:50:00Z"
    },
    {
      "id": "E12",
      "source": "N700",
      "target": "N600",
      "status": "down",
      "reason": "target node is down",
      "lastChecked": "2025-04-05T14:50:00Z"
    }
  ]
})

const test = () => {
  data.value = {
    "nodes": [
      {
        "id": "N123",
        "type": "database",
        "address": "mysql.primary:3306",
        "status": "up",
        "reason": "running",
        "updatedAt": "2025-04-05T14:48:00Z"
      },
      {
        "id": "N124",
        "type": "database",
        "address": "redis.cache:6379",
        "status": "up",
        "reason": "running",
        "updatedAt": "2025-04-05T14:47:30Z"
      },
      {
        "id": "N456",
        "type": "api",
        "address": "account-service:8080",
        "status": "down",
        "reason": "unreachable",
        "updatedAt": "2025-04-05T14:47:00Z"
      },
      {
        "id": "N457",
        "type": "api",
        "address": "payment-service:8080",
        "status": "down",
        "reason": "unreachable",
        "updatedAt": "2025-04-05T14:47:00Z"
      },
      {
        "id": "N500",
        "type": "gateway",
        "address": "api-gateway:80",
        "status": "up",
        "reason": "running",
        "updatedAt": "2025-04-05T14:46:00Z"
      },
      {
        "id": "N501",
        "type": "auth",
        "address": "auth-service:5000",
        "status": "up",
        "reason": "running",
        "updatedAt": "2025-04-05T14:45:00Z"
      },
      {
        "id": "N600",
        "type": "cache",
        "address": "varnish-cache:80",
        "status": "down",
        "reason": "connection timeout",
        "updatedAt": "2025-04-05T14:49:00Z"
      },
      {
        "id": "N700",
        "type": "monitoring",
        "address": "prometheus:9090",
        "status": "up",
        "reason": "running",
        "updatedAt": "2025-04-05T14:42:00Z"
      },
      {
        "id": "N800",
        "type": "job-queue",
        "address": "rabbitmq:5672",
        "status": "up",
        "reason": "running",
        "updatedAt": "2025-04-05T14:40:00Z"
      }
    ],
    "edges": [
      {
        "id": "E1",
        "source": "N123",
        "target": "N456",
        "status": "down",
        "reason": "dependent node is down",
        "lastChecked": "2025-04-05T14:48:00Z"
      },
      {
        "id": "E2",
        "source": "N123",
        "target": "N457",
        "status": "down",
        "reason": "dependent node is down",
        "lastChecked": "2025-04-05T14:48:00Z"
      },
      {
        "id": "E3",
        "source": "N124",
        "target": "N456",
        "status": "down",
        "reason": "dependent node is down",
        "lastChecked": "2025-04-05T14:47:30Z"
      },
      {
        "id": "E4",
        "source": "N124",
        "target": "N457",
        "status": "down",
        "reason": "dependent node is down",
        "lastChecked": "2025-04-05T14:47:30Z"
      },
      {
        "id": "E5",
        "source": "N456",
        "target": "N500",
        "status": "down",
        "reason": "source node is down",
        "lastChecked": "2025-04-05T14:48:30Z"
      },
      {
        "id": "E6",
        "source": "N457",
        "target": "N500",
        "status": "down",
        "reason": "source node is down",
        "lastChecked": "2025-04-05T14:48:30Z"
      },
      {
        "id": "E7",
        "source": "N501",
        "target": "N500",
        "status": "up",
        "reason": "active",
        "lastChecked": "2025-04-05T14:49:00Z"
      },
      {
        "id": "E8",
        "source": "N600",
        "target": "N500",
        "status": "down",
        "reason": "source node is down",
        "lastChecked": "2025-04-05T14:49:15Z"
      },
      {
        "id": "E9",
        "source": "N800",
        "target": "N456",
        "status": "down",
        "reason": "target node is down",
        "lastChecked": "2025-04-05T14:49:30Z"
      }
    ]
  }
}
watch(
  () => data.value,
  (newData) => {
    console.log('data changed:', newData)
    const formatted = formatData(data.value)
    renderTopology(formatted)
  }
)

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