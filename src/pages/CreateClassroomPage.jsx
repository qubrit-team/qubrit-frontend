// 학급 만들기 화면 (학교/학년/반/이름/과목/참여 방식/멤버 업로드 설정)
import { useEffect, useState } from 'react'
import BackButton from '../components/BackButton'
import FormSection from '../components/FormSection'
import SchoolField from '../components/SchoolField'
import SelectField from '../components/SelectField'
import RadioOption from '../components/RadioOption'
import ToggleSwitch from '../components/ToggleSwitch'
import Chip from '../components/Chip'
import SubjectAdder from '../components/SubjectAdder'
import Button from '../components/Button'
import { createClassroom, fetchClassroomSubjects, addClassroomSubject } from '../api/classrooms'
import { searchSchools } from '../api/schools'
import { describeError } from '../api/http'
import '../styles/CreateClassroomPage.css'

const GRADES = [1, 2, 3].map((n) => ({ value: String(n), label: `${n}학년` }))
const CLASSES = Array.from({ length: 12 }, (_, i) => ({ value: String(i + 1), label: `${i + 1}반` }))
const SEARCH_DELAY = 250

function CreateClassroomPage({ onNavigate }) {
  const [school, setSchool] = useState('')
  const [schoolPicked, setSchoolPicked] = useState(false)
  const [schoolResults, setSchoolResults] = useState([])
  const [grade, setGrade] = useState('1')
  const [classNo, setClassNo] = useState('1')
  const [name, setName] = useState('')
  const [subjectOptions, setSubjectOptions] = useState([])
  const [subjects, setSubjects] = useState([])
  const [joinMode, setJoinMode] = useState('APPROVAL')
  const [memberUpload, setMemberUpload] = useState(true)
  const [busy, setBusy] = useState(false)
  const [error, setError] = useState('')

  // 과목은 DB 에 저장된 목록을 불러온다
  useEffect(() => {
    let ignore = false
    fetchClassroomSubjects()
      .then((list) => { if (!ignore) setSubjectOptions(list) })
      .catch((err) => { if (!ignore) setError(describeError(err)) })
    return () => { ignore = true }
  }, [])

  // 학교는 입력할 때마다(짧게 지연) 검색해서 미리보기 목록으로 보여준다
  useEffect(() => {
    const query = school.trim()
    if (schoolPicked || !query) return undefined
    let ignore = false
    const timer = setTimeout(() => {
      searchSchools(query)
        .then((list) => { if (!ignore) setSchoolResults(list) })
        .catch(() => { if (!ignore) setSchoolResults([]) })
    }, SEARCH_DELAY)
    return () => { ignore = true; clearTimeout(timer) }
  }, [school, schoolPicked])

  const changeSchool = (value) => {
    setSchool(value)
    setSchoolPicked(false)
  }

  const pickSchool = (picked) => {
    setSchool(picked.name)
    setSchoolPicked(true)
  }

  const addSubject = async (name) => {
    try {
      const added = await addClassroomSubject(name)
      setSubjectOptions((cur) => (cur.includes(added) ? cur : [...cur, added]))
      setSubjects((cur) => (cur.includes(added) ? cur : [...cur, added]))
    } catch (err) {
      setError(describeError(err))
    }
  }

  const toggleSubject = (s) =>
    setSubjects((cur) => (cur.includes(s) ? cur.filter((v) => v !== s) : [...cur, s]))

  const canSubmit = name.trim() && subjects.length > 0 && !busy

  const submit = async (e) => {
    e.preventDefault()
    if (!canSubmit) return
    setBusy(true)
    setError('')
    try {
      await createClassroom({
        name: name.trim(),
        school: school.trim() || undefined,
        grade: Number(grade),
        classNo: Number(classNo),
        subjects,
        joinMode,
        memberUploadAllowed: memberUpload,
      })
      onNavigate('classroom')
    } catch (err) {
      setError(describeError(err))
      setBusy(false)
    }
  }

  return (
    <form className="createClassroomPage" onSubmit={submit}>
      <div className="createClassroomBody">
        <BackButton src="/assets/createClassroom/close.svg" onClick={() => onNavigate('classroom')} />
        <h1 className="createClassroomTitle">우리 학교 친구들과<br />학급 방을 만들어요</h1>

        <FormSection label="학교" desc="학교를 고르면 그 학교의 기출 문제를 받을 수 있어요">
          <SchoolField
            value={school}
            onChange={changeSchool}
            confirmed={schoolPicked}
            suggestions={school.trim() ? schoolResults : []}
            onSelect={pickSchool}
            placeholder="학교 이름"
          />
        </FormSection>

        <div className="createClassroomRow">
          <SelectField label="학년" value={grade} onChange={setGrade} options={GRADES} />
          <SelectField label="반" value={classNo} onChange={setClassNo} options={CLASSES} />
        </div>

        <FormSection label="학급 이름">
          <input
            className="createClassroomInput"
            value={name}
            maxLength={50}
            placeholder="예) 미림마고 2-2"
            onChange={(e) => setName(e.target.value)}
          />
        </FormSection>

        <FormSection as="fieldset" label="과목" hint="복수 선택">
          <div className="createClassroomChips">
            {subjectOptions.map((s) => (
              <Chip key={s} selected={subjects.includes(s)} onClick={() => toggleSubject(s)}>{s}</Chip>
            ))}
            <SubjectAdder onAdd={addSubject} disabled={busy} />
          </div>
        </FormSection>

        <FormSection as="fieldset" label="참여 방식" className="createClassroomJoin">
          <RadioOption
            name="joinMode"
            checked={joinMode === 'APPROVAL'}
            onChange={() => setJoinMode('APPROVAL')}
            title="방장이 승인한 사람만"
            desc="초대 코드로 신청하면 방장이 수락해요"
          />
          <RadioOption
            name="joinMode"
            checked={joinMode === 'CODE'}
            onChange={() => setJoinMode('CODE')}
            title="초대 코드만 있으면 바로"
            desc="코드를 아는 사람은 누구나 들어와요"
          />
        </FormSection>

        <ToggleSwitch
          checked={memberUpload}
          onChange={setMemberUpload}
          title="멤버도 기출 올리기"
          desc="끄면 방장만 기출을 올릴 수 있어요"
        />

        {error && <p className="createClassroomError" role="alert">{error}</p>}
      </div>

      <div className="createClassroomFooter">
        <Button type="submit" disabled={!canSubmit}>학급 만들기</Button>
      </div>
    </form>
  )
}

export default CreateClassroomPage
