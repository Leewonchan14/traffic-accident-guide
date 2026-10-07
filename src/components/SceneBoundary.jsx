import { Component } from 'react'

/* Keeps the page usable when WebGL is unavailable in the browser. */
export default class SceneBoundary extends Component {
  state = { failed: false }
  static getDerivedStateFromError() {
    return { failed: true }
  }
  render() {
    if (this.state.failed) {
      return (
        <div className="flex h-full items-center justify-center p-8 text-center text-[14.5px] text-[#aeb7c2]">
          이 브라우저에서는 3D 장면을 표시할 수 없습니다. 조치 순서와 텍스트 안내를 참고하세요.
        </div>
      )
    }
    return this.props.children
  }
}
