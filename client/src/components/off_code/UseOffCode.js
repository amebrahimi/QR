import React, {Component} from 'react';
import {connect} from "react-redux";
import {useOffCode} from "../../actions/userQrActions";

class UseOffCode extends Component {


    render() {
        return (
            <div>

            </div>
        );
    }
}

const mapStateToProps = state => ({
    qrs: state.qrs
});

export default connect(mapStateToProps, {useOffCode})(UseOffCode);