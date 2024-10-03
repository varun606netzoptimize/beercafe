import { CircularProgress, Box } from '@mui/material';

const CustomLoadingOverlay = () => {
  return (
    <Box
      sx={{
        position: 'absolute',
        top: 0,
        left: 0,
        width: '100%',
        height: '100%',
        backgroundColor: 'rgba(248 247 250 / 0.38)', // Dark transparent background
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        zIndex: 1300, // Ensure the overlay is above other elements
      }}
    >
      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
        <div className="loader" />
        <CircularProgress size={28} sx={{ marginX: 'auto' }} />
      </div>
    </Box>
  );
};

export default CustomLoadingOverlay;
