const statusOptions = [
  { value: 'all', label: 'Toutes' },
  { value: 'Non terminee', label: 'A faire' },
  { value: 'En cours', label: 'En cours' },
  { value: 'Terminee', label: 'Terminees' }
];

export default function TaskFilters({ filters, onChange }) {
  const updateFilter = (key, value) => {
    onChange({ ...filters, [key]: value });
  };

  return (
    <section className="toolbar" aria-label="Filtres des taches">
      <div className="search-box">
        <span aria-hidden="true">Search</span>
        <input
          value={filters.search}
          onChange={(event) => updateFilter('search', event.target.value)}
          placeholder="Rechercher une tache"
        />
      </div>

      <div className="segmented-control">
        {statusOptions.map((option) => (
          <button
            key={option.value}
            type="button"
            className={filters.status === option.value ? 'active' : ''}
            onClick={() => updateFilter('status', option.value)}
          >
            {option.label}
          </button>
        ))}
      </div>
    </section>
  );
}