import { Component, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { CostRow, Scenario, ScenarioType, VarianceColumn } from './cost-center.types';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './app.html',
  styleUrl: './app.css',
})
export class App implements OnInit {
  title = 'cost-center';

  // Navigation View state
  activePage: 'dashboard' | 'documentation' = 'dashboard';

  // Hovered Row Id tracking to synchronize split grid row hover effects
  hoveredRowId: string | null = null;

  setView(view: 'dashboard' | 'documentation') {
    this.activePage = view;
  }

  // Site and Team drop-down selections
  sites = ['All Sites', 'Site A - Crown Manufacturing', 'Site B - Plant 2', 'Site C - ERP Core'];
  selectedSite = 'All Sites';
  
  teams = ['All Teams', 'Operations', 'Finance', 'IT Support', 'Supply Chain'];
  selectedTeam = 'All Teams';

  // "Show Other Forecast Scenario" Toggle & Dropdowns
  showOtherForecast = true;
  otherScenarioYear = '2026';
  otherScenarioYears = ['2024', '2025', '2026', '2027', '2028'];

  // Scenarios (columns)
  scenarios: Scenario[] = [
    { id: 'Actual-2024', type: 'Actual', year: 2024, displayName: 'Actual 2024' },
    { id: 'Actual-2025', type: 'Actual', year: 2025, displayName: 'Actual 2025' },
    { id: 'Actual-2026', type: 'Actual', year: 2026, displayName: 'Actual 2026' },
    { id: 'RFC 3-2025', type: 'RFC 3', year: 2025, displayName: 'RFC 3 2025' },
    { id: 'RFC 1-2026', type: 'RFC 1', year: 2026, displayName: 'RFC 1 2026' },
  ];

  // Variance columns configuration
  varianceCols: VarianceColumn[] = [
    { id: 'v1', label: 'V1', compareLeft: 'Actual-2026', compareRight: 'RFC 3-2025' },
    { id: 'v2', label: 'V2', compareLeft: 'Actual-2025', compareRight: 'RFC 1-2026' },
    { id: 'v3', label: 'V3', compareLeft: 'Actual-2024', compareRight: 'RFC 1-2026' },
  ];

  // Row Expand/Collapse State
  expandedCategories = new Set<string>(['Consultancy', 'Training', 'IT Subscription']);

  // Cost Center Rows (Source data)
  costRows: CostRow[] = [];

  // Modal State
  showAddScenarioModal = false;
  newScenarioType: ScenarioType = 'Actual';
  newScenarioYear = 2027;

  // Types list for Selectors
  scenarioTypes: ScenarioType[] = ['Actual', 'Predicted', 'RFC 1', 'RFC 2', 'RFC 3', 'RFC 4'];
  years = [2024, 2025, 2026, 2027, 2028];

  // Drag and Drop Column Reordering variables
  draggedColIndex: number | null = null;
  dragOverColIndex: number | null = null;

  ngOnInit() {
    this.initializeData();
  }

  // Prepopulate with realistic dummy data with site and team properties
  initializeData() {
    this.costRows = [
      {
        id: 'Consultancy',
        account: 'Consultancy',
        isParent: true,
        isExpandable: true,
        values: {},
        children: [
          {
            id: 'Consultancy-1',
            account: '',
            spendType: 'Expense',
            spendLayer: 'ERP',
            category: 'Process Optimization',
            system: 'SAP S4',
            supplier: 'Acumant',
            internalOrder: 'CO-1001',
            itemDescription: 'SAP Process Consulting',
            isParent: false,
            isExpandable: false,
            site: 'Site A - Crown Manufacturing',
            team: 'Finance',
            values: {
              'Actual-2024': 120000,
              'Actual-2025': 135000,
              'Actual-2026': 148000,
              'RFC 3-2025': 142000,
              'RFC 1-2026': 155000
            }
          },
          {
            id: 'Consultancy-2',
            account: '',
            spendType: 'Expense',
            spendLayer: 'Supply Chain',
            category: 'Manufacturing Advisory',
            system: 'Oracle SCM',
            supplier: 'ITC',
            internalOrder: 'CO-1002',
            itemDescription: 'Plant Efficiency Consulting',
            isParent: false,
            isExpandable: false,
            site: 'Site B - Plant 2',
            team: 'Supply Chain',
            values: {
              'Actual-2024': 85000,
              'Actual-2025': 92000,
              'Actual-2026': 105000,
              'RFC 3-2025': 98000,
              'RFC 1-2026': 110000
            }
          }
        ]
      },
      {
        id: 'Training',
        account: 'Training',
        isParent: true,
        isExpandable: true,
        values: {},
        children: [
          {
            id: 'Training-1',
            account: '',
            spendType: 'Expense',
            spendLayer: 'Operations',
            category: 'Plant Training',
            system: 'LMS',
            supplier: 'Acumant',
            internalOrder: 'TR-2001',
            itemDescription: 'Plant Safety Training',
            isParent: false,
            isExpandable: false,
            site: 'Site B - Plant 2',
            team: 'Operations',
            values: {
              'Actual-2024': 45000,
              'Actual-2025': 52000,
              'Actual-2026': 56000,
              'RFC 3-2025': 50000,
              'RFC 1-2026': 58000
            }
          },
          {
            id: 'Training-2',
            account: '',
            spendType: 'Expense',
            spendLayer: 'Compliance',
            category: 'Manufacturing Standards',
            system: 'LMS',
            supplier: 'ITC',
            internalOrder: 'TR-2002',
            itemDescription: 'ISO Compliance Workshop',
            isParent: false,
            isExpandable: false,
            site: 'Site A - Crown Manufacturing',
            team: 'Operations',
            values: {
              'Actual-2024': 30000,
              'Actual-2025': 31000,
              'Actual-2026': 33000,
              'RFC 3-2025': 29000,
              'RFC 1-2026': 34000
            }
          }
        ]
      },
      {
        id: 'IT Subscription',
        account: 'IT Subscription',
        isParent: true,
        isExpandable: true,
        values: {},
        children: [
          {
            id: 'IT-1',
            account: '',
            spendType: 'Expense',
            spendLayer: 'SAP',
            category: 'Core ERP',
            system: 'SAP S4',
            supplier: 'Acumant',
            internalOrder: 'IT-3001',
            itemDescription: 'SAP Developer Support',
            isParent: false,
            isExpandable: false,
            site: 'Site C - ERP Core',
            team: 'IT Support',
            values: {
              'Actual-2024': 120000,
              'Actual-2025': 135000,
              'Actual-2026': 148000,
              'RFC 3-2025': 142000,
              'RFC 1-2026': 155000
            }
          },
          {
            id: 'IT-2',
            account: '',
            spendType: 'Expense',
            spendLayer: 'Concur',
            category: 'Expense Management',
            system: 'SAP Concur',
            supplier: 'ITC',
            internalOrder: 'IT-3002',
            itemDescription: 'Concur Integration Services',
            isParent: false,
            isExpandable: false,
            site: 'Site A - Crown Manufacturing',
            team: 'Finance',
            values: {
              'Actual-2024': 80000,
              'Actual-2025': 88000,
              'Actual-2026': 91000,
              'RFC 3-2025': 94000,
              'RFC 1-2026': 88000
            }
          },
          {
            id: 'IT-3',
            account: '',
            spendType: 'Expense',
            spendLayer: 'Analytics',
            category: 'AI Dashboard',
            system: 'Performance Hub',
            supplier: 'Acumant',
            internalOrder: 'IT-3003',
            itemDescription: 'AI Reporting Services',
            isParent: false,
            isExpandable: false,
            site: 'Site C - ERP Core',
            team: 'IT Support',
            values: {
              'Actual-2024': 45000,
              'Actual-2025': 52000,
              'Actual-2026': 56000,
              'RFC 3-2025': 50000,
              'RFC 1-2026': 58000
            }
          }
        ]
      },
      {
        id: 'Travel',
        account: 'Travel',
        isParent: true,
        isExpandable: false,
        site: 'Site B - Plant 2',
        team: 'Operations',
        values: {
          'Actual-2024': 60000,
          'Actual-2025': 65000,
          'Actual-2026': 62000,
          'RFC 3-2025': 59000,
          'RFC 1-2026': 64000
        }
      },
      {
        id: 'Hardware',
        account: 'Hardware',
        isParent: true,
        isExpandable: false,
        site: 'Site A - Crown Manufacturing',
        team: 'IT Support',
        values: {
          'Actual-2024': 70000,
          'Actual-2025': 72000,
          'Actual-2026': 76000,
          'RFC 3-2025': 70000,
          'RFC 1-2026': 78000
        }
      },
      {
        id: 'Network',
        account: 'Network',
        isParent: true,
        isExpandable: false,
        site: 'Site C - ERP Core',
        team: 'IT Support',
        values: {
          'Actual-2024': 90000,
          'Actual-2025': 95000,
          'Actual-2026': 98000,
          'RFC 3-2025': 92000,
          'RFC 1-2026': 100000
        }
      }
    ];

    this.calculateParentTotals();
  }

  // Calculate values of parent rows by summing up their children values (if children are present)
  calculateParentTotals() {
    for (const row of this.costRows) {
      if (row.isParent && row.isExpandable && row.children) {
        row.values = {};
        for (const child of row.children) {
          for (const scenarioId in child.values) {
            row.values[scenarioId] = (row.values[scenarioId] || 0) + child.values[scenarioId];
          }
        }
      }
    }
  }

  // Reactive Getter to filter rows in real-time and compute parent-level sums dynamically
  get filteredCostRows(): CostRow[] {
    return this.costRows.map(row => {
      if (row.isParent && row.isExpandable && row.children) {
        // Filter child rows
        const filteredChildren = row.children.filter(child => {
          const matchesSite = this.selectedSite === 'All Sites' || child.site === this.selectedSite;
          const matchesTeam = this.selectedTeam === 'All Teams' || child.team === this.selectedTeam;
          return matchesSite && matchesTeam;
        });

        // Compute dynamic parent sums based on filtered children
        const values: { [scenarioId: string]: number } = {};
        for (const child of filteredChildren) {
          for (const scenarioId in child.values) {
            values[scenarioId] = (values[scenarioId] || 0) + child.values[scenarioId];
          }
        }

        return {
          ...row,
          children: filteredChildren,
          values
        };
      } else {
        // Single row parent items
        const matchesSite = this.selectedSite === 'All Sites' || row.site === this.selectedSite;
        const matchesTeam = this.selectedTeam === 'All Teams' || row.team === this.selectedTeam;
        if (matchesSite && matchesTeam) {
          return row;
        }
        return null;
      }
    }).filter(row => row !== null && (!row.isExpandable || (row.children && row.children.length > 0))) as CostRow[];
  }

  // Get scenario value for a specific row
  getRowValue(row: CostRow, scenarioId: string): number {
    return row.values[scenarioId] || 0;
  }

  // Get variance difference value
  getVarianceValue(row: CostRow, col: VarianceColumn): number {
    const leftVal = row.values[col.compareLeft] || 0;
    const rightVal = row.values[col.compareRight] || 0;
    return leftVal - rightVal;
  }

  // Get class name for variance indicator styling
  getVarianceBadgeClass(row: CostRow, col: VarianceColumn): string {
    const diff = this.getVarianceValue(row, col);
    if (diff > 0) return 'variance-badge pos';
    if (diff < 0) return 'variance-badge neg';
    return 'variance-badge zero';
  }

  // Formatting helper for variance
  getFormattedVariance(row: CostRow, col: VarianceColumn): string {
    const diff = this.getVarianceValue(row, col);
    const formatted = Math.abs(diff / 1000).toFixed(0);
    return diff >= 0 ? `+${formatted}` : `-${formatted}`;
  }

  // Check if a category is expanded
  isExpanded(id: string): boolean {
    return this.expandedCategories.has(id);
  }

  // Toggle category expand state
  toggleCategory(id: string) {
    if (this.expandedCategories.has(id)) {
      this.expandedCategories.delete(id);
    } else {
      this.expandedCategories.add(id);
    }
    // Reassign reference to trigger Angular change detection
    this.expandedCategories = new Set(this.expandedCategories);
  }

  // Get total sum for a scenario column across all active filtered rows
  getColumnTotal(scenarioId: string): number {
    let sum = 0;
    for (const row of this.filteredCostRows) {
      if (row.isParent) {
        sum += row.values[scenarioId] || 0;
      }
    }
    return sum;
  }

  // Get total sum for a variance column
  getVarianceColumnTotal(col: VarianceColumn): number {
    let sum = 0;
    for (const row of this.filteredCostRows) {
      if (row.isParent) {
        sum += this.getVarianceValue(row, col);
      }
    }
    return sum;
  }

  // Get styling class for total variance badge
  getVarianceTotalBadgeClass(col: VarianceColumn): string {
    const sum = this.getVarianceColumnTotal(col);
    if (sum > 0) return 'variance-badge pos';
    if (sum < 0) return 'variance-badge neg';
    return 'variance-badge zero';
  }

  getFormattedVarianceTotal(col: VarianceColumn): string {
    const diff = this.getVarianceColumnTotal(col);
    const formatted = Math.abs(diff / 1000).toFixed(0);
    return diff >= 0 ? `+${formatted}` : `-${formatted}`;
  }

  // Open / Close add scenario modal
  openAddScenario() {
    this.showAddScenarioModal = true;
    this.newScenarioType = 'Actual';
    this.newScenarioYear = 2027;
  }

  closeAddScenario() {
    this.showAddScenarioModal = false;
  }

  // Add the newly configured scenario to the list
  addScenario() {
    const id = `${this.newScenarioType}-${this.newScenarioYear}`;
    const displayName = `${this.newScenarioType} ${this.newScenarioYear}`;
    
    // Check if the scenario already exists
    if (this.scenarios.find(s => s.id === id)) {
      alert('This scenario already exists!');
      return;
    }

    const newScenario: Scenario = {
      id,
      type: this.newScenarioType,
      year: this.newScenarioYear,
      displayName
    };

    // Add scenario column
    this.scenarios.push(newScenario);

    // Populate mock values for child rows and single rows in the master costRows
    for (const row of this.costRows) {
      if (row.isParent && row.isExpandable && row.children) {
        for (const child of row.children) {
          child.values[id] = this.generateMockValue(child, newScenario.type, newScenario.year);
        }
      } else {
        row.values[id] = this.generateMockValue(row, newScenario.type, newScenario.year);
      }
    }

    // Recompute parent values on master list
    this.calculateParentTotals();

    this.closeAddScenario();
  }

  // Helper to generate realistic data based on scenario type and year
  generateMockValue(row: CostRow, type: ScenarioType, year: number): number {
    const baseVal = row.values['Actual-2024'] || 70000;
    const yearDiff = year - 2024;
    
    let factor = 1.0;
    if (type === 'Actual') {
      factor = 1.0 + (yearDiff * 0.05);
    } else if (type.startsWith('RFC')) {
      factor = 1.0 + (yearDiff * 0.04);
    } else {
      factor = 1.0 + (yearDiff * 0.03);
    }
    
    const deviation = 0.92 + (Math.random() * 0.16);
    return Math.round((baseVal * factor * deviation) / 100) * 100;
  }

  // --- HTML5 Drag & Drop Column Reordering Logic ---

  onDragStart(event: DragEvent, index: number) {
    this.draggedColIndex = index;
    if (event.dataTransfer) {
      event.dataTransfer.effectAllowed = 'move';
      event.dataTransfer.setData('text/plain', index.toString());
    }
  }

  onDragOver(event: DragEvent, index: number) {
    event.preventDefault();
    if (this.draggedColIndex !== null && this.draggedColIndex !== index) {
      this.dragOverColIndex = index;
    }
  }

  onDrop(event: DragEvent, index: number) {
    event.preventDefault();
    if (this.draggedColIndex !== null && this.draggedColIndex !== index) {
      const draggedScenario = this.scenarios[this.draggedColIndex];
      this.scenarios.splice(this.draggedColIndex, 1);
      this.scenarios.splice(index, 0, draggedScenario);
    }
    this.onDragEnd();
  }

  onDragEnd() {
    this.draggedColIndex = null;
    this.dragOverColIndex = null;
  }

  // Column Widths state for left metadata columns (columns 1 to 8)
  colWidths: { [key: string]: number } = {
    col1: 140,
    col2: 90,
    col3: 90,
    col4: 140,
    col5: 90,
    col6: 90,
    col7: 100,
    col8: 180
  };

  get metadataPaneWidth(): number {
    return this.colWidths['col1'] +
           this.colWidths['col2'] +
           this.colWidths['col3'] +
           this.colWidths['col4'] +
           this.colWidths['col5'] +
           this.colWidths['col6'] +
           this.colWidths['col7'] +
           this.colWidths['col8'];
  }

  private activeColId: string | null = null;
  private startX = 0;
  private startWidth = 0;

  onResizeStart(event: MouseEvent, colId: string) {
    event.stopPropagation();
    event.preventDefault();
    this.activeColId = colId;
    this.startX = event.clientX;
    this.startWidth = this.colWidths[colId];

    const onMouseMove = (moveEvent: MouseEvent) => {
      if (this.activeColId) {
        const deltaX = moveEvent.clientX - this.startX;
        const newWidth = Math.max(60, this.startWidth + deltaX); // min 60px
        this.colWidths[this.activeColId] = newWidth;
      }
    };

    const onMouseUp = () => {
      this.activeColId = null;
      document.removeEventListener('mousemove', onMouseMove);
      document.removeEventListener('mouseup', onMouseUp);
    };

    document.addEventListener('mousemove', onMouseMove);
    document.addEventListener('mouseup', onMouseUp);
  }
}

