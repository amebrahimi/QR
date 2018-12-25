import React, {Component} from 'react';
import {connect} from "react-redux";
import * as qs from 'query-string';
import {generateOffCode} from "../../actions/qrActions";
import PropTypes from 'prop-types';
import {Alert} from "react-bootstrap";
import {Input} from "reactstrap";
import classnames from 'classnames';
import Spinner from "../common/Spinner";
import isEmpty from "../../validation/is-empty";
import {submitQrUser} from "../../actions/userQrActions";

class Scan extends Component {

    state = {
        name: '',
        phone: '',
        email: '',
        loading: false,
        isButtonClicked: false,
        errors: {}
    };

    componentDidMount() {
        const {code} = qs.parse(this.props.location.search);
        this.props.generateOffCode(code);
    };

    static getDerivedStateFromProps(nextProps, prevState) {
        if (nextProps.errors !== prevState.errors) {
            return ({errors: nextProps.errors, isButtonClicked: false});
        }
    }


    onChange = e => {
        this.setState({[e.target.name]: e.target.value})
    };

    onSubmit = e => {
        e.preventDefault();

        const {name, phone, email} = this.state;

        if (isEmpty(phone) && isEmpty(email)) {

            const errors = {
                errors: {
                    validation: 'At least one of the fields email/phone must be filled'
                }
            };

            this.setState(errors);

        } else {

            this.setState({errors: {}});

            this.setState({isButtonClicked: true});

            const {id, code} = this.props.qrs.qr_data;

            const phoneToSend = phone.toLowerCase();
            const emailToSend = email.toLowerCase();

            const data = {
                name,
                phone: phoneToSend,
                email: emailToSend,
                qr_id: id,
                scanned_code: code
            };

            this.props.submitQrUser(data, this.props.history);

        }

    };

    render() {
        let content;
        const {expire, max_use} = this.props.errors;
        const {code} = this.props.qrs.qr_data;
        const {loading} = this.props.qrs;

        if (loading) {

            content = <Spinner/>

        } else {

            if (expire || max_use) {
                content = (
                    <div>
                        {max_use && (
                            <Alert bsStyle="danger"><strong>{max_use}</strong></Alert>)}
                        {expire && (
                            <Alert bsStyle="danger"><strong>{expire}</strong></Alert>)}
                    </div>
                )
            } else {
                content = (

                    <div className="container">
                        <div className="col-md-8 m-auto">

                            <h2 className="display-4 text-center">Here is your Generated Code: </h2>

                            <div className="form-group">
                                <p className="lead text-center display-4 text-warning font-weight-bold">Code: <span
                                    className="text-info font-weight-bold display-4">{code}</span></p>
                            </div>

                            <div className="mt-5 mb-5"/>
                            <hr/>

                            <h1 className="display-4 text-center">Info</h1>
                            <p className="lead text-center">Please Enter your information for getting awesome
                                rewards</p>
                            <form onSubmit={this.onSubmit}>
                                <div className="form-group">
                                    <Input
                                        type="text"
                                        className={classnames('form-control form-control-lg mb-2', {
                                            'is-invalid': this.state.errors.amount
                                        })}
                                        name="name"
                                        placeholder="Please Enter your name"
                                        value={this.state.name}
                                        onChange={this.onChange}
                                    />
                                </div>

                                <div className="form-group">
                                    <Input
                                        type="email"
                                        className={classnames('form-control form-control-lg mb-2', {
                                            'is-invalid': this.state.errors.validation
                                        })}
                                        name="email"
                                        placeholder="please enter your email"
                                        value={this.state.email}
                                        onChange={this.onChange}
                                    />
                                    {this.state.errors.validation && (
                                        <div className="invalid-feedback">{this.state.errors.validation}</div>)}
                                </div>

                                <div className="form-group">
                                    <Input
                                        type="number"
                                        className={classnames('form-control form-control-lg mb-2', {
                                            'is-invalid': this.state.errors.validation || this.state.errors.phone
                                        })}
                                        name="phone"
                                        placeholder="Please Enter your phone number"
                                        value={this.state.phone}
                                        onChange={this.onChange}
                                    />
                                    {this.state.errors.validation && (
                                        <div className="invalid-feedback">{this.state.errors.validation}</div>)}
                                    {this.state.errors.phone && (
                                        <div className="invalid-feedback">{this.state.errors.phone}</div>)}
                                </div>

                                <div className="form-group">
                                    <Input type="submit" value="Send" disabled={this.state.isButtonClicked}
                                           className="btn btn-info btn-block"/>
                                </div>
                            </form>
                        </div>

                    </div>
                )
            }

        }


        return (
            <div>
                {content}
            </div>
        );
    }
}

Scan.propTypes = {
    generateOffCode: PropTypes.func.isRequired,
    submitQrUser: PropTypes.func.isRequired
};


const mapStateToProps = state => ({
    qrs: state.qrs,
    errors: state.errors
});

export default connect(mapStateToProps, {generateOffCode, submitQrUser})(Scan);