import React, {Component} from 'react';
import {Typeahead} from 'react-bootstrap-typeahead';
import PropTypes from 'prop-types';
import {Input} from "reactstrap";
import classnames from 'classnames';
import isEmpty from "../../validation/is-empty";
import {connect} from "react-redux";
import {generateQr} from "../../actions/qrActions";

class QrGenerate extends Component {

    state = {
        text: '',
        amount: '',
        errors: {}
    };

    onChange = e => {
        this.setState({[e.target.name]: e.target.value})
    };

    componentWillReceiveProps(newProps) {
        if (newProps.errors) {
            this.setState({errors: newProps.errors})
        }
    }

    onSubmit = e => {
        e.preventDefault();

        if (!isEmpty(this.state.text) && !isEmpty(this.state.amount)) {
            const errors = {
                errors: {}
            };

            this.setState(errors);

            const data = {
                text: this.state.text.toLowerCase(),
                amount: this.state.amount,
                expire_date: '1545403586000',
                max_use: '1'
            };

            this.props.generateQr(data)

        } else {

            const selected_type_error = isEmpty(this.state.text) ? 'Selected Type is required' : null;
            const amount_error = isEmpty(this.state.amount) ? 'Amount is Required' : null;

            const errors = {
                errors: {
                    amount: amount_error,
                    text: selected_type_error
                }
            };

            this.setState(errors)
        }
    };

    typeAheadOnchange = e => {
        if (e[0] && e[0].label) {
            this.setState({text: e[0].label});
        } else {
            this.setState({text: e[0]});
        }
    };

    render() {
        const {types} = this.props;
        return (
            <div className="container">
                <div className="col-md-8 m-auto">
                    <h1 className="display-4 text-center">Generator</h1>
                    <p className="lead text-center">Please select type and amount</p>

                    <form onSubmit={this.onSubmit}>
                        <Typeahead
                            allowNew={true}
                            onChange={this.typeAheadOnchange}
                            multiple={false}
                            options={types.map(type => type._id)}
                            placeholder="Enter type..."
                            className='mb-2'
                            isInvalid={!!this.state.errors.text}
                            bsSize='large'
                        />
                        {this.state.errors.text && (
                            <div className="invalid-feedback">{this.state.errors.text}</div>)}

                        <div className="form-group">
                            <Input
                                type="number"
                                className={classnames('form-control form-control-lg mb-2', {
                                    'is-invalid': this.state.errors.amount
                                })}
                                name="amount"
                                placeholder="Enter amount of qrs you want to generate"
                                value={this.state.amount}
                                onChange={this.onChange}
                            />
                            {this.state.errors.amount && (
                                <div className="invalid-feedback">{this.state.errors.amount}</div>)}
                        </div>

                        <Input type="submit" value="Generate" className="btn btn-dark btn-block"/>
                    </form>
                </div>
            </div>
        );
    }
}

QrGenerate.protoTypes = {
    types: PropTypes.array.isRequired,
    errors: PropTypes.object,
};

const mapStateToProps = state => ({
    errors: state.errors,
    qrs: state.qrs
});

export default connect(mapStateToProps, {generateQr})(QrGenerate);