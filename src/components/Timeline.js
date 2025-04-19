import React from 'react';
import { Box, Typography } from '@mui/material';
import { styled } from '@mui/material/styles';

const TimelineContainer = styled(Box)(({ theme }) => ({
  position: 'relative',
  padding: theme.spacing(2),
  paddingLeft: '40px',
  paddingTop: '16px',
  paddingBottom: '16px',
  '&::before': {
    content: '""',
    position: 'absolute',
    top: '24px',
    left: '20px',
    width: '2px',
    height: 'calc(100% - 40px)',
    background: 'linear-gradient(180deg, rgba(46, 125, 50, 0.1) 0%, rgba(46, 125, 50, 0.3) 100%)',
    borderRadius: '2px'
  },
  '&::after': {
    content: '""',
    position: 'absolute',
    bottom: '16px',
    left: '17px',
    width: '8px',
    height: '8px',
    borderRadius: '50%',
    backgroundColor: '#2e7d32',
    boxShadow: '0 0 0 3px rgba(46, 125, 50, 0.1)'
  }
}));

const TimelineItem = styled(Box)(({ theme }) => ({
  position: 'relative',
  marginBottom: theme.spacing(3),
  '&:last-child': {
    marginBottom: 0
  }
}));

const TimelineDateContainer = styled(Box)({
  position: 'relative',
  marginBottom: '12px',
  height: '24px',
  display: 'flex',
  alignItems: 'center'
});

const TimelineDate = styled(Typography)(({ theme }) => ({
  color: '#1b5e20',
  fontSize: '0.9rem',
  fontWeight: 500,
  letterSpacing: '0.4px',
  lineHeight: 1,
  textTransform: 'lowercase',
  marginLeft: '24px',
  position: 'relative',
  top: '-1px',
  fontFamily: '"Playfair Display", serif',
  fontStyle: 'italic',
  opacity: 0.85
}));

const TimelineCard = styled(Box)(({ theme }) => ({
  position: 'relative',
  display: 'flex',
  alignItems: 'center',
  gap: theme.spacing(3),
  padding: theme.spacing(1),
  marginBottom: theme.spacing(1),
  marginLeft: '20px',
  transition: 'all 0.3s ease',
  '&:last-child': {
    marginBottom: 0
  }
}));

const TimelineDot = styled(Box)(({ theme }) => ({
  position: 'absolute',
  left: '-20px',
  top: '50%',
  width: '12px',
  height: '12px',
  borderRadius: '50%',
  background: '#fff',
  border: '2px solid #2e7d32',
  transform: 'translate(-50%, -50%)',
  zIndex: 2,
  boxShadow: '0 0 0 4px rgba(46, 125, 50, 0.1)',
  transition: 'all 0.3s ease'
}));

const AnimalImage = styled(Box)(({ theme }) => ({
  width: '80px',
  height: '80px',
  borderRadius: '50%',
  overflow: 'hidden',
  flexShrink: 0,
  backgroundColor: '#f5f5f5',
  border: '3px solid #fff',
  position: 'relative',
  boxShadow: '0 6px 16px rgba(46, 125, 50, 0.12), 0 0 0 3px rgba(46, 125, 50, 0.08)',
  transition: 'all 0.3s ease',
  '&::after': {
    content: '""',
    position: 'absolute',
    inset: 0,
    borderRadius: '50%',
    boxShadow: 'inset 0 2px 4px rgba(0, 0, 0, 0.1)'
  },
  '& img': {
    width: '100%',
    height: '100%',
    objectFit: 'cover',
    transition: 'all 0.3s ease'
  }
}));

const AnimalNameContainer = styled(Box)(({ theme }) => ({
  display: 'flex',
  flexDirection: 'column',
  gap: theme.spacing(0.5)
}));

const AnimalName = styled(Typography)(({ theme }) => ({
  fontWeight: 600,
  fontSize: '1.2rem',
  color: 'rgba(0, 0, 0, 0.87)',
  fontFamily: '"Playfair Display", serif',
  lineHeight: 1.3,
  letterSpacing: '-0.3px'
}));

const LatinName = styled(Typography)(({ theme }) => ({
  fontSize: '0.9rem',
  color: 'rgba(0, 0, 0, 0.5)',
  fontFamily: '"Playfair Display", serif',
  fontStyle: 'italic',
  lineHeight: 1.2,
  letterSpacing: '0.2px'
}));

const TimelineStart = styled(Box)({
  position: 'absolute',
  top: '24px',
  left: '17px',
  width: '8px',
  height: '8px',
  borderRadius: '50%',
  backgroundColor: '#2e7d32',
  boxShadow: '0 0 0 3px rgba(46, 125, 50, 0.1)',
  zIndex: 3
});

const Timeline = ({ spottedAnimals, animalsData }) => {
  const groupedByDate = Object.entries(spottedAnimals)
    .filter(([_, data]) => data.spotted)
    .reduce((acc, [id, data]) => {
      const date = data.date;
      if (!acc[date]) {
        acc[date] = [];
      }
      const animal = animalsData.animals.find(a => a.id === id);
      if (animal) {
        acc[date].push({
          ...animal,
          scientificName: animalsData.animals.find(a => a.id === id)?.scientificName
        });
      }
      return acc;
    }, {});

  const sortedDates = Object.keys(groupedByDate).sort((a, b) => new Date(b) - new Date(a));

  return (
    <TimelineContainer>
      <TimelineStart />
      {sortedDates.map((date) => (
        <TimelineItem key={date}>
          <TimelineDateContainer>
            <TimelineDate>
              {new Date(date).toLocaleDateString('nl-NL', {
                weekday: 'long',
                day: 'numeric',
                month: 'long'
              })}
            </TimelineDate>
          </TimelineDateContainer>
          {groupedByDate[date].map((animal) => (
            <TimelineCard key={animal.id}>
              <TimelineDot />
              <AnimalImage>
                <img 
                  src={`${process.env.PUBLIC_URL}/${animal.image}`}
                  alt={animal.name}
                  onError={(e) => {
                    console.log('Image error, using placeholder');
                    e.target.src = `${process.env.PUBLIC_URL}/images/animals/placeholder.webp`;
                  }}
                />
              </AnimalImage>
              <AnimalNameContainer>
                <AnimalName>
                  {animal.name}
                </AnimalName>
                <LatinName>
                  {animal.scientificName || 'Wetenschappelijke naam niet beschikbaar'}
                </LatinName>
              </AnimalNameContainer>
            </TimelineCard>
          ))}
        </TimelineItem>
      ))}
    </TimelineContainer>
  );
};

export default Timeline; 