import React from 'react';
import PropTypes from 'prop-types'
import { Link } from 'react-router-dom';
import { connect } from 'react-redux';

class Thumbnail extends React.Component {
  static propTypes = {
    label: PropTypes.string,
    linkTarget: PropTypes.string,
    className: PropTypes.string
  };

  static defaultProps = {
    label: '',
    linkTarget: '',
    className: ''
  };

  render () {
    const {
      label,
      linkTarget,
      className
    } = this.props;

    return (
      <Link className={`sps-thumbnail ${className}`} to={linkTarget}>
        <div className='contents'>{this.props.children}</div>
        <div className='label'>{label}</div>
      </Link>
    );
  }
}

export default Thumbnail;
