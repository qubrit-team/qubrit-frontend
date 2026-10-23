// 문제 세트 검색 화면
import { useEffect, useState } from 'react'
import MainLayout from '../components/MainLayout'
import SearchBar from '../components/SearchBar'
import SetListItem from '../components/SetListItem'
import FilterBar from '../components/FilterBar'
import SortTabs from '../components/SortTabs'
import { searchSets } from '../api/sets'
import { fetchSubjects } from '../api/subjects'
import { describeError } from '../api/http'
import '../styles/SearchPage.css'

const PAGE_SIZE = 20
const DEBOUNCE_MS = 300
// TODO: 백엔드가 정렬 파라미터를 지원하면 인기순/신뢰도순 활성화
const SORTS = [
  { value: 'popular', label: '인기순', disabled: true },
  { value: 'latest', label: '최신순' },
  { value: 'trust', label: '신뢰도순', disabled: true },
]

function SearchPage({ onNavigate }) {
  const [subjects, setSubjects] = useState([])
  const [subject, setSubject] = useState('') // '' = 전체
  const [input, setInput] = useState('')
  const [query, setQuery] = useState('')
  const [items, setItems] = useState([])
  const [total, setTotal] = useState(0)
  const [page, setPage] = useState(0)
  // 마지막으로 끝난 요청의 키/오류. 현재 요청 키와 다르면 아직 불러오는 중이다
  const [done, setDone] = useState({ key: '', error: '' })
  const requestKey = `${subject}|${query}|${page}`
  const loading = done.key !== requestKey
  const error = done.key === requestKey ? done.error : ''

  useEffect(() => {
    fetchSubjects().then(setSubjects).catch(() => setSubjects([]))
  }, [])

  // 타이핑이 멈추면 검색
  useEffect(() => {
    const t = setTimeout(() => setQuery(input.trim()), DEBOUNCE_MS)
    return () => clearTimeout(t)
  }, [input])

  // 검색어/과목이 바뀌면 첫 페이지부터, page가 늘면 이어 붙인다
  useEffect(() => {
    let ignore = false
    searchSets({ subject, q: query, page, size: PAGE_SIZE })
      .then((res) => {
        if (ignore) return
        setItems((prev) => (page === 0 ? res.items : [...prev, ...res.items]))
        setTotal(res.totalItems)
        setDone({ key: requestKey, error: '' })
      })
      .catch((err) => !ignore && setDone({ key: requestKey, error: describeError(err) }))
    return () => { ignore = true }
  }, [subject, query, page, requestKey])

  const changeSubject = (s) => {
    setPage(0)
    setSubject((prev) => (prev === s ? '' : s))
  }
  const changeInput = (v) => {
    setPage(0)
    setInput(v)
  }

  return (
    <MainLayout active="search" onNavigate={onNavigate} topBar={false} className="screenDark">
      <div className="searchPage">
        <h1 className="searchTitle">검색</h1>
        <SearchBar value={input} onChange={changeInput} placeholder="문제 세트 제목으로 검색" />

        <FilterBar options={subjects} value={subject} onChange={changeSubject} />

        <div className="resultHeader">
          <h2 className="resultTitle">결과 {total}</h2>
          <SortTabs options={SORTS} value="latest" onChange={() => {}} />
        </div>

        {error && <p className="searchError">{error}</p>}
        {!error && !loading && items.length === 0 && <p className="searchEmpty">검색 결과가 없어요</p>}

        <ul className="setList">
          {items.map((set) => (
            <SetListItem
              key={set.id}
              set={set}
              onClick={() => onNavigate('solve', { setId: set.id, from: 'search' })}
            />
          ))}
        </ul>

        {items.length < total && (
          <button type="button" className="moreButton" disabled={loading} onClick={() => setPage((p) => p + 1)}>
            {loading ? '불러오는 중...' : '더 보기'}
          </button>
        )}
      </div>
    </MainLayout>
  )
}

export default SearchPage
