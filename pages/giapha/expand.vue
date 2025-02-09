<script setup lang="ts">
import { computed, reactive, ref } from "vue"
import * as vNG from "v-network-graph"
import { ForceLayout } from "v-network-graph/lib/force-layout"

import { TreeNodes, TreeNode } from "./data"
import * as data from "./data"

// Nodes containing parent-child relationships
const nodeTree = reactive(data.nodeTree)

// Flatten and hide collapsed nodes
const nodes = computed<TreeNodes>(() => {
  const n: TreeNodes = {}
  walkExpandedNodes(nodeTree, node => (n[node.id] = node))
  return n
})
const edges = reactive(data.edges)
const layouts = reactive<vNG.Layouts>(data.layouts)
const layoutsBackup: vNG.NodePositions = {}
const zoomLevel = ref(1.0)

const configs = reactive(
    vNG.defineConfigs<TreeNode>({
      view: {
        layoutHandler: new ForceLayout(),
      },
      node: {
        normal: {
          color: n => (n.children ? "#0000cc" : "#8888aa"),
        },
      },
    })
)

const eventHandlers: vNG.EventHandlers = {
  "node:click": ({ node }) => {
    // Perform nodes expand/collapse
    const children = nodes.value[node]?.children
    const parentPos = layouts.nodes[node]
    if (children && parentPos) {
      // Toggle expand/collapse
      nodes.value[node].collapse = !nodes.value[node].collapse
      if (nodes.value[node].collapse) {
        // Backup position relative to parent node
        Object.values(children).forEach(n => {
          const pos = layouts.nodes[n.id]
          layoutsBackup[n.id] = {
            x: pos ? pos.x - parentPos.x : 0,
            y: pos ? pos.y - parentPos.y : 0,
          }
        })
      } else {
        // Restore position relative to parent node
        const z = zoomLevel.value
        Object.values(children).forEach((n, i) => {
          const pos = layoutsBackup[n.id]
          // If no previous position is available, place it at
          // a shifted position from the parent's.
          layouts.nodes[n.id] = {
            x: pos ? pos.x + parentPos.x : parentPos.x + (30 * (i + 1)) / z,
            y: pos ? pos.y + parentPos.y : parentPos.y + (30 * (i + 1)) / z,
          }
          delete layoutsBackup[n.id]
        })
      }
    }
  },
}

// Place +/- badge layer over nodes layer
const layers: vNG.Layers = { badge: "nodes" }

function walkExpandedNodes(nodes: TreeNodes, cb: (node: TreeNode) => void) {
  for (const n of Object.values(nodes)) {
    cb(n)
    if (!n.collapse && n.children) {
      walkExpandedNodes(n.children, cb)
    }
  }
}
</script>

<template>
  <v-network-graph
      class="graph"
      :nodes="nodes"
      :edges="edges"
      :configs="configs"
      :layers="layers"
      :layouts="layouts"
      :event-handlers="eventHandlers"
      v-model:zoomLevel="zoomLevel"
  >
    <!-- +/- badge layer -->
    <template #badge="{ scale }">
      <template v-for="(pos, node) in layouts.nodes" :key="node">
        <g
            v-if="nodes[node]?.children"
            class="collapse-badge"
            :transform="`translate(${pos.x + 9 * scale}, ${pos.y - 9 * scale})`"
        >
          <circle
              :cx="0"
              :cy="0"
              :r="7 * scale"
              :fill="nodes[node].collapse ? '#00cc00' : '#ff5555'"
          />
          <text text-anchor="middle" :transform="`scale(${scale})`">
            <template v-if="nodes[node].collapse">+</template>
            <template v-else>-</template>
          </text>
        </g>
      </template>
    </template>
  </v-network-graph>
</template>

<style>
.collapse-badge {
  pointer-events: none;
}
.collapse-badge text {
  font-size: 14px;
  stroke: #fff;
  text-anchor: middle;
  dominant-baseline: middle;
}
</style>