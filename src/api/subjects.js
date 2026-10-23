import { request } from "./http";

// ["국어", "영어", ...]
// TODO: 백엔드 엔드포인트가 확정되면 경로/응답 형태 맞추기
export const fetchSubjects = () => request("/api/subjects");
