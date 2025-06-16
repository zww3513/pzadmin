
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

  // 初始化 simulation, link, node
  simulation = d3.forceSimulation(data.nodes)
    .force("link", d3.forceLink(data.links).id(d => d.id).distance(500))
    .force("charge", d3.forceManyBody().strength(-800))
    .force("center", d3.forceCenter(width / 2, height / 2))

  link = g.append("g")
    .attr("stroke", "#999")
    .attr("stroke-opacity", 10)
    .selectAll("line")
    .data(data.links)
    .join("line")
    .attr("stroke-width", 5)
    .attr("stroke", d => d.status === "up" ? "#4CAF50" : "#F44336")

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
