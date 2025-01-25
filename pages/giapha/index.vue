<template>
  <div class="tree-wrapper">
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

    <v-network-graph
        :nodes="nodes"
        :edges="edges"
        :layouts="layouts"
        :configs="configs"
        @node-click="handleNodeClick"
    />
    <FamilyInfoModal
        v-if="showModal"
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
  components: { VNetworkGraph, FamilyInfoModal },
  data() {
    return {
      showModal: false,
      selectedNode: null,
      nodes: familyData.nodes,
      edges: {},
      layouts: {
        nodes: {}
      },
      configs: {
        node: {
          normal: {
            type: 'circle',
            radius: 18,
            color: '#4169E1',
            label: {
              visible: true,
              fontSize: 20,
              color: '#FFFFFF',
              direction: 'center',
              formatter: (node) => `${node.name.split(' ').pop()}\n(${node.birthYear})`
            }
          },
          hover: {
            scale: 1.2
          }
        },
        edge: {
          normal: {
            width: 3,
            color: '#808080'
          },
          hover: {
            width: 4
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
  mounted() {
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

      const levelHeight = 120
      Object.entries(generations).forEach(([gen, nodes]) => {
        const y = parseInt(gen) * levelHeight
        const width = Math.max(document.body.clientWidth, nodes.length * 200)
        const startX = (width - (nodes.length - 1) * 200) / 2

        nodes.forEach((node, index) => {
          this.layouts.nodes[node.id] = {
            x: startX + index * 200,
            y
          }
        })
      })
    }
  }
}
</script>

<style scoped>
.tree-wrapper {
  width: 100%;
  height: 800px;
  overflow: auto;
  position: relative;
  background: white;
}
</style>