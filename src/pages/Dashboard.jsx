import { useEffect, useState } from 'react'
import Alert from '@mui/material/Alert'
import Box from '@mui/material/Box'
import Button from '@mui/material/Button'
import Typography from '@mui/material/Typography'
import CircularProgress from '@mui/material/CircularProgress'
import Divider from '@mui/material/Divider'
import { useNavigate } from 'react-router-dom'
import { fetchUserAPI, logoutAPI } from '~/apis'
import Setup2FA from '~/components/setup-2fa'
import Require2FA from '~/components/require-2fa'

function Dashboard() {
  const [user, setUser] = useState(null)
  const [openSetup2FA, setOpenSetup2FA] = useState(false)
  const navigate = useNavigate()

  useEffect(() => {
    const fetchData = async () => {
      const user = await fetchUserAPI()
      setUser(user)
    }
    fetchData()
  }, [])

  const handleLogout = async () => {
    await logoutAPI(user._id)
    localStorage.removeItem('userInfo')
    navigate('/login')
  }

  const handleSuccessSetup2FA = (updatedUser) => {
    setUser(updatedUser)
    localStorage.setItem('userInfo', JSON.stringify(updatedUser))
    setOpenSetup2FA(false)
  }

  const handleSuccessVerify2FA = (updatedUser) => {
    setUser(updatedUser)
    localStorage.setItem('userInfo', JSON.stringify(updatedUser))
  }

  if (!user) {
    return (
      <Box sx={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        gap: 2,
        width: '100vw',
        height: '100vh'
      }}>
        <CircularProgress />
        <Typography>Loading dashboard user...</Typography>
      </Box>
    )
  }

  return (
    <Box sx={{
      maxWidth: '1120px',
      margin: '1em auto',
      display: 'flex',
      justifyContent: 'center',
      flexDirection: 'column',
      gap: 1,
      padding: '0 1em'
    }}>
      {/* 2FA Setup Modal */}
      <Setup2FA
        isOpen={openSetup2FA}
        toggleOpen={setOpenSetup2FA}
        user={user}
        handleSuccessSetup2FA={handleSuccessSetup2FA}
      />

      {/* 2FA Verification Modal - shown when 2FA is enabled but not yet verified */}
      {user.require_2fa && !user.is_2fa_verified &&
        <Require2FA
          user={user}
          handleSuccessVerify2FA={handleSuccessVerify2FA}
        />
      }

      <Box>
        <a style={{ color: 'inherit', textDecoration: 'none' }} href='https://github.com/trander-25' target='_blank' rel='noreferrer'>
          <img
            style={{ width: '100%', height: '180px', borderRadius: '6px', objectFit: 'cover' }}
            src="src/assets/trander-logo.png"
            alt="trander"
          />
        </a>
      </Box>

      <Alert severity="info" sx={{ '.MuiAlert-message': { overflow: 'hidden' } }}>
        This is the Dashboard page accessible only after user:&nbsp;
        <Typography variant="span" sx={{ fontWeight: 'bold', '&:hover': { color: '#e67e22', cursor: 'pointer' } }}>
          {user.email}
        </Typography>
        &nbsp;successfully logs in.
      </Alert>

      <Alert severity={`${user.require_2fa ? 'success' : 'warning'}`} sx={{ '.MuiAlert-message': { overflow: 'hidden' } }}>
        Account Security Status:&nbsp;
        <Typography variant="span" sx={{ fontWeight: 'bold', '&:hover': { color: '#e67e22', cursor: 'pointer' } }}>
          Two-Factor Authentication (2FA) is {user.require_2fa ? 'Enabled' : 'Disabled'}
        </Typography>
      </Alert>

      <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'end', gap: 2, mt: 1 }}>
        {!user.require_2fa &&
          <Button
            type='button'
            variant='contained'
            color='warning'
            size='large'
            sx={{ maxWidth: 'max-content' }}
            onClick={() => setOpenSetup2FA(true)}
          >
            Enable 2FA
          </Button>
        }

        <Button
          type='button'
          variant='contained'
          color='info'
          size='large'
          sx={{ maxWidth: 'max-content' }}
          onClick={handleLogout}
        >
          Logout
        </Button>
      </Box>

      <Divider sx={{ my: 2 }} />

      <Box sx={{ textAlign: 'right' }}>
        Author:&nbsp;
        <Typography variant="span" sx={{ fontWeight: 'bold', '&:hover': { color: '#fdba26' } }}>
          <a style={{ color: 'inherit', textDecoration: 'none' }} href='https://github.com/trander-25' target='_blank' rel='noreferrer'>
            Trander
          </a>
        </Typography>
      </Box>
    </Box>
  )
}

export default Dashboard
