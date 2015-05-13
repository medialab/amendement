/**
 * Amendements Central Panel
 * ==========================
 *
 */
import React, {Component} from 'react';
import Row from 'react-bootstrap/lib/Row';
import Col from 'react-bootstrap/lib/Col';
import Regex from './regex.jsx';
import Stats from './stats.jsx';

export default class Panel extends Component {
  render() {
    return (
      <div className="container-fluid">
        <Row>
          <Col className="regex title" md={8}>
            <Regex />
          </Col>
          <Col className="stats title" md={4}>
            <Stats />
          </Col>
        </Row>
        <Row>
            <Col className="playground title" md={8}>
              PLAYGROUND
            </Col>
          <Col className="matches title" md={4}>
            MATCHES
          </Col>
        </Row>
      </div>
    );
  }
}
