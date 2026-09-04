import { useState, useMemo } from 'react';
import { Receipt, Search, Filter, ArrowUpDown, Download } from 'lucide-react';

function exportToCsv(transactions) {
  if (!transactions || transactions.length === 0) return;

  const headers = ['ID', 'Date', 'Description', 'Category', 'Amount (INR)'];
  const rows = transactions.map((t) => [
    t.id,
    t.created_at ? new Date(t.created_at).toLocaleDateString() : 'N/A',
    `"${(t.description || 'No description').replace(/"/g, '""')}"`,
    `"${(t.category_name || 'Uncategorized').replace(/"/g, '""')}"`,
    t.amount,
  ]);

  const csvContent = 'data:text/csv;charset=utf-8,' + [headers.join(','), ...rows.map(r => r.join(','))].join('\n');
  const encodedUri = encodeURI(csvContent);
  const link = document.createElement('a');
  link.setAttribute('href', encodedUri);
  link.setAttribute('download', `FinSight_Statement_${new Date().toISOString().slice(0, 10)}.csv`);
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
}

function TransactionListSection({ transactions }) {
  const [search, setSearch] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('ALL');
  const [sortBy, setSortBy] = useState('NEWEST');

  // Extract unique categories
  const categories = useMemo(() => {
    const set = new Set();
    transactions.forEach((t) => {
      if (t.category_name) set.add(t.category_name);
    });
    return Array.from(set);
  }, [transactions]);

  // Filter and sort logic
  const filteredTransactions = useMemo(() => {
    return transactions
      .filter((t) => {
        const matchesSearch = (t.description || '').toLowerCase().includes(search.toLowerCase()) ||
                              (t.category_name || '').toLowerCase().includes(search.toLowerCase());
        const matchesCategory = categoryFilter === 'ALL' || t.category_name === categoryFilter;
        return matchesSearch && matchesCategory;
      })
      .sort((a, b) => {
        if (sortBy === 'HIGHEST') return parseFloat(b.amount) - parseFloat(a.amount);
        if (sortBy === 'LOWEST') return parseFloat(a.amount) - parseFloat(b.amount);
        if (sortBy === 'OLDEST') return a.id - b.id;
        return b.id - a.id; // NEWEST
      });
  }, [transactions, search, categoryFilter, sortBy]);

  return (
    <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-5 shadow-sm space-y-4">
      {/* Header with Title & Export Action */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3">
        <div className="flex items-center gap-2">
          <Receipt className="w-4 h-4 text-emerald-400" />
          <h3 className="text-zinc-100 font-semibold text-base tracking-tight">Recent Transactions</h3>
          <span className="text-zinc-400 text-xs bg-zinc-950 px-2 py-0.5 rounded border border-zinc-800">
            {filteredTransactions.length} items
          </span>
        </div>

        <button
          onClick={() => exportToCsv(filteredTransactions)}
          disabled={filteredTransactions.length === 0}
          className="flex items-center gap-1.5 px-3 py-1.5 bg-zinc-950 hover:bg-zinc-800 text-zinc-200 border border-zinc-800 text-xs font-medium rounded-lg transition-colors cursor-pointer disabled:opacity-50"
        >
          <Download className="w-3.5 h-3.5 text-emerald-400" /> Export CSV
        </button>
      </div>

      {/* Filter and Search Bar */}
      <div className="grid grid-cols-1 sm:grid-cols-12 gap-3">
        {/* Keyword Search */}
        <div className="sm:col-span-6 relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-500" />
          <input
            type="text"
            placeholder="Search description or category..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full bg-zinc-950 border border-zinc-800 rounded-lg pl-9 pr-3.5 py-2 text-zinc-100 text-xs placeholder-zinc-500 focus:outline-none focus:border-emerald-500 transition-colors"
          />
        </div>

        {/* Category Filter Dropdown */}
        <div className="sm:col-span-3 relative">
          <Filter className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-zinc-500 pointer-events-none" />
          <select
            value={categoryFilter}
            onChange={(e) => setCategoryFilter(e.target.value)}
            className="w-full bg-zinc-950 border border-zinc-800 rounded-lg pl-8 pr-3 py-2 text-zinc-100 text-xs focus:outline-none focus:border-emerald-500 transition-colors appearance-none cursor-pointer"
          >
            <option value="ALL">All Categories</option>
            {categories.map((cat) => (
              <option key={cat} value={cat}>
                {cat}
              </option>
            ))}
          </select>
        </div>

        {/* Sort Dropdown */}
        <div className="sm:col-span-3 relative">
          <ArrowUpDown className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-zinc-500 pointer-events-none" />
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
            className="w-full bg-zinc-950 border border-zinc-800 rounded-lg pl-8 pr-3 py-2 text-zinc-100 text-xs focus:outline-none focus:border-emerald-500 transition-colors appearance-none cursor-pointer"
          >
            <option value="NEWEST">Newest First</option>
            <option value="OLDEST">Oldest First</option>
            <option value="HIGHEST">Highest Amount</option>
            <option value="LOWEST">Lowest Amount</option>
          </select>
        </div>
      </div>

      {/* Transactions List */}
      {filteredTransactions.length === 0 ? (
        <div className="text-center py-8 border border-dashed border-zinc-800 rounded-lg text-zinc-400 text-xs">
          No transactions match your search or filter parameters.
        </div>
      ) : (
        <div className="divide-y divide-zinc-800/60 max-h-[380px] overflow-y-auto pr-1">
          {filteredTransactions.map((t) => (
            <div
              key={t.id}
              className="flex justify-between items-center py-3 px-2 transition-colors hover:bg-zinc-950/60 rounded-md"
            >
              <div>
                <p className="text-zinc-100 text-sm font-medium">{t.description || 'No description'}</p>
                <div className="flex items-center gap-2 text-xs text-zinc-500 mt-0.5">
                  <span className="inline-block px-2 py-0.2 bg-zinc-950 border border-zinc-800 text-zinc-400 rounded text-[10px]">
                    {t.category_name || 'General'}
                  </span>
                  <span>{t.created_at ? new Date(t.created_at).toLocaleDateString() : ''}</span>
                </div>
              </div>
              <span className="text-zinc-100 font-semibold text-sm">₹{t.amount}</span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default TransactionListSection;
