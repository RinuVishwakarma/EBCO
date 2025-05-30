import * as React from 'react'
import clsx from 'clsx'
import { useMenu, MenuProvider } from '@mui/base/useMenu'
import { useMenuItem } from '@mui/base/useMenuItem'
import { Popper } from '@mui/base/Popper'
import { useDropdown, DropdownContext } from '@mui/base/useDropdown'
import { useMenuButton } from '@mui/base/useMenuButton'
import { useTheme } from '@mui/system'
import PersonOutlineOutlinedIcon from '@mui/icons-material/PersonOutlineOutlined'
import { customColors } from '@/styles/MuiThemeRegistry/theme'
import './Dropdown.css'
import { useAppDispatch, useAppSelector } from '@/store/reduxHooks'
import { useRouter } from 'next/navigation'
import { removeAuthToken } from '@/utils/authToken'
import { logout } from '@/store/authReducer'
import { setUrl } from '@/store/routeUrl'
import PersonIcon from '@mui/icons-material/Person'
import { Tooltip } from '@mui/material'
const Menu = React.forwardRef(function Menu(
  props: React.ComponentPropsWithoutRef<'ul'>,
  ref: React.Ref<HTMLUListElement>,
) {
  const { children, ...other } = props

  const { open, triggerElement, contextValue, getListboxProps } = useMenu({
    listboxRef: ref,
  })

  return (
    <Popper style={{ zIndex: 100000 }} open={open} anchorEl={triggerElement}>
      <ul className='menu-root' {...other} {...getListboxProps()}>
        <MenuProvider value={contextValue}>{children}</MenuProvider>
      </ul>
    </Popper>
  )
})

const MenuItem = React.forwardRef(function MenuItem(
  props: React.ComponentPropsWithoutRef<'li'>,
  ref: React.Ref<any>,
) {
  const { children, onClick, ...other } = props

  const { getRootProps, disabled, focusVisible } = useMenuItem({
    rootRef: ref,
  })

  const classes = {
    'focus-visible': focusVisible,
    'menu-item': true,
    disabled,
  }

  return (
    <li
      {...other}
      {...getRootProps({ onClick: onClick ?? (() => {}) })}
      className={clsx(classes)}
      style={{
        cursor: 'pointer',
        fontFamily: 'Uniform Medium !important',
        color: customColors.darkBlueEbco,
      }}
    >
      {children}
    </li>
  )
})

const MenuButton = React.forwardRef(function MenuButton(
  props: React.PropsWithChildren<{}>,
  forwardedRef: React.ForwardedRef<HTMLButtonElement>,
) {
  const { getRootProps: getButtonProps } = useMenuButton({
    rootRef: forwardedRef,
  })

  return (
    <span
      style={{
        border: 'none',
        padding: 0,
        margin: 0,
        height: '18px',
        width: '18px',
      }}
      {...props}
      {...getButtonProps()}
      className='header-icon'
      aria-label='menu'
    />
  )
})

export default function UseMenu() {
  const { contextValue: dropdownContextValue } = useDropdown()
  const router = useRouter()
  const auth = useAppSelector(state => state.auth).isLoggedIn
  const dispatch = useAppDispatch()
  const createHandleMenuClick = (menuItem: string) => {
    return () => {
      //console.log(`Clicked on ${menuItem}`);
    }
  }
  const routeToPage = (path: string) => {
    router.push(`/my-profile?tab=${path}`)
  }
  const handleLogout = () => {
    removeAuthToken()
    dispatch(logout())
  }
  const routeLogin = (route: string) => {
    if (!auth) {
      const currentUrl = window.location.pathname + window.location.search

      dispatch(
        setUrl({
          url: currentUrl,
        }),
      )
      router.push(route)
    }
  }

  return (
    <React.Fragment>
      <DropdownContext.Provider value={dropdownContextValue}>
        <MenuButton>
          {!auth ? (
            <PersonOutlineOutlinedIcon
              className='header-icon header-person-outlined'
              sx={{
                color: customColors.darkBlueEbco,
                margin: '0 !important',
                marginTop: '0px !important',
                marginLeft: '2px !important',
              }}
            />
          ) : (
            <Tooltip title='Profile' arrow>
              <PersonIcon
                className='header-icon header-person-outlined'
                sx={{
                  color: customColors.darkBlueEbco,
                  margin: '0 !important',
                  marginTop: '0px !important',
                  marginLeft: '2px !important',
                }}
              />
            </Tooltip>
          )}
        </MenuButton>
        <Menu id='hooks-menu'>
          {auth && (
            <MenuItem onClick={() => routeToPage('profile')}>Profile</MenuItem>
          )}
          {auth && <MenuItem onClick={() => handleLogout()}>Logout</MenuItem>}
          {!auth && (
            <MenuItem onClick={() => routeLogin('/login')}>Log In</MenuItem>
          )}
          {!auth && (
            <MenuItem onClick={() => routeLogin('/signup')}>New User</MenuItem>
          )}
        </Menu>
      </DropdownContext.Provider>
      <Styles />
    </React.Fragment>
  )
}

const blue = {
  50: '#F0F7FF',
  100: '#C2E0FF',
  200: '#99CCF3',
  300: '#66B2FF',
  400: '#3399FF',
  500: '#007FFF',
  600: '#0072E6',
  700: '#0059B3',
  800: '#004C99',
  900: '#003A75',
}

const grey = {
  50: '#F3F6F9',
  100: '#E5EAF2',
  200: '#DAE2ED',
  300: '#C7D0DD',
  400: '#B0B8C4',
  500: '#9DA8B7',
  600: '#6B7A90',
  700: '#434D5B',
  800: '#303740',
  900: '#1C2025',
}

function useIsDarkMode() {
  const theme = useTheme()
  return theme.palette.mode === 'dark'
}

function Styles() {
  // Replace this with your app logic for determining dark mode
  const isDarkMode = useIsDarkMode()

  const styles = `
    .menu-root {
      font-family: 'Uniform Medium' !important;
      font-size: 0.875rem;
      box-sizing: border-box;
      padding: 5px;
      margin: 10px 0;
      min-width: 200px;
      background: #fff;
      border: 1px solid ${grey[200]};
      border-radius: 0.75em;
      color: ${grey[900]};
      overflow: auto;
      outline: 0px;
      box-shadow: 0 4px 6px 0 rgba(0, 0, 0, 0.05);
    }

    .mode-dark .menu-root {
      background: ${grey[900]};
      border-color: ${grey[700]};
      color: ${grey[300]};
      box-shadow: 0px 2px 6px rgba(0, 0, 0, 0.5);
    }

    .menu-item {
      list-style: none;
      padding: 8px;
      border-radius: 0.45em;
      cursor: default;
      user-select: none;
    }

    .menu-item:last-of-type {
      border-bottom: none;
    }

    .menu-item:focus {
      background-color: ${grey[100]};
      color: ${grey[900]};
      outline: 0;
    }

    .mode-dark .menu-item:focus {
      background-color: ${grey[800]};
      color: ${grey[300]};
    }

    .menu-item.disabled {
      color: ${grey[400]};
    }

  .mode-dark .menu-item.disabled {
    color: ${grey[700]};
  }

    .button {
      font-family: 'Uniform Medium' !important;
      font-weight: 600;
      font-size: 0.875rem;
      line-height: 1.5;
      padding: 8px 16px;
      border-radius: 8px;
      color: white;
      transition: all 150ms ease;
      cursor: pointer;
      background: ${isDarkMode ? grey[900] : '#fff'};
      border: 1px solid ${isDarkMode ? grey[700] : grey[200]};
      color: ${isDarkMode ? grey[200] : grey[900]};
      box-shadow: 0 1px 2px 0 rgb(0 0 0 / 0.05);

      &:hover {
        background: ${isDarkMode ? grey[800] : grey[50]};
        border-color: ${isDarkMode ? grey[600] : grey[300]};
      }

      &:active {
        background: ${isDarkMode ? grey[700] : grey[100]};
      }

      &:focus-visible {
        box-shadow: 0 0 0 4px ${isDarkMode ? blue[300] : blue[200]};
        outline: none;
      }
    }
  `

  // eslint-disable-next-line react/no-danger
  return <style dangerouslySetInnerHTML={{ __html: styles }} />
}
