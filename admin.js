/**
 * Self-Pic Photo Studio - Admin Management Console Engine
 * Powers all 8 administrative modules, mock WebSocket stream,
 * booking lifecycle transitions, and real-time state management.
 */

class AdminApplication {
  constructor() {
    this.currentModule = 'dashboard';
    this.activeBranch = 'all';
    this.wsActive = true;
    this.wsEventCounter = 482;
    this.wsTimer = null;
    this.activeModalBooking = null;

    // Initial 10 Packages
    this.packages = [
      { id: 'solo-199', name: 'SOLO 199', category: 'Basic', pax: '1 pax', duration: '10 mins', prints: '1 pc 3R Solo', softCopies: 'ALL Included', price: 199, active: true },
      { id: 'solo-249', name: 'SOLO 249', category: 'Basic', pax: '1 pax', duration: '20 mins', prints: '1 pc 3R + 1 pc 3R Quadro', softCopies: 'ALL Included', price: 249, active: true },
      { id: 'duo-249', name: 'DUO 249', category: 'Basic', pax: '2 pax', duration: '10 mins', prints: '2 pcs 3R Strips', softCopies: 'ALL Included', price: 249, active: true },
      { id: 'duo-399', name: 'DUO 399', category: 'Basic', pax: '2 pax', duration: '25 mins', prints: '2 pcs 4R Strips', softCopies: 'ALL Included', price: 399, active: true },
      { id: 'trio-349', name: 'TRIO 349', category: 'Basic', pax: '3 pax', duration: '10 mins', prints: '3 pcs 3R Strips', softCopies: 'ALL Included', price: 349, active: true },
      { id: 'trio-499', name: 'TRIO 499', category: 'Basic', pax: '3 pax', duration: '25 mins', prints: '3 pcs 4R Strips', softCopies: 'ALL Included', price: 499, active: true },
      { id: 'grupo-449', name: 'GRUPO 449', category: 'Basic', pax: '4-5 pax', duration: '10 mins', prints: '5 pcs 3R Strips', softCopies: 'ALL Included', price: 449, active: true },
      { id: 'grupo-599', name: 'GRUPO 599', category: 'Basic', pax: '4-5 pax', duration: '25 mins', prints: '5 pcs 4R Strips', softCopies: 'ALL Included', price: 599, active: true },
      { id: 'rent-duo-799', name: 'RENT DUO 799', category: 'Rental', pax: '1-2 pax', duration: '1 Hour Unli', prints: '2pcs 3R + 2pcs 4R Strips', softCopies: 'ALL Included', price: 799, active: true },
      { id: 'rent-grupo-1199', name: 'RENT GRUPO 1199', category: 'Rental', pax: '3-5 pax', duration: '1 Hour Unli', prints: '5pcs 3R + 5pcs 4R Strips', softCopies: 'ALL Included', price: 1199, active: true }
    ];

    // Initial Backdrops Resources (8 Official Studio Colors)
    this.backdrops = [
      { name: 'Storm', status: 'Available', condition: 'Studio Editorial Slate', branch: 'Sta. Maria, Muzon, Pandi' },
      { name: 'Abstract Pink', status: 'Available', condition: 'Aesthetic Textured', branch: 'Sta. Maria, Muzon, Pandi' },
      { name: 'Nutmeg', status: 'Available', condition: 'Warm Earthy Tone', branch: 'Sta. Maria Room 1' },
      { name: 'Ash', status: 'Available', condition: 'Neutral Studio Gray', branch: 'Sta. Maria, Muzon, Pandi' },
      { name: 'Cloud', status: 'In Use', condition: 'High-Key Seamless Off-White', branch: 'Muzon SJDM' },
      { name: 'Velvet', status: 'Available', condition: 'Deep Burgundy Velvet', branch: 'Pandi Bulacan' },
      { name: 'Deep Blue', status: 'Available', condition: 'Royal Midnight Navy', branch: 'Sta. Maria, Pandi' },
      { name: 'Pink Haze', status: 'Available', condition: 'Dreamy Pastel Tone', branch: 'Sta. Maria, Muzon, Pandi' }
    ];

    // Dedicated Storage & Printer Inventory: Photo Paper Stocks
    this.paperInventory = [
      {
        id: 'paper-3r-solo',
        name: '3R Solo Photo Paper (3.5" x 5")',
        usedFor: 'SOLO 199, SOLO 249',
        units: 420,
        unitType: 'sheets',
        packaging: '4 sealed boxes (100s) + 20 loose',
        reorderLevel: 150,
        status: 'In Stock'
      },
      {
        id: 'paper-3r-strip',
        name: '3R Photo Strip Paper (2" x 6" dual strips)',
        usedFor: 'DUO 249, TRIO 349, GRUPO 449, RENT DUO 799, RENT GRUPO 1199',
        units: 650,
        unitType: 'strips',
        packaging: '6 sealed packs (100s) + 50 loose',
        reorderLevel: 200,
        status: 'In Stock'
      },
      {
        id: 'paper-4r-strip',
        name: '4R Photo Strip Paper (4" x 6" cut strips)',
        usedFor: 'DUO 399, TRIO 499, GRUPO 599, RENT DUO 799, RENT GRUPO 1199',
        units: 180,
        unitType: 'strips',
        packaging: '1 sealed box (100s) + 80 loose',
        reorderLevel: 200,
        status: 'Low Stock'
      },
      {
        id: 'paper-3r-quadro',
        name: '3R Quadro Grid Photo Paper (3.5" x 5" 4-up)',
        usedFor: 'SOLO 249',
        units: 310,
        unitType: 'sheets',
        packaging: '3 sealed packs (100s) + 10 loose',
        reorderLevel: 100,
        status: 'In Stock'
      }
    ];

    // Dedicated Storage & Printer Inventory: Ink Ribbons & Printer Consumables
    this.inkInventory = [
      {
        id: 'ribbon-dnp-rx1',
        name: 'DNP DS-RX1HS Dye-Sublimation Color Ribbon',
        colorType: '4-Pass YMC + Overcoat Gloss Roll',
        yieldPerUnit: '700 prints / roll',
        stockRemaining: '3 mounted rolls + 2 spares',
        level: 75,
        healthStatus: 'Optimal'
      },
      {
        id: 'clean-kit-rx1',
        name: 'Thermal Print Head Cleaning Kits',
        colorType: 'Isopropyl Head Cleaning Sheet + Pen',
        yieldPerUnit: '50 cleaning passes / kit',
        stockRemaining: '4 sealed kits',
        level: 100,
        healthStatus: 'Good'
      },
      {
        id: 'waste-box-dnp',
        name: 'Printer Scrap Paper & Ribbon Waste Collector',
        colorType: 'Polycarbonate Catch Tray',
        yieldPerUnit: '1,400 strip cuts capacity',
        stockRemaining: '3 active units (1 per branch)',
        level: 35,
        healthStatus: 'Clean'
      },
      {
        id: 'head-dnp-spare',
        name: 'DNP High-Density 300 DPI Thermal Print Head (Spare)',
        colorType: 'Solid-State Ceramic Thermal Array',
        yieldPerUnit: '~50,000 prints lifespan',
        stockRemaining: '2 factory backup heads',
        level: 100,
        healthStatus: 'Certified Functional'
      }
    ];

    // Initial Clients CRM Data
    this.clients = [
      { name: 'Maria Santos', email: 'mariasantos@gmail.com', phone: '0917-555-0199', bookings: 3, spend: 1147, branch: 'Sta. Maria', tag: 'VIP' },
      { name: 'Gabriel Mendoza', email: 'gab.mendoza@yahoo.com', phone: '0918-222-8811', bookings: 2, spend: 1598, branch: 'Muzon SJDM', tag: 'Frequent' },
      { name: 'Alyssa Rivera', email: 'alyssa.r@outlook.com', phone: '0922-834-9002', bookings: 1, spend: 399, branch: 'Pandi', tag: 'First-Timer' },
      { name: 'Mark Bautista', email: 'mark.b@gmail.com', phone: '0905-123-9988', bookings: 4, spend: 2396, branch: 'Sta. Maria', tag: 'VIP' },
      { name: 'Chloe Cruz', email: 'chloe.cruz@gmail.com', phone: '0917-882-3412', bookings: 1, spend: 449, branch: 'Muzon SJDM', tag: 'First-Timer' }
    ];

    // Staff Accounts
    this.staff = [
      { name: 'Juan Admin', role: 'Super Administrator', branch: 'All Branches', twoFa: 'Enabled', permissions: 'Full Access' },
      { name: 'Kristine Reyes', role: 'Branch Manager', branch: 'Sta. Maria Bulacan', twoFa: 'Enabled', permissions: 'Branch Mgmt + Refunds' },
      { name: 'Angelo Diaz', role: 'Studio Technician', branch: 'Muzon, San Jose Del Monte', twoFa: 'Disabled', permissions: 'Lifecycle + Print Desk' },
      { name: 'Sarah De Leon', role: 'Front Desk Assistant', branch: 'Pandi Bulacan', twoFa: 'Enabled', permissions: 'Check-in + POS' }
    ];

    // Audit Trail Data
    this.auditLogs = [
      { time: '14:18:02', severity: 'INFO', actor: 'Admin Desk (127.0.0.1)', module: 'Security', action: 'Admin logged in with valid session', traceId: 'TR-9042' },
      { time: '14:12:45', severity: 'INFO', actor: 'Kristine Reyes', module: 'Bookings', action: 'Marked SP-894210 balance settled (₱124 PHP paid on-site)', traceId: 'TR-8911' },
      { time: '14:05:10', severity: 'WARN', actor: 'System Gateway', module: 'Security', action: 'Rate limit trigger: 4 attempts from IP 192.168.10.44', traceId: 'TR-8820' },
      { time: '13:50:33', severity: 'INFO', actor: 'Public Webhook', module: 'Payments', action: 'GCash deposit verified for SP-621908 (₱599 PHP)', traceId: 'TR-8790' },
      { time: '13:42:19', severity: 'ERROR', actor: 'Client Form', module: 'Bookings', action: 'Collision prevented: 10:00 AM slot conflict on Muzon', traceId: 'TR-8702' }
    ];

    // Initial Bookings Pipeline
    this.bookings = [
      {
        ref: 'SP-894210',
        customer: 'Maria Santos',
        email: 'mariasantos@gmail.com',
        phone: '0917-555-0199',
        branch: 'Sta. Maria Bulacan',
        package: 'SOLO 249',
        date: '2026-09-16',
        time: '02:00 PM',
        duration: '20 mins',
        addons: 'None',
        total: 249,
        paid: 125,
        balance: 124,
        paymentOption: '50% Downpayment',
        status: 'In-Shoot'
      },
      {
        ref: 'SP-774102',
        customer: 'Gabriel Mendoza',
        email: 'gab.mendoza@yahoo.com',
        phone: '0918-222-8811',
        branch: 'Muzon, San Jose Del Monte',
        package: 'RENT DUO 799',
        date: '2026-09-16',
        time: '03:00 PM',
        duration: '60 mins',
        addons: 'Extra time (+10m: ₱100)',
        total: 899,
        paid: 450,
        balance: 449,
        paymentOption: '50% Downpayment',
        status: 'Confirmed (50% Paid)'
      },
      {
        ref: 'SP-621908',
        customer: 'Alyssa Rivera',
        email: 'alyssa.r@outlook.com',
        phone: '0922-834-9002',
        branch: 'Pandi Bulacan',
        package: 'DUO 399',
        date: '2026-09-16',
        time: '04:15 PM',
        duration: '25 mins',
        addons: 'Backdrops: Pink (+₱100)',
        total: 499,
        paid: 499,
        balance: 0,
        paymentOption: '100% Full Payment',
        status: 'Paid Full (100%)'
      },
      {
        ref: 'SP-541990',
        customer: 'Mark Bautista',
        email: 'mark.b@gmail.com',
        phone: '0905-123-9988',
        branch: 'Sta. Maria Bulacan',
        package: 'GRUPO 599',
        date: '2026-09-16',
        time: '11:15 AM',
        duration: '25 mins',
        addons: '+1 Pax (+₱50)',
        total: 649,
        paid: 649,
        balance: 0,
        paymentOption: '100% Full Payment',
        status: 'Completed'
      },
      {
        ref: 'SP-482110',
        customer: 'Chloe Cruz',
        email: 'chloe.cruz@gmail.com',
        phone: '0917-882-3412',
        branch: 'Muzon, San Jose Del Monte',
        package: 'SOLO 199',
        date: '2026-09-16',
        time: '10:30 AM',
        duration: '10 mins',
        addons: 'None',
        total: 199,
        paid: 199,
        balance: 0,
        paymentOption: '100% Full Payment',
        status: 'Completed'
      },
      {
        ref: 'SP-319081',
        customer: 'Janice Morales',
        email: 'janice.m@gmail.com',
        phone: '0919-445-1288',
        branch: 'Sta. Maria Bulacan',
        package: 'SOLO 199',
        date: '2026-09-02',
        time: '11:00 AM',
        duration: '10 mins',
        addons: 'None',
        total: 199,
        paid: 199,
        balance: 0,
        paymentOption: '100% Full Payment',
        status: 'Completed'
      },
      {
        ref: 'SP-442819',
        customer: 'Rafael Dizon',
        email: 'rafael.d@yahoo.com',
        phone: '0920-334-9911',
        branch: 'Muzon, San Jose Del Monte',
        package: 'TRIO 499',
        date: '2026-09-05',
        time: '01:30 PM',
        duration: '25 mins',
        addons: 'Backdrops: Nutmeg (+₱100)',
        total: 599,
        paid: 599,
        balance: 0,
        paymentOption: '100% Full Payment',
        status: 'Completed'
      },
      {
        ref: 'SP-501823',
        customer: 'Bea Alonzo',
        email: 'bea.alonzo@gmail.com',
        phone: '0917-662-7744',
        branch: 'Pandi Bulacan',
        package: 'SOLO 249',
        date: '2026-09-08',
        time: '03:15 PM',
        duration: '20 mins',
        addons: 'Extra time (+10m: ₱100)',
        total: 349,
        paid: 175,
        balance: 174,
        paymentOption: '50% Downpayment',
        status: 'Confirmed (50% Paid)'
      },
      {
        ref: 'SP-612739',
        customer: 'Daniel Padilla',
        email: 'daniel.p@gmail.com',
        phone: '0918-993-4411',
        branch: 'Sta. Maria Bulacan',
        package: 'RENT DUO 799',
        date: '2026-09-12',
        time: '04:00 PM',
        duration: '60 mins',
        addons: 'None',
        total: 799,
        paid: 799,
        balance: 0,
        paymentOption: '100% Full Payment',
        status: 'Completed'
      },
      {
        ref: 'SP-728190',
        customer: 'Kathryn Bernardo',
        email: 'kathryn.b@outlook.com',
        phone: '0922-554-1188',
        branch: 'Muzon, San Jose Del Monte',
        package: 'GRUPO 449',
        date: '2026-09-20',
        time: '02:30 PM',
        duration: '10 mins',
        addons: '+1 Pax (+₱50)',
        total: 499,
        paid: 250,
        balance: 249,
        paymentOption: '50% Downpayment',
        status: 'Confirmed (50% Paid)'
      },
      {
        ref: 'SP-834912',
        customer: 'Enrique Gil',
        email: 'enrique.g@gmail.com',
        phone: '0908-112-7733',
        branch: 'Pandi Bulacan',
        package: 'RENT GRUPO 1199',
        date: '2026-09-22',
        time: '05:00 PM',
        duration: '60 mins',
        addons: 'Extra time (+10m: ₱100)',
        total: 1299,
        paid: 1299,
        balance: 0,
        paymentOption: '100% Full Payment',
        status: 'Completed'
      },
      {
        ref: 'SP-945021',
        customer: 'Liza Soberano',
        email: 'liza.s@gmail.com',
        phone: '0917-448-9900',
        branch: 'Sta. Maria Bulacan',
        package: 'DUO 249',
        date: '2026-09-23',
        time: '11:30 AM',
        duration: '10 mins',
        addons: 'None',
        total: 249,
        paid: 249,
        balance: 0,
        paymentOption: '100% Full Payment',
        status: 'In-Shoot'
      }
    ];

    // Synchronize latest client booking from localStorage if available
    this.syncLatestClientBooking();
  }

  // Check if client made a booking on public site
  syncLatestClientBooking() {
    try {
      const stored = localStorage.getItem('selfPicLatestBooking');
      if (stored) {
        const clientBooking = JSON.parse(stored);
        if (clientBooking && clientBooking.referenceCode) {
          const exists = this.bookings.some(b => b.ref === clientBooking.referenceCode);
          if (!exists) {
            this.bookings.unshift({
              ref: clientBooking.referenceCode,
              customer: clientBooking.customerName || 'Client Walk-in',
              email: clientBooking.customerEmail || 'client@example.com',
              phone: clientBooking.customerPhone || '0917-000-0000',
              branch: clientBooking.branch || 'Sta. Maria Bulacan',
              package: clientBooking.package || 'SOLO 249',
              date: clientBooking.bookingDate || '2026-09-16',
              time: clientBooking.bookingTime || '02:00 PM',
              duration: `${clientBooking.packageDuration || 20} mins`,
              addons: clientBooking.extraBackdrops && clientBooking.extraBackdrops.length > 0 ? clientBooking.extraBackdrops.join(', ') : 'None',
              total: clientBooking.total || 249,
              paid: clientBooking.amountPaid || 125,
              balance: clientBooking.balanceDue || 0,
              paymentOption: clientBooking.paymentOption || '50% Downpayment',
              status: clientBooking.balanceDue > 0 ? 'Confirmed (50% Paid)' : 'Paid Full (100%)'
            });

            this.logAudit('INFO', 'Public Client', 'Bookings', `New reservation synced: ${clientBooking.referenceCode} (${clientBooking.package})`);
          }
        }
      }
    } catch (err) {
      console.warn('Sync error:', err);
    }
  }

  init() {
    if (!this.checkAuthentication()) return;
    this.bindNavigation();
    this.bindBranchFilter();
    this.bindSearchAndFilters();
    this.renderAll();
    this.startMockWebSocketStream();
  }

  checkAuthentication() {
    if (sessionStorage.getItem('selfPicAdminLoggedIn') !== 'true') {
      window.location.href = 'login.html';
      return false;
    }

    const user = sessionStorage.getItem('selfPicAdminUser') || 'Studio Admin';
    const branch = sessionStorage.getItem('selfPicAdminBranch') || 'All Branches';

    const userEl = document.getElementById('sidebarAdminUser');
    if (userEl) userEl.textContent = user;
    const nameEl = document.getElementById('topbarAdminName');
    if (nameEl) nameEl.textContent = user;
    const roleEl = document.getElementById('sidebarAdminRole');
    if (roleEl) roleEl.textContent = branch === 'All Branches' ? 'Super Administrator' : `${branch} Desk`;

    if (branch !== 'All Branches') {
      const select = document.getElementById('adminBranchFilter');
      if (select) {
        select.value = branch;
        this.activeBranch = branch;
      }
    }
    return true;
  }

  logout() {
    if (confirm('Are you sure you want to sign out of the Admin Management Console?')) {
      sessionStorage.removeItem('selfPicAdminLoggedIn');
      sessionStorage.removeItem('selfPicAdminUser');
      sessionStorage.removeItem('selfPicAdminBranch');
      window.location.href = 'login.html';
    }
  }

  // --- Module Navigation ---
  bindNavigation() {
    const links = document.querySelectorAll('.sidebar-link[data-module]');
    links.forEach(link => {
      link.addEventListener('click', (e) => {
        e.preventDefault();
        const target = link.dataset.module;
        this.navigateModule(target);
      });
    });
  }

  navigateModule(moduleName) {
    this.currentModule = moduleName;
    
    // Update sidebar active state
    document.querySelectorAll('.sidebar-link').forEach(l => {
      if (l.dataset.module === moduleName) {
        l.classList.add('active');
      } else {
        l.classList.remove('active');
      }
    });

    // Update view panels
    document.querySelectorAll('.module-view').forEach(view => {
      if (view.id === `mod-${moduleName}`) {
        view.classList.add('active');
      } else {
        view.classList.remove('active');
      }
    });

    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  // --- Branch Filter ---
  bindBranchFilter() {
    const select = document.getElementById('adminBranchFilter');
    if (select) {
      select.addEventListener('change', () => {
        this.activeBranch = select.value;
        this.renderBookingsMasterTable();
        this.renderDashboardPipeline();
        this.updateKpiCounters();
        this.logAudit('INFO', 'Admin Desk', 'Branch Filter', `Switched active branch scope to: ${this.activeBranch}`);
      });
    }
  }

  // --- Search & Filters ---
  bindSearchAndFilters() {
    const searchInput = document.getElementById('bookingSearchInput');
    const statusSelect = document.getElementById('bookingStatusFilter');
    const userSearchInput = document.getElementById('userSearchInput');
    const auditSearchInput = document.getElementById('auditSearchInput');
    const auditSeverityFilter = document.getElementById('auditSeverityFilter');
    const repStart = document.getElementById('reportStartDate');
    const repEnd = document.getElementById('reportEndDate');
    const repBranch = document.getElementById('reportBranchFilter');

    if (searchInput) searchInput.addEventListener('input', () => this.renderBookingsMasterTable());
    if (statusSelect) statusSelect.addEventListener('change', () => this.renderBookingsMasterTable());
    if (userSearchInput) userSearchInput.addEventListener('input', () => this.renderClientsTable());
    if (auditSearchInput) auditSearchInput.addEventListener('input', () => this.renderAuditTable());
    if (auditSeverityFilter) auditSeverityFilter.addEventListener('change', () => this.renderAuditTable());
    if (repStart) repStart.addEventListener('change', () => this.renderAnalyticsReport());
    if (repEnd) repEnd.addEventListener('change', () => this.renderAnalyticsReport());
    if (repBranch) repBranch.addEventListener('change', () => this.renderAnalyticsReport());
  }

  // --- Rendering Functions ---
  renderAll() {
    this.updateKpiCounters();
    this.renderDashboardPipeline();
    this.renderBookingsMasterTable();
    this.renderCatalogTable();
    this.renderBackdropsTable();
    this.renderPaperInventoryTable();
    this.renderInkInventoryTable();
    this.renderClientsTable();
    this.renderStaffTable();
    this.renderAuditTable();
    this.renderAnalyticsReport();
  }

  updateKpiCounters() {
    let filtered = this.bookings;
    if (this.activeBranch !== 'all') {
      filtered = filtered.filter(b => b.branch.toLowerCase().includes(this.activeBranch.toLowerCase()));
    }

    const totalRevenue = filtered.reduce((acc, b) => acc + (b.total || 0), 0);
    const pendingBalance = filtered.reduce((acc, b) => acc + (b.balance || 0), 0);

    const revEl = document.getElementById('kpiRevenue');
    const todayEl = document.getElementById('kpiBookingsToday');
    const balEl = document.getElementById('kpiPendingBalance');

    if (revEl) revEl.textContent = `₱${totalRevenue.toLocaleString()} PHP`;
    if (todayEl) todayEl.textContent = filtered.length;
    if (balEl) balEl.textContent = `₱${pendingBalance.toLocaleString()} PHP`;
  }

  renderDashboardPipeline() {
    const tbody = document.getElementById('dashboardPipelineTbody');
    if (!tbody) return;

    let list = this.bookings.slice(0, 4);
    if (this.activeBranch !== 'all') {
      list = this.bookings.filter(b => b.branch.toLowerCase().includes(this.activeBranch.toLowerCase())).slice(0, 4);
    }

    tbody.innerHTML = list.map(b => `
      <tr>
        <td><strong>${b.ref}</strong></td>
        <td>${b.customer}</td>
        <td>${b.branch}</td>
        <td>${b.package}</td>
        <td>${b.time}</td>
        <td>₱${b.total} PHP</td>
        <td>${this.getStatusBadgeHtml(b.status)}</td>
        <td>
          <button class="btn-sm" onclick="adminApp.openBookingModal('${b.ref}')">Details</button>
        </td>
      </tr>
    `).join('');
  }

  renderBookingsMasterTable() {
    const tbody = document.getElementById('bookingsMasterTbody');
    if (!tbody) return;

    const search = (document.getElementById('bookingSearchInput')?.value || '').toLowerCase().trim();
    const statusFilter = document.getElementById('bookingStatusFilter')?.value || 'all';

    let filtered = this.bookings.filter(b => {
      // Branch filter
      if (this.activeBranch !== 'all' && !b.branch.toLowerCase().includes(this.activeBranch.toLowerCase())) {
        return false;
      }
      // Status filter
      if (statusFilter !== 'all' && b.status !== statusFilter) {
        return false;
      }
      // Keyword search
      if (search) {
        const hay = `${b.ref} ${b.customer} ${b.phone} ${b.package}`.toLowerCase();
        if (!hay.includes(search)) return false;
      }
      return true;
    });

    if (filtered.length === 0) {
      tbody.innerHTML = `<tr><td colspan="9" style="text-align:center; padding:24px; color:#888;">No reservations matching criteria.</td></tr>`;
      return;
    }

    tbody.innerHTML = filtered.map(b => `
      <tr>
        <td><strong>${b.ref}</strong></td>
        <td>
          <strong>${b.customer}</strong><br>
          <small class="text-muted">${b.phone}</small>
        </td>
        <td>${b.branch}</td>
        <td>
          <strong>${b.package}</strong><br>
          <small class="text-muted">${b.duration}</small>
        </td>
        <td>
          ${b.date}<br>
          <strong>${b.time}</strong>
        </td>
        <td><small>${b.addons}</small></td>
        <td>
          <strong>₱${b.total} PHP</strong><br>
          <small class="text-muted">Paid: ₱${b.paid} | Due: ₱${b.balance}</small>
        </td>
        <td>${this.getStatusBadgeHtml(b.status)}</td>
        <td>
          <div style="display: flex; gap: 6px; flex-wrap: wrap;">
            <button class="btn-sm" onclick="adminApp.openBookingModal('${b.ref}')">View</button>
            ${b.balance > 0 ? `<button class="btn-sm btn-black" onclick="adminApp.settleBalance('${b.ref}')">Settle</button>` : ''}
            ${b.status === 'Checked-In' ? `<button class="btn-sm btn-black" onclick="adminApp.advanceStatus('${b.ref}', 'In-Shoot')">Shoot</button>` : ''}
            ${b.status === 'In-Shoot' ? `<button class="btn-sm btn-black" onclick="adminApp.advanceStatus('${b.ref}', 'Completed')">Finish</button>` : ''}
          </div>
        </td>
      </tr>
    `).join('');
  }

  getStatusBadgeHtml(status) {
    if (status === 'Completed') return `<span class="badge badge-completed">${status}</span>`;
    if (status === 'In-Shoot') return `<span class="badge badge-inshoot">${status}</span>`;
    if (status === 'Checked-In') return `<span class="badge badge-confirmed">${status}</span>`;
    if (status === 'Paid Full (100%)') return `<span class="badge badge-confirmed">${status}</span>`;
    if (status.includes('50%')) return `<span class="badge badge-pending">${status}</span>`;
    if (status === 'Cancelled') return `<span class="badge badge-danger">${status}</span>`;
    return `<span class="badge">${status}</span>`;
  }

  resetBookingFilters() {
    const searchInput = document.getElementById('bookingSearchInput');
    const statusSelect = document.getElementById('bookingStatusFilter');
    if (searchInput) searchInput.value = '';
    if (statusSelect) statusSelect.value = 'all';
    this.renderBookingsMasterTable();
  }

  // --- Booking Lifecycle Actions ---
  openBookingModal(ref) {
    const b = this.bookings.find(item => item.ref === ref);
    if (!b) return;

    this.activeModalBooking = b;
    document.getElementById('modalBookingTitle').textContent = `Reservation ${b.ref} - ${b.customer}`;

    const body = document.getElementById('modalBookingBody');
    body.innerHTML = `
      <div style="margin-bottom: 20px;">
        <table style="width:100%; border-collapse: collapse; font-size: 0.9rem;">
          <tr><td style="padding:6px 0; color:#666;">Studio Branch:</td><td><strong>${b.branch}</strong></td></tr>
          <tr><td style="padding:6px 0; color:#666;">Appointment:</td><td><strong>${b.date} @ ${b.time} (${b.duration})</strong></td></tr>
          <tr><td style="padding:6px 0; color:#666;">Contact Details:</td><td>${b.customer} &bull; ${b.phone} &bull; ${b.email}</td></tr>
          <tr><td style="padding:6px 0; color:#666;">Package Selected:</td><td><strong>${b.package}</strong></td></tr>
          <tr><td style="padding:6px 0; color:#666;">Custom Add-ons:</td><td>${b.addons}</td></tr>
          <tr><td style="padding:6px 0; color:#666;">Total Session Fee:</td><td><strong>₱${b.total} PHP</strong></td></tr>
          <tr><td style="padding:6px 0; color:#666;">Payment Method:</td><td>GCash (${b.paymentOption})</td></tr>
          <tr><td style="padding:6px 0; color:#666;">Amount Settled:</td><td><strong style="color:#16a34a;">₱${b.paid} PHP</strong></td></tr>
          <tr><td style="padding:6px 0; color:#666;">On-site Balance:</td><td><strong style="color:${b.balance > 0 ? '#b91c1c' : '#000'}">₱${b.balance} PHP</strong></td></tr>
          <tr><td style="padding:6px 0; color:#666;">Current Status:</td><td>${this.getStatusBadgeHtml(b.status)}</td></tr>
        </table>
      </div>
      <hr style="border:none; border-top:1px solid #ddd; margin:16px 0;">
      <div style="font-size:0.85rem; color:#444;">
        <strong>Quick Lifecycle Transitions:</strong>
        <div style="display:flex; gap:8px; margin-top:10px; flex-wrap:wrap;">
          <button class="btn-sm" onclick="adminApp.advanceStatus('${b.ref}', 'Checked-In')">Mark Checked-In</button>
          <button class="btn-sm" onclick="adminApp.advanceStatus('${b.ref}', 'In-Shoot')">Start In-Shoot Timer</button>
          <button class="btn-sm" onclick="adminApp.advanceStatus('${b.ref}', 'Completed')">Mark Completed</button>
          <button class="btn-sm" onclick="adminApp.advanceStatus('${b.ref}', 'Cancelled')">Cancel Booking</button>
        </div>
      </div>
    `;

    const actionBtn = document.getElementById('modalActionBtn');
    if (b.balance > 0) {
      actionBtn.textContent = `Settle Remaining ₱${b.balance} PHP`;
      actionBtn.onclick = () => { this.settleBalance(b.ref); this.closeModal('bookingDetailModal'); };
    } else {
      actionBtn.textContent = 'Print Client Invoice Receipt';
      actionBtn.onclick = () => { window.open(`../receipt.html?ref=${b.ref}`, '_blank'); };
    }

    document.getElementById('bookingDetailModal').classList.add('active');
  }

  settleBalance(ref) {
    const b = this.bookings.find(item => item.ref === ref);
    if (!b) return;

    const settled = b.balance;
    b.paid = b.total;
    b.balance = 0;
    b.status = 'Checked-In';

    this.logAudit('INFO', 'Admin Desk', 'Bookings', `Settle on-site balance for ${b.ref}: ₱${settled} PHP collected at reception.`);
    this.broadcastWsEvent('PAYMENT_SETTLED', `${b.ref} remaining balance settled (₱${settled} PHP).`);

    this.renderAll();
    alert(`On-site balance for ${b.ref} (₱${settled} PHP) settled successfully! Booking marked Checked-In.`);
  }

  advanceStatus(ref, newStatus) {
    const b = this.bookings.find(item => item.ref === ref);
    if (!b) return;

    b.status = newStatus;
    this.logAudit('INFO', 'Admin Desk', 'Lifecycle', `Booking ${b.ref} transitioned to: ${newStatus}`);
    this.broadcastWsEvent('LIFECYCLE_CHANGE', `${b.ref} (${b.customer}) is now ${newStatus}`);

    this.renderAll();
    this.closeModal('bookingDetailModal');
  }

  closeModal(modalId) {
    const m = document.getElementById(modalId);
    if (m) m.classList.remove('active');
  }

  // --- Catalog Table ---
  renderCatalogTable() {
    const tbody = document.getElementById('catalogTableBody');
    if (!tbody) return;

    tbody.innerHTML = this.packages.map(p => `
      <tr>
        <td><strong>${p.name}</strong></td>
        <td><span class="badge ${p.category === 'Rental' ? 'badge-inshoot' : 'badge-confirmed'}">${p.category}</span></td>
        <td>${p.pax}</td>
        <td><strong>${p.duration}</strong></td>
        <td><small>${p.prints}</small></td>
        <td><small>${p.softCopies}</small></td>
        <td><strong>₱${p.price} PHP</strong></td>
        <td><span class="badge ${p.active ? 'badge-confirmed' : 'badge-danger'}">${p.active ? 'Active' : 'Disabled'}</span></td>
        <td>
          <button class="btn-sm" onclick="adminApp.openEditPackageModal('${p.id}')">Edit Rate</button>
        </td>
      </tr>
    `).join('');
  }

  openEditPackageModal(pkgId) {
    const p = this.packages.find(item => item.id === pkgId);
    if (!p) return;

    this.activeEditingPackage = p;
    document.getElementById('editPackageTitle').textContent = `Edit Rate: ${p.name}`;
    document.getElementById('editPackagePriceInput').value = p.price;
    document.getElementById('editPackageModal').classList.add('active');
  }

  savePackagePrice() {
    if (!this.activeEditingPackage) return;
    const newPrice = parseInt(document.getElementById('editPackagePriceInput').value, 10);
    if (isNaN(newPrice) || newPrice <= 0) {
      alert('Please enter a valid price in PHP.');
      return;
    }

    const oldPrice = this.activeEditingPackage.price;
    this.activeEditingPackage.price = newPrice;
    this.logAudit('WARN', 'Admin Desk', 'Catalog', `Updated package ${this.activeEditingPackage.name} rate from ₱${oldPrice} to ₱${newPrice} PHP.`);
    this.broadcastWsEvent('CATALOG_UPDATE', `Package ${this.activeEditingPackage.name} rate updated to ₱${newPrice}`);

    this.closeModal('editPackageModal');
    this.renderCatalogTable();
  }

  // --- Backdrops & Consumables ---
  renderBackdropsTable() {
    const tbody = document.getElementById('backdropsTableBody');
    if (!tbody) return;

    tbody.innerHTML = this.backdrops.map(b => `
      <tr>
        <td><strong>${b.name}</strong></td>
        <td><span class="badge ${b.status === 'Available' ? 'badge-confirmed' : 'badge-inshoot'}">${b.status}</span></td>
        <td><small>${b.condition}</small></td>
        <td><small>${b.branch}</small></td>
      </tr>
    `).join('');
  }

  // --- Dedicated Storage & Printer Stocks Module ---
  renderPaperInventoryTable() {
    const tbody = document.getElementById('paperInventoryTableBody');
    if (!tbody) return;

    tbody.innerHTML = this.paperInventory.map(item => `
      <tr>
        <td><strong>${item.name}</strong></td>
        <td><small class="text-muted">${item.usedFor}</small></td>
        <td><strong>${item.units} ${item.unitType}</strong></td>
        <td>${item.packaging}</td>
        <td><small>&lt; ${item.reorderLevel} ${item.unitType}</small></td>
        <td>
          <span class="badge ${item.status === 'In Stock' ? 'badge-confirmed' : 'badge-danger'}">
            ${item.status}
          </span>
        </td>
        <td>
          <button class="btn-sm" onclick="adminApp.adjustPaperStock('${item.id}')">Adjust / Restock</button>
        </td>
      </tr>
    `).join('');
  }

  renderInkInventoryTable() {
    const tbody = document.getElementById('inkInventoryTableBody');
    if (!tbody) return;

    tbody.innerHTML = this.inkInventory.map(item => `
      <tr>
        <td><strong>${item.name}</strong></td>
        <td><small class="text-muted">${item.colorType}</small></td>
        <td>${item.yieldPerUnit}</td>
        <td><strong>${item.stockRemaining}</strong></td>
        <td>
          <div style="display:flex; align-items:center; gap:8px;">
            <div style="flex:1; height:6px; background:#e5e7eb; border-radius:3px; overflow:hidden; min-width:60px;">
              <div style="width:${item.level}%; height:100%; background:${item.level > 50 ? '#16a34a' : item.level > 20 ? '#eab308' : '#dc2626'};"></div>
            </div>
            <span style="font-size:0.78rem; font-weight:700;">${item.level}%</span>
          </div>
        </td>
        <td>
          <span class="badge ${item.healthStatus === 'Optimal' || item.healthStatus === 'Good' || item.healthStatus === 'Clean' || item.healthStatus === 'Certified Functional' ? 'badge-confirmed' : 'badge-danger'}">
            ${item.healthStatus}
          </span>
        </td>
        <td>
          <button class="btn-sm" onclick="adminApp.adjustInkStock('${item.id}')">Update Health</button>
        </td>
      </tr>
    `).join('');
  }

  adjustPaperStock(id) {
    const item = this.paperInventory.find(p => p.id === id);
    if (!item) return;

    const countStr = prompt(`Enter new inventory count for ${item.name} (${item.unitType}):`, item.units);
    if (countStr !== null) {
      const count = parseInt(countStr, 10);
      if (!isNaN(count) && count >= 0) {
        const diff = count - item.units;
        item.units = count;
        item.status = count < item.reorderLevel ? 'Low Stock' : 'In Stock';
        this.logAudit('INFO', 'Admin Desk', 'Storage Inventory', `Adjusted ${item.name} stock to ${count} ${item.unitType} (${diff >= 0 ? '+' : ''}${diff})`);
        this.broadcastWsEvent('INVENTORY_UPDATE', `Photo paper updated: ${item.name} is now ${count} ${item.unitType} (${item.status})`);
        this.renderPaperInventoryTable();
      } else {
        alert('Please enter a valid numeric value.');
      }
    }
  }

  adjustInkStock(id) {
    const item = this.inkInventory.find(i => i.id === id);
    if (!item) return;

    const levelStr = prompt(`Enter active consumable level (0-100%) for ${item.name}:`, item.level);
    if (levelStr !== null) {
      const lvl = parseInt(levelStr, 10);
      if (!isNaN(lvl) && lvl >= 0 && lvl <= 100) {
        item.level = lvl;
        if (lvl < 20) item.healthStatus = 'Replace Soon';
        else if (lvl < 50) item.healthStatus = 'Operational';
        else item.healthStatus = 'Optimal';

        this.logAudit('INFO', 'Admin Desk', 'Printer Consumables', `Updated ${item.name} operational level to ${lvl}% (${item.healthStatus})`);
        this.broadcastWsEvent('INVENTORY_UPDATE', `Ink consumable updated: ${item.name} level set to ${lvl}%`);
        this.renderInkInventoryTable();
      } else {
        alert('Please enter a percentage between 0 and 100.');
      }
    }
  }

  openResourceRestockModal() {
    const item = prompt('Enter item name to log restocking (e.g. 3R Strips, DNP Ribbon Roll, 4R Paper):', '3R Photo Strip Paper');
    if (item) {
      const qty = prompt(`Enter received quantity for "${item}":`, '500');
      if (qty) {
        this.logAudit('INFO', 'Admin Desk', 'Storage Restock', `Restock shipment received: ${qty} units of ${item}`);
        this.broadcastWsEvent('RESTOCK_RECEIVED', `Restock received: ${qty} units of ${item} logged into Bulacan central storage.`);
        alert(`Restock shipment of ${qty} units of ${item} successfully logged!`);
      }
    }
  }

  // --- Clients & Staff CRM ---
  renderClientsTable() {
    const tbody = document.getElementById('clientsTableBody');
    if (!tbody) return;

    const q = (document.getElementById('userSearchInput')?.value || '').toLowerCase();
    const filtered = this.clients.filter(c => c.name.toLowerCase().includes(q) || c.phone.includes(q) || c.email.includes(q));

    tbody.innerHTML = filtered.map(c => `
      <tr>
        <td><strong>${c.name}</strong></td>
        <td>${c.email}</td>
        <td>${c.phone}</td>
        <td>₱${c.spend.toLocaleString()} PHP</td>
        <td>${c.branch}</td>
      </tr>
    `).join('');
  }

  renderStaffTable() {
    const tbody = document.getElementById('staffTableBody');
    if (!tbody) return;

    tbody.innerHTML = this.staff.map(s => `
      <tr>
        <td><strong>${s.name}</strong></td>
        <td>${s.role}</td>
        <td>${s.branch}</td>
        <td><span class="badge ${s.twoFa === 'Enabled' ? 'badge-confirmed' : 'badge-danger'}">${s.twoFa}</span></td>
        <td><small>${s.permissions}</small></td>
        <td><button class="btn-sm" onclick="alert('Editing permissions for ${s.name}');">Permissions</button></td>
      </tr>
    `).join('');
  }

  addStaffModal() {
    const name = prompt('Enter full name of new studio staff member:');
    if (name) {
      this.staff.push({
        name,
        role: 'Studio Assistant',
        branch: 'Sta. Maria Bulacan',
        twoFa: 'Pending',
        permissions: 'Check-in Desk'
      });
      this.logAudit('INFO', 'Admin Desk', 'User Management', `Created staff account for: ${name}`);
      this.renderStaffTable();
    }
  }

  // --- Real-Time WebSockets Engine ---
  startMockWebSocketStream() {
    const terminal = document.getElementById('wsTerminal');
    if (!terminal) return;

    // Initial greeting packet
    this.appendWsPacket('SYSTEM', 'WebSocket connection established to wss://api.selfpicstudio.ph/v1/stream [ap-southeast-1]');
    this.appendWsPacket('HEARTBEAT', 'PONG from Sta. Maria node (17ms)');
    this.appendWsPacket('HEARTBEAT', 'PONG from Muzon SJDM node (19ms)');
    this.appendWsPacket('HEARTBEAT', 'PONG from Pandi node (18ms)');

    // Interval to simulate live traffic
    this.wsTimer = setInterval(() => {
      if (!this.wsActive) return;

      const events = [
        { type: 'HEARTBEAT', msg: `Cluster ping latency: ${Math.floor(16 + Math.random() * 8)}ms &bull; All 3 branches synced` },
        { type: 'ROOM_TIMER', msg: 'Sta. Maria Room 1: 5 minutes remaining for SOLO 249' },
        { type: 'GCASH_WEBHOOK', msg: 'GCash deposit verification handshake completed (ref: GC-99420)' },
        { type: 'PRINT_DESK', msg: 'Instant Strip Printer Pandi: 2pcs 3R strips printed successfully' }
      ];

      const chosen = events[Math.floor(Math.random() * events.length)];
      this.appendWsPacket(chosen.type, chosen.msg);

      // Jitter latency
      const latEl = document.getElementById('wsLatency');
      if (latEl) latEl.textContent = `${Math.floor(16 + Math.random() * 8)}ms`;
    }, 9000);
  }

  appendWsPacket(tag, message) {
    const terminal = document.getElementById('wsTerminal');
    if (!terminal) return;

    this.wsEventCounter++;
    const countEl = document.getElementById('wsEventCount');
    if (countEl) countEl.textContent = this.wsEventCounter;

    const timeStr = new Date().toLocaleTimeString('en-US', { hour12: false });
    const row = document.createElement('div');
    row.className = 'ws-log-row';

    let tagClass = 'event-booking';
    if (tag.includes('PAYMENT') || tag.includes('GCASH')) tagClass = 'event-payment';
    if (tag.includes('TIMER')) tagClass = 'event-timer';
    if (tag.includes('ERROR')) tagClass = 'event-error';

    row.innerHTML = `
      <span class="ws-time">[${timeStr}]</span>
      <span class="ws-event-tag ${tagClass}">&lt;${tag}&gt;</span>
      <span>${message}</span>
    `;

    terminal.appendChild(row);
    terminal.scrollTop = terminal.scrollHeight;
  }

  broadcastWsEvent(tag, message) {
    this.appendWsPacket(tag, message);
  }

  toggleWebSocket() {
    this.wsActive = !this.wsActive;
    const btn = document.getElementById('wsToggleBtn');
    const pill = document.getElementById('topbarWsPill');

    if (this.wsActive) {
      if (btn) btn.textContent = 'Pause Stream';
      if (pill) pill.innerHTML = '<span class="status-dot"></span><span>WS: LIVE (18ms)</span>';
      this.appendWsPacket('SYSTEM', 'WebSocket stream resumed.');
    } else {
      if (btn) btn.textContent = 'Resume Stream';
      if (pill) pill.innerHTML = '<span class="status-dot" style="background-color:#f59e0b; box-shadow:none;"></span><span>WS: PAUSED</span>';
      this.appendWsPacket('SYSTEM', 'WebSocket stream paused by admin.');
    }
  }

  triggerSimulatedEvent() {
    this.appendWsPacket('SIMULATED_TEST', `Admin manual injection: Packet sent to Sta. Maria, Muzon & Pandi nodes at ${new Date().toLocaleTimeString()}`);
  }

  clearWsTerminal() {
    const terminal = document.getElementById('wsTerminal');
    if (terminal) terminal.innerHTML = '<div style="color:#666;">Terminal cleared. Waiting for packets...</div>';
  }

  // --- Audit Logging ---
  logAudit(severity, actor, module, action) {
    const timeStr = new Date().toLocaleTimeString('en-US', { hour12: false });
    const traceId = 'TR-' + Math.floor(1000 + Math.random() * 9000);
    this.auditLogs.unshift({
      time: timeStr,
      severity,
      actor,
      module,
      action,
      traceId
    });
    this.renderAuditTable();
  }

  renderAuditTable() {
    const tbody = document.getElementById('auditTableBody');
    if (!tbody) return;

    const q = (document.getElementById('auditSearchInput')?.value || '').toLowerCase();
    const severity = document.getElementById('auditSeverityFilter')?.value || 'all';

    const filtered = this.auditLogs.filter(a => {
      if (severity !== 'all' && a.severity !== severity) return false;
      if (q && !`${a.actor} ${a.module} ${a.action}`.toLowerCase().includes(q)) return false;
      return true;
    });

    tbody.innerHTML = filtered.map(a => `
      <tr>
        <td><code>${a.time}</code></td>
        <td><span class="badge ${a.severity === 'CRITICAL' || a.severity === 'ERROR' ? 'badge-danger' : a.severity === 'WARN' ? 'badge-pending' : 'badge-confirmed'}">${a.severity}</span></td>
        <td><strong>${a.actor}</strong></td>
        <td>${a.module}</td>
        <td>${a.action}</td>
        <td><code>${a.traceId}</code></td>
      </tr>
    `).join('');
  }

  exportAuditLogs() {
    const jsonStr = JSON.stringify(this.auditLogs, null, 2);
    const blob = new Blob([jsonStr], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `self-pic-audit-logs-${Date.now()}.json`;
    a.click();
    this.logAudit('INFO', 'Admin Desk', 'Audit Module', 'Exported JSON audit logs report.');
  }

  // --- Security Module ---
  saveSecurityConfig() {
    this.logAudit('WARN', 'Admin Desk', 'Security', 'Updated IP rate-limiting rules and HMAC webhook verification policies.');
    alert('Security policies updated and pushed to API gateway successfully.');
  }

  addBlacklistIpModal() {
    const ip = prompt('Enter IP Address to block immediately:');
    if (ip) {
      const reason = prompt('Enter reason for blacklist (e.g. Scraper, Flooding):', 'Rate limit violation');
      const tbody = document.getElementById('blacklistTableBody');
      if (tbody) {
        const tr = document.createElement('tr');
        tr.innerHTML = `
          <td><code>${ip}</code></td>
          <td>${reason}</td>
          <td>Just now</td>
          <td><button class="btn-sm" onclick="this.closest('tr').remove()">Unblock</button></td>
        `;
        tbody.prepend(tr);
      }
      this.logAudit('WARN', 'Admin Desk', 'Security', `Blacklisted IP address: ${ip} (${reason})`);
      alert(`IP ${ip} blocked.`);
    }
  }

  // --- Walk-in & Quick Actions ---
  quickWalkinModal() {
    const name = prompt('Walk-In Client Name:', 'Walk-in Guest');
    if (!name) return;

    const branch = prompt('Branch (Sta. Maria Bulacan / Muzon, San Jose Del Monte / Pandi Bulacan):', 'Sta. Maria Bulacan');
    const pkg = prompt('Package (SOLO 199, SOLO 249, DUO 249, DUO 399, etc.):', 'SOLO 199');
    const time = prompt('Shoot Time Slot (e.g. 10:00 AM, 11:00 AM):', '02:00 PM');

    const newRef = 'SP-' + Math.floor(100000 + Math.random() * 900000);
    this.bookings.unshift({
      ref: newRef,
      customer: name,
      email: 'walkin@studio.local',
      phone: '0900-WALK-IN',
      branch: branch || 'Sta. Maria Bulacan',
      package: pkg || 'SOLO 199',
      date: new Date().toISOString().split('T')[0],
      time: time || '02:00 PM',
      duration: '10 mins',
      addons: 'None',
      total: 199,
      paid: 199,
      balance: 0,
      paymentOption: '100% Full Payment',
      status: 'In-Shoot'
    });

    this.logAudit('INFO', 'Front Desk', 'Bookings', `Created walk-in reservation: ${newRef} for ${name} at ${branch}`);
    this.broadcastWsEvent('WALK_IN_CREATED', `Walk-in reservation ${newRef} started at ${branch}`);
    this.renderAll();
    alert(`Walk-in reservation ${newRef} created and sent to shoot floor!`);
  }

  broadcastAnnouncement() {
    const msg = prompt('Enter broadcast announcement to all 3 branches:');
    if (msg) {
      this.broadcastWsEvent('STUDIO_BROADCAST', `Announcement from Admin: "${msg}"`);
      this.logAudit('INFO', 'Admin Desk', 'Broadcast', `Sent broadcast to all branches: "${msg}"`);
      alert('Broadcast dispatched over WebSocket channel.');
    }
  }

  exportSalesReport() {
    let csv = "Reference,Customer,Branch,Package,Date,Time,Total,Paid,Balance,Status\n";
    this.bookings.forEach(b => {
      csv += `"${b.ref}","${b.customer}","${b.branch}","${b.package}","${b.date}","${b.time}",${b.total},${b.paid},${b.balance},"${b.status}"\n`;
    });

    const blob = new Blob([csv], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `self-pic-sales-report-${Date.now()}.csv`;
    a.click();
    this.logAudit('INFO', 'Admin Desk', 'Analytics', 'Exported Sales Report CSV.');
  }

  // --- Analytics & Report Filtering & PDF Generation ---
  getFilteredAnalyticsBookings() {
    const start = document.getElementById('reportStartDate')?.value || '';
    const end = document.getElementById('reportEndDate')?.value || '';
    const branch = document.getElementById('reportBranchFilter')?.value || 'all';

    return this.bookings.filter(b => {
      if (branch !== 'all' && !b.branch.toLowerCase().includes(branch.toLowerCase())) {
        return false;
      }
      if (start && b.date < start) {
        return false;
      }
      if (end && b.date > end) {
        return false;
      }
      return true;
    });
  }

  renderAnalyticsReport() {
    const startInput = document.getElementById('reportStartDate');
    const endInput = document.getElementById('reportEndDate');
    const branchSelect = document.getElementById('reportBranchFilter');
    if (!startInput || !endInput || !branchSelect) return;

    if (!startInput.value) startInput.value = '2026-09-01';
    if (!endInput.value) endInput.value = '2026-09-30';

    const start = startInput.value;
    const end = endInput.value;
    const branch = branchSelect.value;
    const branchLabel = branch === 'all' ? 'All Bulacan Branches' : branch;
    const filtered = this.getFilteredAnalyticsBookings();

    const totalSales = filtered.reduce((acc, b) => acc + (b.total || 0), 0);
    const totalPaid = filtered.reduce((acc, b) => acc + (b.paid || 0), 0);
    const totalBal = filtered.reduce((acc, b) => acc + (b.balance || 0), 0);

    const countEl = document.getElementById('repFilteredCount');
    const totalEl = document.getElementById('repFilteredTotal');
    const paidEl = document.getElementById('repFilteredPaid');
    const balEl = document.getElementById('repFilteredBalance');
    const rangeBadge = document.getElementById('repDateRangeBadge');
    const branchBadge = document.getElementById('repBranchBadge');
    const tableBadge = document.getElementById('repTableCountBadge');
    const tableSubtitle = document.getElementById('repTableSubtitle');

    if (countEl) countEl.textContent = `${filtered.length}`;
    if (totalEl) totalEl.textContent = `₱${totalSales.toLocaleString()} PHP`;
    if (paidEl) paidEl.textContent = `₱${totalPaid.toLocaleString()} PHP`;
    if (balEl) balEl.textContent = `₱${totalBal.toLocaleString()} PHP`;
    if (rangeBadge) rangeBadge.textContent = `${start} to ${end}`;
    if (branchBadge) branchBadge.textContent = branchLabel;
    if (tableBadge) tableBadge.textContent = `${filtered.length} records`;
    if (tableSubtitle) tableSubtitle.textContent = `Filtered range: ${start} to ${end} • Scope: ${branchLabel}`;

    const tbody = document.getElementById('reportTableBody');
    if (tbody) {
      if (filtered.length === 0) {
        tbody.innerHTML = `<tr><td colspan="9" style="text-align: center; padding: 36px 16px; color: var(--admin-gray-mid);">No booking records found for the selected date range (${start} to ${end}) and branch scope (${branchLabel}).</td></tr>`;
      } else {
        tbody.innerHTML = filtered.map(b => `
          <tr>
            <td><code style="font-size: 0.8rem; font-weight: 700;">${b.date}</code></td>
            <td><strong>${b.ref}</strong></td>
            <td>${b.customer}</td>
            <td><span class="badge badge-neutral">${b.branch}</span></td>
            <td>${b.package}</td>
            <td><strong>₱${b.total.toLocaleString()}</strong></td>
            <td style="color: #10b981; font-weight: 700;">₱${b.paid.toLocaleString()}</td>
            <td style="color: ${b.balance > 0 ? '#ef4444' : '#6b7280'}; font-weight: 700;">₱${b.balance.toLocaleString()}</td>
            <td>${this.getStatusBadgeHtml(b.status)}</td>
          </tr>
        `).join('');
      }
    }
  }

  applyAnalyticsFilter() {
    this.renderAnalyticsReport();
    const branch = document.getElementById('reportBranchFilter')?.value || 'all';
    const start = document.getElementById('reportStartDate')?.value || '';
    const end = document.getElementById('reportEndDate')?.value || '';
    this.logAudit('INFO', 'Admin Desk', 'Analytics Filter', `Filtered analytics report: ${start} to ${end} (${branch})`);
  }

  resetAnalyticsFilter() {
    const startInput = document.getElementById('reportStartDate');
    const endInput = document.getElementById('reportEndDate');
    const branchSelect = document.getElementById('reportBranchFilter');
    if (startInput) startInput.value = '2026-09-01';
    if (endInput) endInput.value = '2026-09-30';
    if (branchSelect) branchSelect.value = 'all';
    this.renderAnalyticsReport();
    this.logAudit('INFO', 'Admin Desk', 'Analytics Filter', 'Reset analytics report filters to default range.');
  }

  downloadReportPDF() {
    const start = document.getElementById('reportStartDate')?.value || '2026-09-01';
    const end = document.getElementById('reportEndDate')?.value || '2026-09-30';
    const branch = document.getElementById('reportBranchFilter')?.value || 'all';
    const branchLabel = branch === 'all' ? 'All Bulacan Branches' : branch;
    const filtered = this.getFilteredAnalyticsBookings();

    const totalSales = filtered.reduce((acc, b) => acc + (b.total || 0), 0);
    const totalPaid = filtered.reduce((acc, b) => acc + (b.paid || 0), 0);
    const totalBal = filtered.reduce((acc, b) => acc + (b.balance || 0), 0);
    const currentUser = sessionStorage.getItem('selfPicAdminUser') || 'Admin Desk';

    // Direct PDF download via jsPDF if available
    if (window.jspdf && window.jspdf.jsPDF) {
      try {
        const { jsPDF } = window.jspdf;
        const doc = new jsPDF({ orientation: 'portrait', unit: 'pt', format: 'a4' });

        // Header Banner
        doc.setFillColor(15, 15, 15);
        doc.rect(0, 0, doc.internal.pageSize.getWidth(), 65, 'F');
        doc.setTextColor(255, 255, 255);
        doc.setFontSize(15);
        doc.setFont('helvetica', 'bold');
        doc.text('SELF-PIC PHOTO STUDIO', 40, 30);
        doc.setFontSize(9);
        doc.setFont('helvetica', 'normal');
        doc.text('OFFICIAL ANALYTICS & FINANCIAL SALES REPORT', 40, 46);

        // Metadata grid
        doc.setTextColor(50, 50, 50);
        doc.setFontSize(9);
        doc.setFont('helvetica', 'bold');
        doc.text('STARTING DATE:', 40, 85);
        doc.setFont('helvetica', 'normal');
        doc.text(`${start}`, 130, 85);

        doc.setFont('helvetica', 'bold');
        doc.text('END DATE:', 40, 100);
        doc.setFont('helvetica', 'normal');
        doc.text(`${end}`, 130, 100);

        doc.setFont('helvetica', 'bold');
        doc.text('BRANCH SCOPE:', 40, 115);
        doc.setFont('helvetica', 'normal');
        doc.text(`${branchLabel}`, 130, 115);

        doc.setFont('helvetica', 'bold');
        doc.text('GENERATED BY:', 320, 85);
        doc.setFont('helvetica', 'normal');
        doc.text(`${currentUser}`, 420, 85);

        doc.setFont('helvetica', 'bold');
        doc.text('EXPORT TIMESTAMP:', 320, 100);
        doc.setFont('helvetica', 'normal');
        doc.text(new Date().toLocaleString(), 420, 100);

        // KPI Summary Box
        doc.setDrawColor(210, 210, 215);
        doc.setFillColor(248, 248, 250);
        doc.roundedRect(40, 130, 515, 46, 4, 4, 'FD');

        doc.setFontSize(8);
        doc.setTextColor(100, 100, 100);
        doc.text('TOTAL BOOKINGS', 55, 146);
        doc.text('TOTAL REVENUE', 180, 146);
        doc.text('PAID REVENUE', 315, 146);
        doc.text('OUTSTANDING BALANCE', 435, 146);

        doc.setFontSize(11);
        doc.setFont('helvetica', 'bold');
        doc.setTextColor(15, 15, 15);
        doc.text(`${filtered.length}`, 55, 163);
        doc.text(`PHP ${totalSales.toLocaleString()}`, 180, 163);
        doc.setTextColor(16, 185, 129);
        doc.text(`PHP ${totalPaid.toLocaleString()}`, 315, 163);
        doc.setTextColor(totalBal > 0 ? 239 : 15, totalBal > 0 ? 68 : 15, totalBal > 0 ? 68 : 15);
        doc.text(`PHP ${totalBal.toLocaleString()}`, 435, 163);

        // Detailed Table
        const rows = filtered.map(b => [
          b.date,
          b.ref,
          b.customer,
          b.branch.replace(', San Jose Del Monte', ' SJDM'),
          b.package,
          `PHP ${b.total.toLocaleString()}`,
          `PHP ${b.paid.toLocaleString()}`,
          `PHP ${b.balance.toLocaleString()}`,
          b.status
        ]);

        doc.autoTable({
          head: [['Date', 'Ref #', 'Customer', 'Branch', 'Package', 'Total', 'Paid', 'Balance', 'Status']],
          body: rows,
          startY: 190,
          margin: { left: 40, right: 40 },
          headStyles: { fillColor: [15, 15, 15], textColor: [255, 255, 255], fontStyle: 'bold', fontSize: 8 },
          bodyStyles: { fontSize: 7.5, textColor: [35, 35, 35] },
          alternateRowStyles: { fillColor: [248, 248, 250] },
          theme: 'grid'
        });

        const safeBranch = branch === 'all' ? 'All_Branches' : branch.replace(/[^a-zA-Z0-9]/g, '_');
        const filename = `SelfPic-Report-${start}-to-${end}-${safeBranch}.pdf`;
        doc.save(filename);
        this.logAudit('INFO', currentUser, 'Analytics', `Downloaded PDF sales report (${start} to ${end}, ${branchLabel}).`);
        return;
      } catch (err) {
        console.warn('jsPDF generation failed, falling back to printable window:', err);
      }
    }

    // High fidelity fallback: printable report window with native PDF export
    this.openPrintableReportWindow(start, end, branchLabel, filtered, totalSales, totalPaid, totalBal, currentUser);
  }

  openPrintableReportWindow(start, end, branchLabel, filtered, totalSales, totalPaid, totalBal, currentUser) {
    const printWindow = window.open('', '_blank', 'width=950,height=850');
    if (!printWindow) {
      alert('Please allow popups to open the PDF report print preview.');
      return;
    }
    const rowsHtml = filtered.length ? filtered.map(b => `
      <tr>
        <td><code>${b.date}</code></td>
        <td><strong>${b.ref}</strong></td>
        <td>${b.customer}</td>
        <td>${b.branch}</td>
        <td>${b.package}</td>
        <td style="text-align:right;">₱${b.total.toLocaleString()}</td>
        <td style="text-align:right; color:#059669; font-weight:700;">₱${b.paid.toLocaleString()}</td>
        <td style="text-align:right; color:${b.balance > 0 ? '#dc2626' : '#6b7280'}; font-weight:700;">₱${b.balance.toLocaleString()}</td>
        <td><span class="badge">${b.status}</span></td>
      </tr>
    `).join('') : `<tr><td colspan="9" style="text-align:center; padding:32px; color:#666;">No bookings found for the selected date range (${start} to ${end}) and branch scope.</td></tr>`;

    printWindow.document.write(`<!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8">
  <title>Self-Pic Studio Analytics Report (${start} to ${end})</title>
  <style>
    body { font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Arial, sans-serif; color: #111; margin: 0; padding: 32px; font-size: 13px; line-height: 1.4; }
    .header { display: flex; justify-content: space-between; align-items: center; border-bottom: 2px solid #000; padding-bottom: 16px; margin-bottom: 20px; }
    .header h1 { margin: 0 0 4px 0; font-size: 22px; text-transform: uppercase; letter-spacing: 0.05em; font-weight: 800; }
    .header p { margin: 0; color: #666; font-size: 12px; }
    .meta-grid { display: grid; grid-template-columns: repeat(4, 1fr); gap: 12px; margin-bottom: 20px; background: #f9fafb; padding: 14px 18px; border: 1px solid #e5e7eb; border-radius: 6px; }
    .meta-item strong { display: block; font-size: 10px; text-transform: uppercase; color: #6b7280; margin-bottom: 2px; }
    .meta-item span { font-weight: 700; font-size: 13px; color: #111; }
    .kpi-row { display: grid; grid-template-columns: repeat(4, 1fr); gap: 14px; margin-bottom: 24px; }
    .kpi-box { border: 1px solid #000; padding: 14px; border-radius: 6px; text-align: center; background: #fff; }
    .kpi-box .label { font-size: 10px; text-transform: uppercase; font-weight: 700; color: #666; margin-bottom: 4px; display: block; }
    .kpi-box .val { font-size: 19px; font-weight: 800; }
    table { width: 100%; border-collapse: collapse; margin-bottom: 24px; font-size: 12px; }
    th { background: #000; color: #fff; text-align: left; padding: 9px 10px; font-size: 10px; text-transform: uppercase; letter-spacing: 0.05em; }
    td { padding: 9px 10px; border-bottom: 1px solid #e5e7eb; }
    tr:nth-child(even) td { background-color: #f9fafb; }
    .badge { display: inline-block; padding: 2px 8px; border-radius: 4px; font-size: 11px; font-weight: 600; background: #e5e7eb; color: #374151; }
    .footer { margin-top: 36px; padding-top: 14px; border-top: 1px solid #e5e7eb; display: flex; justify-content: space-between; font-size: 11px; color: #666; }
    .no-print { margin-bottom: 24px; display: flex; gap: 12px; background: #f3f4f6; padding: 12px; border-radius: 6px; }
    .btn { padding: 9px 18px; background: #000; color: #fff; border: 1px solid #000; border-radius: 4px; font-weight: 700; cursor: pointer; font-size: 13px; }
    .btn-secondary { background: #fff; color: #000; }
    @media print {
      .no-print { display: none !important; }
      body { padding: 0; }
    }
  </style>
</head>
<body>
  <div class="no-print">
    <button class="btn" onclick="window.print()">Save as PDF / Print</button>
    <button class="btn btn-secondary" onclick="window.close()">Close Window</button>
  </div>
  <div class="header">
    <div>
      <h1>Self - Pic Photo Studio</h1>
      <p>Official Analytics & Financial Sales Report</p>
    </div>
    <div style="text-align: right;">
      <img src="logoo.png" alt="Self-Pic Studio Logo" style="max-height: 52px; object-fit: contain;">
    </div>
  </div>
  <div class="meta-grid">
    <div class="meta-item"><strong>Date Period</strong><span>${start} &ndash; ${end}</span></div>
    <div class="meta-item"><strong>Branch Scope</strong><span>${branchLabel}</span></div>
    <div class="meta-item"><strong>Generated By</strong><span>${currentUser}</span></div>
    <div class="meta-item"><strong>Export Timestamp</strong><span>${new Date().toLocaleString()}</span></div>
  </div>
  <div class="kpi-row">
    <div class="kpi-box"><span class="label">Total Bookings</span><span class="val">${filtered.length}</span></div>
    <div class="kpi-box"><span class="label">Total Period Sales</span><span class="val">₱${totalSales.toLocaleString()}</span></div>
    <div class="kpi-box"><span class="label">Collected Payments</span><span class="val" style="color:#059669;">₱${totalPaid.toLocaleString()}</span></div>
    <div class="kpi-box"><span class="label">Receivable Balance</span><span class="val" style="color:${totalBal > 0 ? '#dc2626' : '#111'};">₱${totalBal.toLocaleString()}</span></div>
  </div>
  <table>
    <thead>
      <tr>
        <th>Date</th>
        <th>Ref #</th>
        <th>Customer</th>
        <th>Branch</th>
        <th>Package</th>
        <th style="text-align:right;">Total</th>
        <th style="text-align:right;">Paid</th>
        <th style="text-align:right;">Balance</th>
        <th>Status</th>
      </tr>
    </thead>
    <tbody>${rowsHtml}</tbody>
  </table>
  <div class="footer">
    <span>Self-Pic Photo Studio Admin Portal • Confidential Financial Report</span>
    <span>Generated on ${new Date().toLocaleDateString()}</span>
  </div>
</body>
</html>`);
    printWindow.document.close();
    printWindow.focus();
    setTimeout(() => {
      printWindow.print();
    }, 450);
    this.logAudit('INFO', currentUser, 'Analytics', `Generated PDF sales report (${start} to ${end}, ${branchLabel}).`);
  }
}

// Instantiate and initialize on DOM ready
document.addEventListener('DOMContentLoaded', () => {
  window.adminApp = new AdminApplication();
  window.adminApp.init();
});
