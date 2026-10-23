import { useCallback, useEffect, useRef, useState } from 'react'
import { DEFAULT_FILTERS } from '../utils/filters'
import '../styles/components/FilterSheet.css'

const CLOSE_MS = 250
const DRAG_CLOSE_PX = 100 // 이만큼 이상 끌어내리면 닫는다

const DIFFICULTIES = ['하', '중', '상']
// TODO: 백엔드에 태그 목록이 생기면 API로 교체
const TAGS = ['#리스트', '#기말고사', '#반복문', '#함수', '#딕셔너리', '#정보처리기능사']

// 하단에서 올라오는 검색 필터 시트. 적용 전까지는 draft로만 들고 있다가 "보기"를 눌러야 반영한다.
// TODO: 백엔드가 난이도/신뢰도/태그/푼 문제 제외 필터를 지원하면 검색 요청에 연결
function FilterSheet({ value, total, onApply, onClose }) {
  const [draft, setDraft] = useState(value)
  const [closing, setClosing] = useState(false)
  const [dragY, setDragY] = useState(0)
  const [dragging, setDragging] = useState(false)
  const startY = useRef(0)
  const timer = useRef(null)

  // 내려가는 애니메이션이 끝난 뒤 after를 실행한다
  const dismiss = useCallback((after) => {
    if (timer.current) return
    setClosing(true)
    timer.current = setTimeout(after, CLOSE_MS)
  }, [])
  const close = useCallback(() => dismiss(onClose), [dismiss, onClose])

  useEffect(() => {
    const onKey = (e) => e.key === 'Escape' && close()
    document.addEventListener('keydown', onKey)
    return () => document.removeEventListener('keydown', onKey)
  }, [close])
  useEffect(() => () => clearTimeout(timer.current), [])

  // 핸들/헤더를 잡고 끌어내리기
  const onDragStart = (e) => {
    if (closing || e.target.closest('button')) return
    e.currentTarget.setPointerCapture(e.pointerId)
    startY.current = e.clientY
    setDragging(true)
  }
  const onDragMove = (e) => {
    if (dragging) setDragY(Math.max(0, e.clientY - startY.current))
  }
  const onDragEnd = () => {
    if (!dragging) return
    setDragging(false)
    if (dragY > DRAG_CLOSE_PX) close()
    else setDragY(0)
  }

  const update = (patch) => setDraft((d) => ({ ...d, ...patch }))
  const toggleTag = (tag) =>
    update({ tags: draft.tags.includes(tag) ? draft.tags.filter((t) => t !== tag) : [...draft.tags, tag] })

  return (
    <div className="filterSheetRoot">
      <div className={`filterSheetBackdrop ${closing ? 'isClosing' : ''}`} onClick={close} />
      <div
        className={`filterSheet ${dragging ? 'isDragging' : ''}`}
        role="dialog"
        aria-modal="true"
        aria-label="필터"
        style={{ transform: closing ? 'translateY(100%)' : `translateY(${dragY}px)` }}
      >
        <div
          className="filterSheetGrab"
          onPointerDown={onDragStart}
          onPointerMove={onDragMove}
          onPointerUp={onDragEnd}
          onPointerCancel={onDragEnd}
        >
        <div className="filterSheetHandle" />
        <header className="filterSheetHeader">
          <h2>필터</h2>
          <button type="button" aria-label="닫기" onClick={close}>
            <img src="/assets/search/close.svg" alt="" width="13" height="13" />
          </button>
        </header>
        </div>

        <fieldset className="filterGroup">
          <legend>난이도</legend>
          <div className="filterDifficulty">
            {DIFFICULTIES.map((d) => (
              <button
                key={d}
                type="button"
                aria-pressed={draft.difficulty === d}
                className={`filterPill ${draft.difficulty === d ? 'isOn' : ''}`}
                onClick={() => update({ difficulty: draft.difficulty === d ? '' : d })}
              >
                {d}
              </button>
            ))}
          </div>
        </fieldset>

        <div className="filterGroup">
          <label htmlFor="filterTrust" className="filterGroupTitle">최소 신뢰도</label>
          <div className="filterTrustRow">
            <span>이 점수 이상만 보여줘요</span>
            <b>{draft.minTrust}+</b>
          </div>
          <input
            id="filterTrust"
            className="filterRange"
            type="range"
            min="0"
            max="100"
            value={draft.minTrust}
            style={{ '--fill': `${draft.minTrust}%` }}
            onChange={(e) => update({ minTrust: Number(e.target.value) })}
          />
        </div>

        <fieldset className="filterGroup">
          <legend>태그</legend>
          <div className="filterTags">
            {TAGS.map((t) => (
              <button
                key={t}
                type="button"
                aria-pressed={draft.tags.includes(t)}
                className={`filterTag ${draft.tags.includes(t) ? 'isOn' : ''}`}
                onClick={() => toggleTag(t)}
              >
                {t}
              </button>
            ))}
          </div>
        </fieldset>

        <div className="filterSwitchRow">
          <span>내가 푼 문제 제외</span>
          <button
            type="button"
            role="switch"
            aria-checked={draft.excludeSolved}
            aria-label="내가 푼 문제 제외"
            className="filterSwitch"
            onClick={() => update({ excludeSolved: !draft.excludeSolved })}
          />
        </div>

        <footer className="filterSheetFooter">
          <button type="button" className="filterReset" onClick={() => setDraft(DEFAULT_FILTERS)}>초기화</button>
          <button type="button" className="filterApply" onClick={() => dismiss(() => onApply(draft))}>{total}개 보기</button>
        </footer>
      </div>
    </div>
  )
}

export default FilterSheet
