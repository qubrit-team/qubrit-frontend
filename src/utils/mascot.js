// 목록 썸네일용 마스코트 (과목별로 고정, 모르는 과목은 id로 돌려쓰기)
const BY_SUBJECT = { 국어: 1, 과학: 2, 영어: 3, 사회: 4, 수학: 5, 한국사: 4 }

export function mascotFor(subject, id) {
  const n = BY_SUBJECT[subject] ?? (Number(id) % 5) + 1
  return `/assets/mascots/mascot${n}.png`
}
