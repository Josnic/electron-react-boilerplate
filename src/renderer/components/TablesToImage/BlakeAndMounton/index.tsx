import React, { useEffect, useState, forwardRef, useImperativeHandle } from 'react';
import * as download from 'downloadjs/download';
import * as htmlToImage from 'html-to-image';
import './styles.scss';

const BlakeAndMounton = forwardRef(({ positions }, ref) => { 

  const [image, setImage] = useState(null)

  useEffect(() => {
    htmlToImage
      .toPng(document.getElementById('blake-mounton-level-table-container'))
      .then(function (dataUrl) {
        setImage(dataUrl)
        //download(dataUrl, 'my-node.png');
      });
  }, []);

  const getBase64Image = async () => {
    return image;
  };

  useImperativeHandle(ref, () => ({
    getBase64Image: getBase64Image,
  }));

  useEffect(() => {
    
    if (Array.isArray(positions)) {
      const elements = document.getElementsByClassName('span-1-x');
      if (elements.length > 0){
        for (let i = 0; i < elements.length; i++){
            elements[i].innerHTML = ""
            elements[i].classList.remove('span-1-x');
        }
      
      }
      

      const elements2 = document.getElementsByClassName('span-1-y');
     

      if (elements2.length > 0){
        for (let i = 0; i < elements2.length; i++){
            elements2[i].innerHTML = ""
            elements2[i].classList.remove('span-1-y');
        }
      }

      const elements3 = document.getElementsByClassName('span-1-xy');

      if (elements3.length > 0){
        for (let i = 0; i < elements3.length; i++){
            elements3[i].innerHTML = ""
            elements3[i].classList.remove('span-1-xy');
        }

      }
     

      for (let i = 0; i < positions.length; i++) {
        let span = null;
        if (positions[i].x == 1 || positions[i].y == 1) {
          const x = positions[i].x == 1 ? 2 : positions[i].x;
          const y = positions[i].y == 1 ? 2 : positions[i].y;
          span = document.getElementById(`bam-span-${x}-${y}`);
          console.log(span)
          span.innerHTML = '<div class="dot"></div>';
          let finalSpanClass = '';

          if (positions[i].y == 1 == 1 && positions[i].x == 1) {
            finalSpanClass = 'span-1-xy';
          }

          if (positions[i].y == 1 && positions[i].x != 1) {
            finalSpanClass = 'span-1-x';
          }

          if (positions[i].y != 1 && positions[i].x == 1) {
            finalSpanClass = 'span-1-y';
          }

          console.log(finalSpanClass)
          

          span.classList.add(finalSpanClass);
        } else {
          span = document.getElementById(
            `bam-span-${positions[i].x}-${positions[i].y}`
          );
          span.innerHTML = '<div class="dot"></div>';
        }
      }
    }
  }, [positions]);

  const tdGenerator = (staticValue) => {
    const td = [];
    for (let i = 2; i <= 9; i++) {
      td.push(
        <td id={`bam-td-${i}-${staticValue}`}>
          <span id={`bam-span-${i}-${staticValue}`}></span>
        </td>
      );
    }
    return td;
  };

  return (
    <div
      className="blake-mounton-level-table-container"
      id="blake-mounton-level-table-container"
    >
      <table
        id="blake-mounton-level-table"
        className="blake-mounton-level-table"
      >
        <tr>
          <td className="td-no-border level-red">Alto</td>
          <td  className='border-width'>9</td>
          <td rowSpan="4" colSpan="4" className="text-level">
            Acomodadizo
          </td>
          <td rowSpan="4" colSpan="4" className="text-level">
            Equipo
          </td>
        </tr>
        <tr>
          <td rowSpan="7" className="td-no-border person">
            Personas
          </td>
          <td  className='border-width'>8</td>
        </tr>
        <tr>
          <td  className='border-width'>7</td>
        </tr>
        <tr>
          <td  className='border-width'>6</td>
        </tr>
        <tr>
          <td className='border-width'>5</td>
          <td rowSpan="4" colSpan="4" className="text-level">
            Indiferente
          </td>
          <td rowSpan="4" colSpan="4" className="text-level">
            Autoritario
          </td>
        </tr>
        <tr>
          <td className='border-width'>4</td>
        </tr>
        <tr>
          <td className='border-width'>3</td>
        </tr>
        <tr>
          <td className='border-width'>2</td>
        </tr>
        <tr>
          <td className="td-no-border level-red">Bajo</td>
          <td className='border-width'>1</td>
          <td className='border-width'>2</td>
          <td className='border-width'>3</td>
          <td className='border-width'>4</td>
          <td className='border-width'>5</td>
          <td className='border-width'>6</td>
          <td className='border-width'>7</td>
          <td className='border-width'>8</td>
          <td className='border-width'>9</td>
        </tr>
        <tr className="no-border">
          <td></td>
          <td className="level-red">Bajo</td>
          <td colSpan="7" className="level-blue">
            Tareas
          </td>
          <td className="level-red">Alto</td>
        </tr>
      </table>

      <table
        id="blake-mounton-level-table-over"
        className="blake-mounton-level-table table-over"
      >
        <tr>
          <td className="td-no-border level-red">Alto</td>
          <td>9</td>
          {tdGenerator(9)}
        </tr>
        <tr>
          <td rowSpan="7" className="td-no-border person">
            Personas
          </td>
          <td>8</td>
          {tdGenerator(8)}
        </tr>
        <tr>
          <td>7</td>
          {tdGenerator(7)}
        </tr>
        <tr>
          <td>6</td>
          {tdGenerator(6)}
        </tr>
        <tr>
          <td>5</td>
          {tdGenerator(5)}
        </tr>
        <tr>
          <td>4</td>
          {tdGenerator(4)}
        </tr>
        <tr>
          <td>3</td>
          {tdGenerator(3)}
        </tr>
        <tr>
          <td>2</td>
          {tdGenerator(2)}
        </tr>
        <tr>
          <td className="td-no-border level-red">Bajo</td>
          <td className='border-width'>1</td>
          <td className='border-width'>2</td>
          <td className='border-width'>3</td>
          <td className='border-width'>4</td>
          <td className='border-width'>5</td>
          <td className='border-width'>6</td>
          <td className='border-width'>7</td>
          <td className='border-width'>8</td>
          <td className='border-width'>9</td>
        </tr>
        <tr className="no-border">
          <td></td>
          <td className="level-red">Bajo</td>
          <td colSpan="7" className="level-blue">
            Tareas
          </td>
          <td className="level-red">Alto</td>
        </tr>
      </table>
    </div>
  );
});

export default BlakeAndMounton;
