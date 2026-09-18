# 공통 기반 보안 경계

- 공개 UI fixture와 실제 Participant 데이터는 경로·모듈·환경변수로 분리한다.
- Supabase에는 publishable key만 브라우저에 노출한다. service role/secret key는 서버 환경에도 아직 사용하지 않는다.
- 서버 보호 경로는 세션 존재만 보지 말고 Supabase가 검증한 사용자와 소유권을 확인한다.
- OAuth callback은 `APP_ORIGIN`의 `/home` 또는 고정 로그인 오류 경로로만 이동한다. 요청 query의 `next`와 forwarded host를 사용하지 않는다.
- Proof 원본은 Private Storage에 두며 공개 URL·로그·분석 이벤트에 원본이나 개인정보를 넣지 않는다. 보존·삭제는 후속 migration과 운영 절차로 확정한다.
- 클라이언트는 점수·미션 상태·참가 상태를 판정하지 않는다. 서버와 DB RLS가 권위 있는 판정을 제공한다.
- Proof 제출은 idempotency와 DB unique 제약을 함께 사용해야 한다. “조회 후 없으면 저장” 패턴만으로 구현하지 않는다.
- 실패 상태에서는 승인·점수 생성·공개 파일 노출을 하지 않는다. Storage와 DB 사이 부분 실패는 정리·재처리 상태를 남긴다.
