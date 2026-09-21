# 공통 기반 보안 경계

- 공개 UI fixture와 실제 Participant 데이터는 경로·모듈·환경변수로 분리한다.
- Supabase publishable key만 브라우저에 노출한다. Proof 서버만 `SUPABASE_SECRET_KEY`를 사용한다. `server-only` 모듈에서 사용자 쿠키 없는 별도 클라이언트를 만들고, 확인된 사용자 ID만 서비스 전용 DB 함수에 전달한다. secret은 `NEXT_PUBLIC_` 환경변수에 넣지 않는다.
- 서버 보호 경로는 세션 존재만 보지 말고 Supabase가 검증한 사용자와 소유권을 확인한다.
- OAuth callback은 `APP_ORIGIN`의 `/home` 또는 고정 로그인 오류 경로로만 이동한다. 요청 query의 `next`와 forwarded host를 사용하지 않는다.
- Proof는 JPEG 최대4MiB/20MP를 실제 디코딩하고 최대1600px로 재인코딩·EXIF 제거한 뒤 `camera-proofs` Private Storage에 저장한다. 원본 업로드 바이트는 영구 보존하지 않는다. 공개 URL은 생성하지 않으며 browser role에는 restrictive Storage policy로 접근을 막는다. 마감30일 후 사진 삭제와 실패 객체 정리는 [운영 절차](MISSION_PROOF_IMPLEMENTATION.md)를 따른다. 스케줄은 아직 배포되지 않았다.
- 클라이언트는 점수·미션 상태·참가 상태를 판정하지 않는다. 서버와 DB RLS가 권위 있는 판정을 제공한다.
- Proof 제출은 idempotency와 DB unique 제약을 함께 사용해야 한다. “조회 후 없으면 저장” 패턴만으로 구현하지 않는다.
- 실패 상태에서는 승인·점수 생성·공개 파일 노출을 하지 않는다. Storage와 DB 사이 부분 실패는 정리·재처리 상태를 남긴다.
