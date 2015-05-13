/**
 * Amendements Application Component
 * ==================================
 *
 */
import React, {Component} from 'react';
import Row from 'react-bootstrap/lib/Row';
import Col from 'react-bootstrap/lib/Col';
import Panel from './panel.jsx';
import RulesList from './rules.jsx';
import AmendementsList from './amendements.jsx';

export default class Application extends Component {
  render() {
    return (
      <div className="container-fluid">
        <Row>
          <Col md={2}>
            <RulesList />
          </Col>
          <Col md={7}>
            <Panel />
          </Col>
          <Col md={3}>
            <AmendementsList />
          </Col>
        </Row>
      </div>
    );
  }
}
