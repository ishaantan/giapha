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
        :nodes="filteredNodes"
        :edges="filteredEdges"
        :layouts="layouts"
        :configs="configs"
    >
      <template #override-node="slotProps">
        <v-shape
            v-bind="slotProps"
            @click="handleNodeClick(slotProps.nodeId)"
        />
      </template>
    </v-network-graph>

    <FamilyInfoModal
        :show="showModal"
        :node="selectedNode"
        :children="selectedNodeChildren"
        @close="closeModal"
    />
  </div>
</template>

<script>
import { VNetworkGraph, VShape } from 'v-network-graph'
import 'v-network-graph/lib/style.css'
import FamilyInfoModal from './FamilyInfoModal.vue'
import { familyData } from './familyData'
import _ from 'lodash'

export default {
  name: 'FamilyTreeLayout',
  components: {
    VNetworkGraph,
    VShape,
    FamilyInfoModal
  },
  data() {
    return {
      showModal: false,
      selectedNode: null,
      nodes: familyData.nodes,
      edges: {},
      layouts: {
        nodes: {}
      },
      searchQuery: '',
      relatedNodes: new Set(),
      nodeSearchCache: new Map(),
      relationshipCache: new Map(),
      configs: {
        view: {
          scalingObjects: true,
          minZoomLevel: 0.2,
          maxZoomLevel: 2,
        },
        node: {
          normal: {
            type: 'circle',
            radius: 18,
            color: (node) => {
              const colors = ['#4169E1', '#1E90FF', '#00BFFF', '#87CEEB', '#87CEFA']
              return colors[node.generation - 1] || '#4169E1'
            },
            label: {
              visible: true,
              fontSize: 20,
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
    // Initialize debounced search
    this.debouncedSearch = _.debounce(this.performSearch, 300)

    // Initialize node search memoization
    this.memoizedFindNodes = _.memoize(
        (query) => {
          const searchLower = query.toLowerCase()
          return Object.entries(this.nodes)
              .filter(([, node]) => node.name.toLowerCase().includes(searchLower))
              .map(([id]) => id)
        },
        (query) => query.toLowerCase()
    )

    // Build relationship cache
    this.buildRelationshipCache()
  },
  mounted() {
    this.initializeEdges()
    this.calculateLayout()
  },
  beforeDestroy() {
    // Clean up debounce
    this.debouncedSearch.cancel()
  },
  methods: {
    buildRelationshipCache() {
      // Build cache of relationships for each node
      Object.keys(this.nodes).forEach(nodeId => {
        if (!this.relationshipCache.has(nodeId)) {
          const related = new Set()
          this.findRelatedNodes(nodeId, related)
          this.relationshipCache.set(nodeId, related)
        }
      })
    },

    findRelatedNodes(nodeId, relatedSet) {
      const node = this.nodes[nodeId]
      if (!node || relatedSet.has(nodeId)) return

      // Add current node
      relatedSet.add(nodeId)

      // Find all ancestors (đi lên trên)
      this.findAncestors(nodeId, relatedSet)

      // Find all descendants (đi xuống dưới)
      this.findDescendants(nodeId, relatedSet)
    },

    findAncestors(nodeId, relatedSet) {
      const node = this.nodes[nodeId]
      if (!node) return

      // Add current node and spouse(s)
      relatedSet.add(nodeId)
      if (node.spouses) {
        node.spouses.forEach(spouse => relatedSet.add(spouse.id))
      }

      // Find and add parents
      if (node.motherId) {
        // Add mother
        relatedSet.add(node.motherId)

        // Find father through mother
        const father = Object.values(this.nodes).find(n =>
            n.spouses && n.spouses.some(s => s.id === node.motherId)
        )
        if (father) {
          relatedSet.add(father.id)
          // Recursively find father's ancestors
          this.findAncestors(father.id, relatedSet)
        }
      }
    },

    findDescendants(nodeId, relatedSet) {
      const children = this.getChildren(nodeId)

      children.forEach(child => {
        // Add child and their spouse(s)
        relatedSet.add(child.id)
        if (child.spouses) {
          child.spouses.forEach(spouse => relatedSet.add(spouse.id))
        }

        // Recursively find child's descendants
        this.findDescendants(child.id, relatedSet)
      })
    },

    handleSearch() {
      if (!this.searchQuery) {
        this.relatedNodes.clear()
        return
      }
      this.debouncedSearch(this.searchQuery)
    },

    performSearch(query) {
      // Clear current results
      this.relatedNodes.clear()

      // Use memoized search to find matching nodes
      const matchingIds = this.memoizedFindNodes(query)

      // For each matching node, find its family connections
      matchingIds.forEach(id => {
        this.findRelatedNodes(id, this.relatedNodes)
      })
    },

    clearSearch() {
      this.searchQuery = ''
      this.relatedNodes.clear()
    },

    handleNodeClick(nodeId) {
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
            y: y
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

.event-logs {
  position: absolute;
  inset: auto 10px 10px auto;
  margin-left: 10px;
  padding: 10px;
  background: #ffff0044;
  border-radius: 4px;
  font-size: 11px;
  font-family: monospace;
  line-height: 11px;
  pointer-events: none;
  z-index: 1000;
}

.event-logs div {
  word-break: break-all;
}
</style>