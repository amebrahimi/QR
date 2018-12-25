import React, {Component} from 'react';
import {connect} from "react-redux";

class Success extends Component {

    render() {
        const {successful} = this.props.userQr;
        let content;

        if (successful) {
            content = <h1 className="display-4 text-center text-success font-weight-bold">Thank you for subscribing</h1>
        } else {
            content =
                <h1 className="display-4 text-danger text-center font-weight-bold">Oops... Something wen wrong</h1>
        }

        return (
            <div>
                {content}
            </div>
        );
    }
}

const mapStateToProps = state => ({
    userQr: state.userQr
});

export default connect(mapStateToProps)(Success);