import React, { useEffect, useState } from 'react';
import * as download from 'downloadjs/download';
import * as htmlToImage from 'html-to-image';
import './styles.scss';

const LeadershipLevel = ({ number }) => {
  useEffect(() => {
    htmlToImage
      .toPng(document.getElementById('leadership-level-table'))
      .then(function (dataUrl) {
        download(dataUrl, 'my-node.png');
      });
  }, []);

  const circleComponent = (value) => {
    return <span class={`${value == number ? 'circle' : ''}`}>{value}</span>;
  };
  return (
    <table id="leadership-level-table" className="leadership-level-table">
      <tr>
        <td>{circleComponent(1)}</td>
        <td rowSpan="3" className="text-level">
          Potencial de Liderazgo
        </td>
      </tr>
      <tr>
        <td>{circleComponent(2)}</td>
      </tr>
      <tr>
        <td>{circleComponent(3)}</td>
      </tr>
      <tr>
        <td>{circleComponent(4)}</td>
        <td rowSpan="3" className="text-level">
          Líder en acción
        </td>
      </tr>
      <tr>
        <td>{circleComponent(5)}</td>
      </tr>
      <tr>
        <td>{circleComponent(6)}</td>
      </tr>
      <tr>
        <td>{circleComponent(7)}</td>
        <td rowSpan="4" className="text-level">
          Líder transformacional
        </td>
      </tr>
      <tr>
        <td>{circleComponent(8)}</td>
      </tr>
      <tr>
        <td>{circleComponent(9)}</td>
      </tr>
      <tr>
        <td>{circleComponent(10)}</td>
      </tr>
    </table>
  );
};

export default LeadershipLevel;
