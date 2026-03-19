// API 호출 추적을 위한 유틸리티
class ApiCallTracker {
  private calls: Record<string, number> = {};

  track(endpoint: string) {
    if (!this.calls[endpoint]) {
      this.calls[endpoint] = 0;
    }
    this.calls[endpoint]++;
    console.log(`📊 API 호출 추적: ${endpoint} = ${this.calls[endpoint]}회`);
    this.printSummary();
  }

  reset() {
    this.calls = {};
    console.log('🔄 API 호출 카운터 리셋');
  }

  printSummary() {
    const total = Object.values(this.calls).reduce((sum, count) => sum + count, 0);
    console.log(`📈 현재 총 API 호출: ${total}회`, this.calls);
  }

  getCalls() {
    return { ...this.calls };
  }
}

export const apiTracker = new ApiCallTracker();

// 전역에서 사용 가능하도록
(window as any).apiTracker = apiTracker;