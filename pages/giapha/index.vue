<!-- FamilyTreeLayout.vue -->
<template>
  <div class="tree-container">
    <!-- Search box -->
    <div class="search-box">
      <input
          type="text"
          v-model="searchQuery"
          placeholder="Tìm kiếm theo tên..."
          @input="handleSearch"
      />
      <button v-if="searchQuery" @click="clearSearch" class="clear-btn">×</button>
    </div>

    <div class="zoom-controls">
      <button @click="zoomIn">+</button>
      <button @click="zoomOut">-</button>
    </div>

    <div class="scroll-container" :style="{ transform: `scale(${zoom})` }">
      <v-network-graph
          :nodes="filteredNodes"
          :edges="filteredEdges"
          :layouts="layouts"
          :configs="configs"
          :width="2000"
          :height="1500"
          @node-click="handleNodeClick"
      />
    </div>

    <FamilyInfoModal
        :show="showModal"
        :node="selectedNode"
        :children="selectedNodeChildren"
        @close="closeModal"
    />
  </div>
</template>

<script>
import { VNetworkGraph } from 'v-network-graph'
import 'v-network-graph/lib/style.css'
import FamilyInfoModal from './FamilyInfoModal.vue'
import { familyData } from './familyData'

export default {
  name: 'FamilyTreeLayout',
  components: {
    VNetworkGraph,
    FamilyInfoModal
  },
  data() {
    return {
      zoom: 1,
      showModal: false,
      selectedNode: null,
      nodes: familyData.nodes,
      edges: {},
      layouts: {
        nodes: {}
      },
      searchQuery: '',
      relatedNodes: new Set(), // Store IDs of related nodes
      configs: {
        view: {
          scalingObjects: true,
          minZoomLevel: 0.2,
          maxZoomLevel: 2,
        },
        node: {
          normal: {
            type: 'circle',
            radius: 35,
            color: (node) => {
              const colors = ['#4169E1', '#1E90FF', '#00BFFF', '#87CEEB', '#87CEFA']
              return colors[node.generation - 1] || '#4169E1'
            },
            label: {
              visible: true,
              fontSize: 16,
              color: '#FFFFFF',
              direction: 'center',
              formatter: (node) => `${node.name.split(' ').pop()}\n(${node.birthYear})`
            }
          },
          hover: {
            scale: 1.2,
          }
        },
        edge: {
          normal: {
            width: 3,
            color: '#808080',
            linecap: 'round'
          },
          hover: {
            width: 4,
            color: '#404040'
          }
        }
      }
    }
  },
  computed: {
    selectedNodeChildren() {
      if (!this.selectedNode) return []
      return this.getChildren(this.selectedNode.id)
    },
    filteredNodes() {
      if (!this.searchQuery) return this.nodes
      return Object.fromEntries(
          Object.entries(this.nodes)
              .filter(([id]) => this.relatedNodes.has(id))
      )
    },
    filteredEdges() {
      if (!this.searchQuery) return this.edges
      return Object.fromEntries(
          Object.entries(this.edges)
              .filter(([, edge]) =>
                  this.relatedNodes.has(edge.source) &&
                  this.relatedNodes.has(edge.target)
              )
      )
    }
  },
  created() {
    this.initializeEdges()
    this.calculateLayout()
  },
  methods: {
    handleSearch() {
      if (!this.searchQuery) {
        this.relatedNodes.clear()
        return
      }

      const searchLower = this.searchQuery.toLowerCase()
      this.relatedNodes.clear()

      // Find matching nodes
      Object.entries(this.nodes).forEach(([id, node]) => {
        if (node.name.toLowerCase().includes(searchLower)) {
          this.addRelatedNodes(id)
        }
      })
    },
    addRelatedNodes(nodeId) {
      // Add the node itself
      this.relatedNodes.add(nodeId)
      const node = this.nodes[nodeId]

      // Add parents
      if (node.motherId) {
        const father = Object.values(this.nodes).find(n =>
            n.spouses && n.spouses.some(s => s.id === node.motherId)
        )
        if (father) {
          this.addRelatedNodes(father.id)
        }
      }

      // Add children
      const children = this.getChildren(nodeId)
      children.forEach(child => {
        this.addRelatedNodes(child.id)
      })
    },
    clearSearch() {
      this.searchQuery = ''
      this.relatedNodes.clear()
    },
    // ... rest of the existing methods remain the same
    handleNodeClick(nodeId) {
      console.log('Node clicked:', nodeId)
      this.selectedNode = this.nodes[nodeId]
      this.showModal = true
    },
    closeModal() {
      this.showModal = false
      this.selectedNode = null
    },
    getChildren(nodeId) {
      return Object.values(this.nodes).filter(node =>
          Object.values(this.edges).some(edge =>
              edge.type === 'parent-child' &&
              edge.source === nodeId &&
              edge.target === node.id
          )
      )
    },
    initializeEdges() {
      Object.values(this.nodes).forEach(node => {
        if (node.motherId) {
          const father = Object.values(this.nodes).find(n =>
              n.spouses && n.spouses.some(s => s.id === node.motherId)
          )
          if (father) {
            this.edges[`${father.id}-${node.id}`] = {
              source: father.id,
              target: node.id,
              type: 'parent-child'
            }
          }
        }
      })
    },
    calculateLayout() {
      const generations = {}
      Object.values(this.nodes).forEach(node => {
        if (!generations[node.generation]) generations[node.generation] = []
        generations[node.generation].push(node)
      })

      const levelHeight = 250
      const nodeSpacing = 200
      Object.entries(generations).forEach(([gen, nodes]) => {
        const y = (parseInt(gen) - 1) * levelHeight + 50
        const totalWidth = (nodes.length - 1) * nodeSpacing
        const startX = (2000 - totalWidth) / 2

        nodes.forEach((node, index) => {
          this.layouts.nodes[node.id] = {
            x: startX + index * nodeSpacing,
            y: y
          }
        })
      })
    },
    zoomIn() {
      this.zoom = Math.min(2, this.zoom + 0.1)
    },
    zoomOut() {
      this.zoom = Math.max(0.5, this.zoom - 0.1)
    }
  }
}
</script>

<style scoped>
.tree-container {
  width: 100%;
  min-height: 100vh;
  background-color: #FFFFFF;
  position: relative;
  display: flex;
  flex-direction: column;
}

.search-box {
  position: fixed;
  top: 20px;
  left: 20px;
  z-index: 1000;
  display: flex;
  align-items: center;
  background: white;
  border-radius: 8px;
  padding: 8px;
  box-shadow: 0 2px 4px rgba(0,0,0,0.1);
}

.search-box input {
  border: 1px solid #ddd;
  padding: 8px 12px;
  border-radius: 4px;
  width: 200px;
  font-size: 14px;
}

.clear-btn {
  background: none;
  border: none;
  font-size: 20px;
  color: #666;
  cursor: pointer;
  padding: 0 8px;
}

.clear-btn:hover {
  color: #333;
}

/* Rest of the existing styles remain the same */
.scroll-container {
  width: 100%;
  height: 100%;
  min-height: 100vh;
  overflow: auto;
  transform-origin: top left;
}

.zoom-controls {
  position: fixed;
  top: 20px;
  right: 20px;
  z-index: 1000;
  display: flex;
  gap: 8px;
}

.zoom-controls button {
  width: 40px;
  height: 40px;
  border: 2px solid #ddd;
  background: white;
  border-radius: 8px;
  cursor: pointer;
  font-size: 20px;
  display: flex;
  align-items: center;
  justify-content: center;
  box-shadow: 0 2px 4px rgba(0,0,0,0.1);
}

.zoom-controls button:hover {
  background: #f5f5f5;
}
</style>