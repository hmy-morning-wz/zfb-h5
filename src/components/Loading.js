import React from 'react';
import { WingBlank } from 'antd-mobile';
import styles from './styles.less';
import config from '../utils/config';

class Loading extends React.Component {

  constructor(props) {
    super(props);

    const loading = this.props.loading;
    this.state = {
      loading,
    };
  }

  componentWillReceiveProps(nextProps) {
    !nextProps.loading && global.ap && global.ap.hideLoading();
    global.ebusLoaing = false;
  }

  componentDidMount() {
    const goading = global.ebusLoaing;
    this.state.loading && !goading && global.ap && global.ap.showLoading();
    global.ebusLoaing = true;
  }

  render() {
    const loading = this.props.loading;

    const build = () => {
      return (
        <div>
          <WingBlank size="lg">
            <div title="LOADING" className={styles.loading}>
              <div className={styles.circle_loading_wrap} style={{ backgroundImage: `url(${config.cdnHost}/image/loading_bg.png)` }}>
                <img id="moving" className={styles.bus} src={`${config.cdnHost}/image/bus.png`} alt="IMG" />
              </div>
            </div>
          </WingBlank>
        </div>
      );
    };

    return (
      <div className={styles.container}>
        {loading ? null : this.props.children}
      </div>
    );
  }
}

export default Loading;
