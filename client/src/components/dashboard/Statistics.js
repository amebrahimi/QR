import React, {Component} from 'react';
import {Col, Container, Row} from "reactstrap";
import {connect} from "react-redux";
import {getQrListForTable, getUserListForTable} from "../../actions/queryActions";
import Spinner from "../common/Spinner";
import ReactTable from "react-table";

class Statistics extends Component {

    componentDidMount() {
        this.props.getQrListForTable();
        this.props.getUserListForTable();
    }

    render() {

        const {qr_is_loading, qrList, userList} = this.props.table;


        let qrContent;
        let userContent;

        if (qr_is_loading && qrList) {
            qrContent = <Spinner/>
        } else {

            const columns = [

                    {
                        Header: 'Generated Qr List',
                        columns: [
                            {
                                Header: 'Type',
                                accessor: 'type'
                            }, {
                                Header: 'Has been scanned',
                                accessor: 'is_generated',
                                Cell: props => <span>{props.value ? 'Yes' : 'No'}</span>
                            }, {
                                id: 'is_used',
                                Header: 'Is Used',
                                Cell: props => <span>{props.value ? 'Yes' : 'No'}</span>
                            }
                        ]
                    }
                ]
            ;


            qrContent = (
                <Col lg='6' md='12' sm='12'>
                    <ReactTable className="-striped"
                                data={qrList}
                                columns={columns}
                                showPagination={false}
                    />
                </Col>
            )
        }

        if (qr_is_loading && userList) {
            userContent = <Spinner/>
        } else {

            const columns = [
                {

                    Header: 'Subscribed user list',
                    columns: [

                        {
                            Header: 'Name',
                            accessor: 'name'
                        },
                        {
                            Header: 'Phone',
                            accessor: 'phone'
                        }, {
                            Header: 'Email',
                            accessor: 'email',
                        }

                    ]
                }
            ];

            const subColumns = [
                {
                    Header: 'Type',
                    accessor: 'type'
                },

                {
                    Header: 'Is Used',
                    accessor: 'is_used',
                    Cell: props => <span>{props.value ? 'Yes' : 'No'}</span>
                }
            ];

            userContent = (
                <Col lg='6' md='12' sm='12'>
                    <ReactTable
                        className="-striped"
                        data={userList}
                        columns={columns}
                        showPagination={false}
                        SubComponent={row => {
                            return (
                                <ReactTable
                                    data={userList[row.index].offCodes}
                                    showPagination={false}
                                    columns={subColumns}
                                />
                            )
                        }}
                    />
                </Col>
            )
        }


        return (
            <Container>
                <Row>
                    {qrContent}
                    {userContent}
                </Row>
            </Container>
        );
    }
}

const mapStateToProps = state => ({
    errors: state.errors,
    table: state.table
});

export default connect(mapStateToProps, {getQrListForTable, getUserListForTable})(Statistics);