import React from 'react';
import { Tooltip, Typography } from '@mui/material';

const HoverTranslation = ({ traditionalText, cyrillicText, language, ...props }) => {
  if (language !== 'traditional') {
    return <Typography {...props}>{cyrillicText}</Typography>;
  }

  return (
    <Tooltip title={cyrillicText} placement="top" arrow>
      <Typography
        {...props}
        sx={{
          writingMode: 'vertical-rl',
          textOrientation: 'mixed',
          cursor: 'help',
          ...props.sx,
        }}
      >
        {traditionalText}
      </Typography>
    </Tooltip>
  );
};

export default HoverTranslation;