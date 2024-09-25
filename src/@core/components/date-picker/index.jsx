// MUI Imports
import Box from '@mui/material/Box'
import { styled } from '@mui/material/styles'

// Third-Party Imports
import ReactDatePickerComponent from 'react-datepicker'

// Styles
import 'react-datepicker/dist/react-datepicker.css'

// Styled Components
const StyledReactDatePicker = styled(Box)(({ theme }) => ({
  '.react-datepicker': {
    backgroundColor: theme.palette.background.red,
    border: `1px solid ${theme.palette.divider}`,
    borderRadius: theme.shape.borderRadius,
    boxShadow: theme.shadows[3],
    padding: theme.spacing(2)
  },
  '.react-datepicker__header': {
    backgroundColor: theme.palette.background.red,
    borderBottom: `1px solid ${theme.palette.divider}`
  },
  '.react-datepicker__current-month, .react-datepicker-time__header': {
    color: theme.palette.text.primary,
    fontWeight: 600
  },
  '.react-datepicker__day': {
    margin: 0 // Remove margin from each day
  },
  '.react-datepicker__day:hover': {
    borderRadius: '50% !important',
    color: 'white !important',
    backgroundColor: '#7367f0 !important'
  },
  '.react-datepicker__day-name, .react-datepicker__day, .react-datepicker__time-name': {
    color: theme.palette.text.primary,
    fontWeight: 400,
    width: '2.5rem',
    height: '2.5rem',
    lineHeight: '2.5rem',
    borderRadius: '50%', // Full border-radius applied to all days
    transition: 'all 0.3s ease',
    '&:hover': {
      backgroundColor: '#e8e7fd', // Light blue on hover
      color: theme.palette.common.white // White text on hover
    }
  },
  '.react-datepicker__day--in-selecting-range': {
    backgroundColor: '#e8e7fd !important', // Light blue while selecting
    color: '#7367f0 !important',
    borderRadius: '0% !important' // Full border-radius for days being selected in range
  },
  '.react-datepicker__day--selected': {
    backgroundColor: '#7367f0 !important', // Light blue background for selected day
    color: 'white !important',
    borderRadius: '50% !important', // Full border-radius for selected day
    '&:hover': {
      backgroundColor: '#e8e7fd', // Keep same color on hover when selected
      color: theme.palette.common.white
    }
  },
  '.react-datepicker__day--in-range': {
    backgroundColor: '#e8e7fd', // Light blue color for in-range dates
    color: '#7367f0',
    borderRadius: '0%' // Full border-radius for in-range days
  },
  '.react-datepicker__day--range-start': {
    backgroundColor: '#7367f0', // Custom color for the start of the range
    color: theme.palette.common.white,
    borderRadius: '18px 0px 0px 18px !important' // Full border-radius for range start
  },
  '.react-datepicker__day--range-end': {
    backgroundColor: '#7367f0 !important', // Custom color for the end of the range
    color: theme.palette.common.white,
    borderRadius: '0px 18px 18px 0px !important'
  },
  '.react-datepicker__navigation': {
    top: '10px',
    '&:hover': {
      backgroundColor: theme.palette.action.hover
    },
    '&::before': {
      borderColor: theme.palette.text.primary
    }
  },
  '.react-datepicker__day--keyboard-selected': {
    backgroundColor: '#e8e7fd', // Light blue for keyboard selection
    color: theme.palette.common.white,
    borderRadius: '50%', // Full border-radius for keyboard-selected day
    '&:hover': {
      backgroundColor: '#e8e7fd',
      color: theme.palette.common.white
    }
  },
  '.react-datepicker__day--today': {
    border: `1px solid ${theme.palette.primary.main}`,
    backgroundColor: 'transparent',
    color: theme.palette.primary.main,
    fontWeight: 600,
    borderRadius: '50%' // Full border-radius for today's date
  }
}))

// Component to render the date-picker
const AppReactDatepicker = props => {
  const { boxProps, ...rest } = props

  return (
    <StyledReactDatePicker {...boxProps}>
      <ReactDatePickerComponent {...rest} />
    </StyledReactDatePicker>
  )
}

export default AppReactDatepicker
