import * as React from 'react';
import { styled } from '@mui/material/styles';
import Card from '@mui/material/Card';
import CardHeader from '@mui/material/CardHeader';
import CardMedia from '@mui/material/CardMedia';
import CardContent from '@mui/material/CardContent';
import Avatar from '@mui/material/Avatar';
import IconButton, { IconButtonProps } from '@mui/material/IconButton';
import Typography from '@mui/material/Typography';
import { red } from '@mui/material/colors';
import './styles.scss';

import { getPathCourseResource } from '../../utils/electronFunctions';

export default function({ cardData, onCardClick }) {
  const [expanded, setExpanded] = React.useState(false);
  const [image, setImage] = React.useState("");

  const handleExpandClick = () => {
    setExpanded(!expanded);
  };

  const imageUrl = async() => {
    let path = cardData.cod_curso;
    path += "/img.asar/" + cardData.imagen;
    const finalPath = await getPathCourseResource(path);
    setImage(finalPath)
  }

  React.useEffect(()=>{
    imageUrl();
  }, [])

  return (
    <>
    {
      image != "" ? (
        <Card sx={{ maxWidth: 250 }} onClick={onCardClick} className="card-course">
          <CardMedia
            component="img"
            height="194"
            image={image}
            alt={cardData.nombre}
          />
          <CardContent className='list-card-content'>
          <Typography variant="body2" color="text.secondary">
            {cardData.nombre}
          </Typography>
          </CardContent>
        </Card>
      ):(
        null
      )
    }
    </>
  );
}