/**
 * Amendements Central Panel
 * ==========================
 *
 */
import React, {Component} from 'react';
import Row from 'react-bootstrap/lib/Row';
import Col from 'react-bootstrap/lib/Col';
import Regex from './regex.jsx';

export default class Panel extends Component {
  render() {
    return (
      <div className="container-fluid">
        <Row>
          <Col className="regex" md={8}>
            <Regex />
          </Col>
          <Col className="stats" md={4}>
            STATS
          </Col>
        </Row>
        <Row>
          <Col className="playground" md={8}>
            PLAYGROUND
          </Col>
          <Col className="matches" md={4}>
            MATCHES
          </Col>
        </Row>
      </div>
    );
  }
}
