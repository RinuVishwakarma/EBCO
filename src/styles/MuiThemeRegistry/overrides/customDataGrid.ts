// ** MUI Imports
import { Theme } from '@mui/material/styles'

const CustomDataGrid = (theme: Theme) => {
  return {
    MuiDataGrid: {
      styleOverrides: {
        root: {
          // border: 0,
          color: 'rgba(58, 53, 65, 0.87)',
          '& .MuiDataGrid-columnHeader:focus, & .MuiDataGrid-columnHeader:focus-within': {
            outline: 'none'
          }
        },
        toolbarContainer: {
          paddingRight: '1.25rem !important',
          paddingLeft: '0.8125rem !important'
        },
        columnHeaders: {
          maxHeight: '54px !important',
          minHeight: '54px !important',
          lineHeight: '24px !important',
          backgroundColor: '#F9FAFC'
        },
        columnHeader: {
          height: '54px',
          '&:not(.MuiDataGrid-columnHeaderCheckbox)': {
            padding: '1rem',
            '&:first-of-type': {
              paddingLeft: '1.25rem'
            }
          },
          '&:last-of-type': {
            paddingRight: '1.25rem'
          }
        },
        columnHeaderCheckbox: {
          maxWidth: '58px !important',
          minWidth: '58px !important'
        },
        columnHeaderTitleContainer: {
          padding: 0
        },
        columnHeaderTitle: {
          fontWeight: 600,
          fontSize: '0.75rem',
          letterSpacing: '0.17px',
          textTransform: 'uppercase'
        },
        columnSeparator: {
          color: 'rgba(58, 53, 65, 0.12)'
        },

        row: {
          '&:last-child': {
            '& .MuiDataGrid-cell': {
              borderBottom: 0
            }
          }
        },
        cell: {
          maxHeight: '50px !important',
          minHeight: '50px !important',
          lineHeight: '20px !important',
          borderColor: 'rgba(58, 53, 65, 0.12)',
          '&:not(.MuiDataGrid-cellCheckbox)': {
            padding: '1rem',
            '&:first-of-type': {
              paddingLeft: '1.25rem'
            }
          },
          '&:last-of-type': {
            paddingRight: '1.25rem'
          },
          '&:focus, &:focus-within': {
            outline: 'none'
          }
        },
        cellCheckbox: {
          maxWidth: '58px !important',
          minWidth: '58px !important'
        },
        editInputCell: {
          padding: 0,
          color: 'rgba(58, 53, 65, 0.87)',
          '& .MuiInputBase-input': {
            padding: 0
          }
        },
        footerContainer: {
          minHeight: '50px !important',
          borderTop: '1px solid rgba(58, 53, 65, 0.12)',
          '& .MuiTablePagination-toolbar': {
            minHeight: '50px !important'
          },
          '& .MuiTablePagination-displayedRows, & .MuiTablePagination-selectLabel': {
            color: 'rgba(58, 53, 65, 0.87)'
          }
        }
      },
      defaultProps: {
        rowHeight: 50,
        headerHeight: 54
      }
    }
  }
}

export default CustomDataGrid
