import { Component, type ReactNode } from 'react';
import PostFX from './PostFX';

class PostFXBoundary extends Component<{ lowPower?: boolean }, { failed: boolean }> {
  state = { failed: false };

  static getDerivedStateFromError() {
    return { failed: true };
  }

  componentDidCatch(err: Error) {
    console.warn('[PostFX]', err.message);
  }

  render() {
    if (this.state.failed) return null;
    return <PostFX lowPower={this.props.lowPower} />;
  }
}

export default PostFXBoundary;
