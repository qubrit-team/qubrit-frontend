import { useState } from 'react'
import '../styles/components/SubjectAdder.css'

// 과목 칩 줄 끝의 "+ 추가" 버튼. 누르면 입력칸으로 바뀌고 Enter/확인으로 onAdd(name) 호출.
function SubjectAdder({ onAdd, disabled }) {
  const [open, setOpen] = useState(false)
  const [name, setName] = useState('')

  const close = () => { setOpen(false); setName('') }
  const submit = async () => {
    const value = name.trim()
    if (!value) return close()
    await onAdd(value)
    close()
  }

  if (!open) {
    return (
      <button type="button" className="subjectAdderBtn" disabled={disabled} onClick={() => setOpen(true)}>
        + 추가
      </button>
    )
  }
  return (
    <span className="subjectAdderForm">
      <input
        className="subjectAdderInput"
        value={name}
        maxLength={30}
        autoFocus
        placeholder="과목 이름"
        onChange={(e) => setName(e.target.value)}
        onKeyDown={(e) => {
          if (e.key === 'Enter') { e.preventDefault(); submit() }
          if (e.key === 'Escape') close()
        }}
      />
      <button type="button" className="subjectAdderOk" onClick={submit}>확인</button>
    </span>
  )
}

export default SubjectAdder
