import React, {Component} from 'react';
import PropTypes from 'prop-types';
import {connect} from "react-redux";
import {getQrTypes} from "../../actions/qrActions";
import Spinner from "../common/Spinner";
import QrTypeAheadSearch from "./QrGenerate";
import {Alert} from "react-bootstrap";

class Dashboard extends Component {

    state = {
        showAlert: false,
    };

    componentDidMount() {
        this.props.getQrTypes();

    }

    componentWillReceiveProps(nextProps) {
        if (nextProps.qrs.success) {
            this.setState({showAlert: true})
        }
    }

    handleDismiss = () => {
        this.setState({showAlert: false})
    };

    render() {
        const {types, loading} = this.props.qrs;
        let qrContent;

        if (types === null || loading) {
            qrContent = <Spinner/>
        } else {
            qrContent = <QrTypeAheadSearch types={types}/>
        }

        return (
            <div>
                {this.state.showAlert && (
                    <Alert bsStyle="success" onDismiss={this.handleDismiss}><strong>QR(s) Successfully
                        generated</strong></Alert>)}
                <div className="mt-5">
                    {qrContent}
                </div>
            </div>
        );
    }
}

Dashboard.propTypes = {
    getQrTypes: PropTypes.func.isRequired,
    qrs: PropTypes.object.isRequired
};


const mapStateToProps = state => ({
    errors: state.errors,
    qrs: state.qrs
});

export default connect(mapStateToProps, {getQrTypes})(Dashboard);
