# Qubrit Frontend

큐브릿(Qubrit) - 참여형 학습 플랫폼 프론트엔드

## 기술 스택
- React
- Vite
- JavaScript

## 시작하기
\`\`\`bash
git clone https://github.com/qubrit-team/qubrit-frontend.git
cd qubrit-frontend
\`\`\`

\`\`\`bash
npm install
\`\`\`

\`\`\`bash
npm run dev
\`\`\`

브라우저에서 \`http://localhost:5173\`으로 접속하면 됩니다.

백엔드 주소를 바꿔야 하면 \`.env.example\`을 \`.env\`로 복사해서 \`VITE_API_URL\`을 수정하세요. (기본값: \`http://localhost:8080\`)

## 백엔드 연동
백엔드 서버(\`qubrit-backend\`)가 \`http://localhost:8080\`에서 함께 실행 중이어야 API 연동이 정상 동작합니다.
백엔드 저장소: https://github.com/qubrit-team/qubrit-backend

## 팀원
| 학번 | 이름 | 역할 |
|---|---|---|
| 2203 | 김하진 | 기획, 백엔드, DB
