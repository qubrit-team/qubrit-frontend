import '../styles/components/SearchBar.css'

function SearchBar({ value, onChange, placeholder = '검색어를 입력하세요' }) {
  return (
    <label className="searchBar">
      <img src="/assets/search/search.svg" alt="" width="20" height="20" />
      <input
        className="searchBarInput"
        type="search"
        value={value}
        placeholder={placeholder}
        onChange={(e) => onChange(e.target.value)}
      />
    </label>
  )
}

export default SearchBar
