/**
 * API 호출 추적 유틸리티
 *
 * 개발 및 디버깅 목적으로 API 호출 횟수를 추적하고 통계를 제공합니다.
 * 중복 호출이나 불필요한 API 요청을 식별하는 데 유용합니다.
 */

/**
 * API 호출 추적 클래스
 *
 * 각 엔드포인트별로 호출 횟수를 카운트하고,
 * 콘솔을 통해 실시간 통계를 제공합니다.
 */
class ApiCallTracker {
  /** 엔드포인트별 호출 횟수를 저장하는 맵 */
  private calls: Record<string, number> = {};

  /**
   * API 호출을 추적하고 카운트를 증가시킵니다.
   *
   * @param endpoint - 추적할 API 엔드포인트 (예: '/api/projects')
   */
  track(endpoint: string) {
    // 해당 엔드포인트가 처음 호출되면 초기화
    if (!this.calls[endpoint]) {
      this.calls[endpoint] = 0;
    }

    // 호출 횟수 증가
    this.calls[endpoint]++;
    console.log(`📊 API 호출 추적: ${endpoint} = ${this.calls[endpoint]}회`);

    // 전체 통계 출력
    this.printSummary();
  }

  /**
   * 모든 API 호출 통계를 초기화합니다.
   * 테스트나 새로운 추적을 시작할 때 사용합니다.
   */
  reset() {
    this.calls = {};
    console.log('🔄 API 호출 카운터 리셋');
  }

  /**
   * 현재까지의 API 호출 통계 요약을 콘솔에 출력합니다.
   * 전체 호출 횟수와 엔드포인트별 상세 정보를 표시합니다.
   */
  printSummary() {
    const total = Object.values(this.calls).reduce((sum, count) => sum + count, 0);
    console.log(`📈 현재 총 API 호출: ${total}회`, this.calls);
  }

  /**
   * 현재 호출 통계의 복사본을 반환합니다.
   * 외부에서 통계를 조회할 때 사용하며, 원본 데이터는 보호됩니다.
   *
   * @returns 엔드포인트별 호출 횟수 객체의 복사본
   */
  getCalls() {
    return { ...this.calls };
  }
}

/** API 호출 추적기 인스턴스 - 전역에서 공유하여 사용 */
export const apiTracker = new ApiCallTracker();

/** 브라우저 개발자 도구에서 직접 접근할 수 있도록 전역 객체에 등록 */
(window as any).apiTracker = apiTracker;