
import { Result, WhiteSpace } from 'antd-mobile';

const ServiceUnavailable = () => {
    return (
        <div>
            <WhiteSpace />            
            <Result
                imgUrl='https://gw.alipayobjects.com/as/g/antui/antui-static/1.0.1/i/error-busy-sm.png'
                title=" "
                message="系统升级中, 请您稍后再来."
            />
        </div>        
    );
}

export default ServiceUnavailable;
