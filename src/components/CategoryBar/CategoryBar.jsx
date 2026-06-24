import './CategoryBar.css';

// CategoryBar Component - receives props: categories, selectedCategory, onSelectCategory
function CategoryBar({ categories, selectedCategory, onSelectCategory }) {
  const allCategories = [
    { id: 0, name: 'All', icon: '🏪' },
    ...categories,
  ];

  return (
    <section className="category-bar" id="category-section">
      <h2>Shop by Category</h2>
      <ul className="category-list">
        {allCategories.map((cat) => (
          <li key={cat.id} className="category-item">
            <button
              id={`cat-btn-${cat.name.replace(/\s+/g, '-').toLowerCase()}`}
              className={`category-chip ${selectedCategory === cat.name ? 'active' : ''}`}
              onClick={() => onSelectCategory(cat.name)}
            >
              <span className="cat-icon">{cat.icon}</span>
              <span className="cat-name">{cat.name}</span>
            </button>
          </li>
        ))}
      </ul>
    </section>
  );
}

export default CategoryBar;
