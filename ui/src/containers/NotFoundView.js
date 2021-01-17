import React from 'react';
import {Link} from 'react-router-dom';

export default () => {
  return (
    <div>
      <p style={{textAlign: "center"}}>
        <span>Page does not exist. </span>
        <Link to="/">Go to Home</Link>
      </p>
    </div>
  )
}
